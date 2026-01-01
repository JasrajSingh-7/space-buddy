-- Shunya Database Schema
-- Tables for CelestialObjects, Categories, Discoveries, and Events

-- Create enum for object types
CREATE TYPE public.celestial_object_type AS ENUM (
  'planet',
  'star', 
  'galaxy',
  'nebula',
  'asteroid',
  'comet',
  'black_hole',
  'moon',
  'exoplanet',
  'constellation'
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  object_count INTEGER DEFAULT 0,
  featured_object_id UUID,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on categories (public read)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON public.categories FOR SELECT
  USING (true);

-- Celestial Objects table
CREATE TABLE public.celestial_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  object_type celestial_object_type NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  
  -- Discovery information
  discovery_date DATE,
  discovery_year INTEGER,
  discoverer TEXT,
  discovery_location TEXT,
  discovery_story TEXT,
  
  -- Physical properties
  distance_light_years NUMERIC,
  mass TEXT,
  radius TEXT,
  temperature TEXT,
  age TEXT,
  
  -- Descriptive content
  short_description TEXT,
  detailed_description TEXT,
  scientific_classification TEXT,
  
  -- Location
  constellation TEXT,
  right_ascension TEXT,
  declination TEXT,
  
  -- Media
  primary_image_url TEXT,
  thumbnail_url TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  is_featured BOOLEAN DEFAULT false,
  featured_date DATE,
  view_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on celestial_objects (public read)
ALTER TABLE public.celestial_objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Celestial objects are publicly readable"
  ON public.celestial_objects FOR SELECT
  USING (true);

-- Create index for search
CREATE INDEX idx_celestial_objects_name ON public.celestial_objects USING gin(to_tsvector('english', name));
CREATE INDEX idx_celestial_objects_type ON public.celestial_objects(object_type);
CREATE INDEX idx_celestial_objects_category ON public.celestial_objects(category_id);
CREATE INDEX idx_celestial_objects_featured ON public.celestial_objects(is_featured, featured_date DESC);

-- Discoveries table (for timeline feature)
CREATE TABLE public.discoveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discovery_date DATE NOT NULL,
  discovery_year INTEGER NOT NULL,
  discoverer TEXT,
  significance TEXT,
  celestial_object_id UUID REFERENCES public.celestial_objects(id) ON DELETE SET NULL,
  image_url TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on discoveries (public read)
ALTER TABLE public.discoveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Discoveries are publicly readable"
  ON public.discoveries FOR SELECT
  USING (true);

CREATE INDEX idx_discoveries_date ON public.discoveries(discovery_date);
CREATE INDEX idx_discoveries_year ON public.discoveries(discovery_year);

-- Astronomical Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  event_year INTEGER,
  event_type TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT,
  related_object_id UUID REFERENCES public.celestial_objects(id) ON DELETE SET NULL,
  image_url TEXT,
  visibility_info TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on events (public read)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are publicly readable"
  ON public.events FOR SELECT
  USING (true);

CREATE INDEX idx_events_date ON public.events(event_date);

-- Daily Facts table (for the daily featured content)
CREATE TABLE public.daily_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fact_date DATE NOT NULL UNIQUE,
  celestial_object_id UUID REFERENCES public.celestial_objects(id) ON DELETE SET NULL,
  custom_title TEXT,
  custom_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on daily_facts (public read)
ALTER TABLE public.daily_facts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Daily facts are publicly readable"
  ON public.daily_facts FOR SELECT
  USING (true);

CREATE INDEX idx_daily_facts_date ON public.daily_facts(fact_date DESC);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_celestial_objects_updated_at
  BEFORE UPDATE ON public.celestial_objects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update category object count
CREATE OR REPLACE FUNCTION public.update_category_object_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.category_id IS NOT NULL THEN
    UPDATE public.categories SET object_count = object_count + 1 WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' AND OLD.category_id IS NOT NULL THEN
    UPDATE public.categories SET object_count = object_count - 1 WHERE id = OLD.category_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.category_id IS DISTINCT FROM NEW.category_id THEN
      IF OLD.category_id IS NOT NULL THEN
        UPDATE public.categories SET object_count = object_count - 1 WHERE id = OLD.category_id;
      END IF;
      IF NEW.category_id IS NOT NULL THEN
        UPDATE public.categories SET object_count = object_count + 1 WHERE id = NEW.category_id;
      END IF;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_category_count
  AFTER INSERT OR UPDATE OR DELETE ON public.celestial_objects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_category_object_count();