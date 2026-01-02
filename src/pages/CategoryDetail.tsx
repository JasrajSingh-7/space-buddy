import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react"; // Added useEffect
import { useCategory } from "@/hooks/useCategories";
// Removed useCelestialObjects import
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BottomNav } from "@/components/BottomNav";
import { getCategoryIcon } from "@/lib/icons";
import {
  ArrowLeft,
  Grid3X3,
  List,
  Sparkles,
  Calendar,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 1. We define a flexible type for our NASA items
type NasaObject = {
  id: string;
  name: string;
  slug: string;
  thumbnail_url: string | null;
  object_type: string;
  discovery_year: number | null;
  distance_light_years: string | null;
  short_description: string | null;
  constellation: string | null;
};

type SortOption = "name" | "discovery" | "distance";

const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading: categoryLoading } = useCategory(slug || "");
  
  // 2. REPLACED: Instead of the database hook, we use State to hold NASA data
  const [allObjects, setAllObjects] = useState<NasaObject[]>([]);
  const [objectsLoading, setObjectsLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  // 3. ADDED: The NASA Fetcher & Translator
  useEffect(() => {
    if (!slug) return;

    const fetchNasaData = async () => {
      setObjectsLoading(true);
      try {
        // We search NASA for the category name (e.g., "Nebula")
        // We limit to 100 items for speed, but you can increase this
        const response = await fetch(`https://images-api.nasa.gov/search?q=${slug}&media_type=image&page_size=100`);
        const data = await response.json();

        // THE TRANSLATOR: Converting NASA data to Your App's format
        const nasaItems = data.collection.items.map((item: any) => ({
          id: item.data[0].nasa_id,
          // NASA title becomes Name
          name: item.data[0].title, 
          // Create a slug from the title
          slug: item.data[0].title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          // Get the image URL
          thumbnail_url: item.links ? item.links[0].href : null,
          // We assign the current category as the type so it shows up
          object_type: slug.endsWith('s') ? slug.slice(0, -1) : slug, 
          // Parse year from date_created (e.g., "2005-01-01")
          discovery_year: item.data[0].date_created ? parseInt(item.data[0].date_created.substring(0, 4)) : null,
          // NASA doesn't give distance, so we leave it null for now
          distance_light_years: null,
          short_description: item.data[0].description || "No description available from NASA.",
          constellation: null
        }));

        setAllObjects(nasaItems);
      } catch (error) {
        console.error("Failed to fetch NASA data", error);
      } finally {
        setObjectsLoading(false);
      }
    };

    fetchNasaData();
  }, [slug]);

  const isLoading = categoryLoading || objectsLoading;

  // Sorting Logic (kept the same)
  const sortedObjects = [...allObjects].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "discovery":
        return (b.discovery_year || 0) - (a.discovery_year || 0);
      case "distance":
        return 0; // NASA API doesn't allow distance sorting easily
      default:
        return 0;
    }
  });

  const formatObjectType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const Icon = slug ? getCategoryIcon(slug) : Sparkles;

  if (!categoryLoading && !category) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Sparkles className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="font-heading text-xl text-foreground mb-2">Category Not Found</h1>
        <Link to="/categories">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <div className="fixed inset-0 star-field opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="px-4 py-4 flex items-center gap-4">
          <Link to="/categories">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-pale-nebula" />
                  <h1 className="font-heading text-xl font-semibold truncate">
                    {category?.name}
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                   Listing objects from NASA Database
                </p>
              </>
            )}
          </div>
          <span className="text-sm text-muted-foreground bg-secondary/60 px-2 py-1 rounded-full shrink-0">
            {sortedObjects.length} objects
          </span>
        </div>

        {/* Removed complicated Subcategory Filters for now to prevent bugs with NASA data */}
        
        {/* Sort & View Controls */}
        <div className="px-4 pb-3 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-secondary/60 text-foreground text-sm rounded-lg px-3 py-1.5 border border-border/40 focus:outline-none focus:ring-1 focus:ring-pale-nebula"
            >
              <option value="name">Name A-Z</option>
              <option value="discovery">Discovery Date</option>
            </select>
          </div>
          <div className="flex gap-1 bg-secondary/40 rounded-lg p-1">
            <button onClick={() => setViewMode("grid")} className={cn("p-1.5 rounded-md", viewMode === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground")}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={cn("p-1.5 rounded-md", viewMode === "list" ? "bg-secondary text-foreground" : "text-muted-foreground")}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 px-4 py-4">
        {isLoading ? (
          <div className={cn(viewMode === "grid" ? "grid grid-cols-2 gap-3" : "space-y-3")}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-4">
                <Skeleton className="w-full h-24 rounded-lg mb-3" />
                <Skeleton className="h-5 w-24 mb-2" />
              </div>
            ))}
          </div>
        ) : sortedObjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="font-heading text-lg text-foreground mb-2">No Objects Found</h2>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {sortedObjects.map((obj, index) => (
              <Link
                key={obj.id}
                to={`/object/${obj.slug}`}
                className="glass-card p-3 group animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="w-full h-24 rounded-lg bg-gradient-to-br from-secondary to-muted mb-3 flex items-center justify-center overflow-hidden">
                  {obj.thumbnail_url ? (
                    <img
                      src={obj.thumbnail_url}
                      alt={obj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                  )}
                </div>
                <h3 className="font-heading font-medium text-sm text-foreground line-clamp-1 mb-1">
                  {obj.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xs text-pale-nebula">
                    {formatObjectType(obj.object_type)}
                  </span>
                  {obj.discovery_year && (
                    <span className="text-2xs text-muted-foreground">• {obj.discovery_year}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedObjects.map((obj, index) => (
              <Link
                key={obj.id}
                to={`/object/${obj.slug}`}
                className="glass-card p-4 flex gap-4 group animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-secondary to-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {obj.thumbnail_url ? (
                    <img
                      src={obj.thumbnail_url}
                      alt={obj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Sparkles className="w-6 h-6 text-muted-foreground/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-medium text-foreground mb-1 line-clamp-1">
                    {obj.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                      {obj.short_description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default CategoryDetail;
