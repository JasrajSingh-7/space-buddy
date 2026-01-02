import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useCategories, useCategory } from "@/hooks/useCategories";
import { useCelestialObjects } from "@/hooks/useCelestialObjects";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BottomNav } from "@/components/BottomNav";
import { getCategoryIcon } from "@/lib/icons";
import { Database } from "@/integrations/supabase/types";
import {
  ArrowLeft,
  Grid3X3,
  List,
  Sparkles,
  Calendar,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CelestialObjectType = Database["public"]["Enums"]["celestial_object_type"];

// Subcategory filters based on object types
const objectTypeFilters: Record<string, { label: string; types: CelestialObjectType[] }[]> = {
  planets: [
    { label: "All", types: ["planet", "exoplanet", "moon"] },
    { label: "Planets", types: ["planet"] },
    { label: "Exoplanets", types: ["exoplanet"] },
    { label: "Moons", types: ["moon"] },
  ],
  stars: [
    { label: "All", types: ["star"] },
    { label: "Stars", types: ["star"] },
  ],
  galaxies: [
    { label: "All", types: ["galaxy"] },
    { label: "Galaxies", types: ["galaxy"] },
  ],
  nebulas: [
    { label: "All", types: ["nebula"] },
    { label: "Nebulas", types: ["nebula"] },
  ],
  "black-holes": [
    { label: "All", types: ["black_hole"] },
    { label: "Black Holes", types: ["black_hole"] },
  ],
  asteroids: [
    { label: "All", types: ["asteroid", "comet"] },
    { label: "Asteroids", types: ["asteroid"] },
    { label: "Comets", types: ["comet"] },
  ],
  comets: [
    { label: "All", types: ["comet"] },
    { label: "Comets", types: ["comet"] },
  ],
  constellations: [
    { label: "All", types: ["constellation"] },
    { label: "Constellations", types: ["constellation"] },
  ],
};

type SortOption = "name" | "discovery" | "distance";

const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading: categoryLoading } = useCategory(slug || "");
  const { data: allObjects, isLoading: objectsLoading } = useCelestialObjects({
    categoryId: category?.id,
    limit: 100,
  });

  const [activeFilter, setActiveFilter] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const isLoading = categoryLoading || objectsLoading;

  // Get filters for this category
  const filters = slug ? objectTypeFilters[slug] || [{ label: "All", types: [] }] : [];

  // Filter objects based on active filter
  const filteredObjects = allObjects?.filter((obj) => {
    if (activeFilter === 0 || filters.length === 0) return true;
    const selectedTypes = filters[activeFilter]?.types || [];
    return selectedTypes.includes(obj.object_type);
  }) || [];

  // Sort objects
  const sortedObjects = [...filteredObjects].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "discovery":
        return (b.discovery_year || 0) - (a.discovery_year || 0);
      case "distance":
        return (Number(a.distance_light_years) || Infinity) - (Number(b.distance_light_years) || Infinity);
      default:
        return 0;
    }
  });

  const formatObjectType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const Icon = slug ? getCategoryIcon(slug) : Sparkles;

  if (!categoryLoading && !category) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Sparkles className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="font-heading text-xl text-foreground mb-2">Category Not Found</h1>
        <p className="text-muted-foreground text-center mb-6">
          The category you're looking for doesn't exist.
        </p>
        <Link to="/categories">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Star field background */}
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
                {category?.description && (
                  <p className="text-sm text-muted-foreground truncate">
                    {category.description}
                  </p>
                )}
              </>
            )}
          </div>
          <span className="text-sm text-muted-foreground bg-secondary/60 px-2 py-1 rounded-full shrink-0">
            {sortedObjects.length} objects
          </span>
        </div>

        {/* Subcategory Filters */}
        {filters.length > 1 && (
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {filters.map((filter, index) => (
              <button
                key={filter.label}
                onClick={() => setActiveFilter(index)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  activeFilter === index
                    ? "bg-pale-nebula text-background"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

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
              <option value="distance">Distance</option>
            </select>
          </div>
          <div className="flex gap-1 bg-secondary/40 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 px-4 py-4">
        {isLoading ? (
          <div className={cn(
            viewMode === "grid" ? "grid grid-cols-2 gap-3" : "space-y-3"
          )}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-4">
                <Skeleton className="w-full h-24 rounded-lg mb-3" />
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        ) : sortedObjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="font-heading text-lg text-foreground mb-2">No Objects Found</h2>
            <p className="text-muted-foreground text-center text-sm">
              No celestial objects match the current filter.
            </p>
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
                {/* Image */}
                <div className="w-full h-24 rounded-lg bg-gradient-to-br from-secondary to-muted mb-3 flex items-center justify-center overflow-hidden">
                  {obj.thumbnail_url ? (
                    <img
                      src={obj.thumbnail_url}
                      alt={obj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Sparkles className="w-8 h-8 text-muted-foreground/50 group-hover:text-pale-nebula/60 transition-colors" />
                  )}
                </div>
                
                {/* Content */}
                <h3 className="font-heading font-medium text-sm text-foreground line-clamp-1 mb-1">
                  {obj.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xs text-pale-nebula">
                    {formatObjectType(obj.object_type)}
                  </span>
                  {obj.discovery_year && (
                    <>
                      <span className="text-2xs text-muted-foreground">•</span>
                      <span className="text-2xs text-muted-foreground">
                        {obj.discovery_year}
                      </span>
                    </>
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
                {/* Thumbnail */}
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
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-medium text-foreground mb-1 line-clamp-1">
                    {obj.name}
                  </h3>
                  <span className="inline-block text-2xs text-pale-nebula mb-2">
                    {formatObjectType(obj.object_type)}
                  </span>
                  {obj.short_description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {obj.short_description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    {obj.discovery_year && (
                      <div className="flex items-center gap-1 text-2xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {obj.discovery_year}
                      </div>
                    )}
                    {obj.constellation && (
                      <div className="flex items-center gap-1 text-2xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {obj.constellation}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default CategoryDetail;
