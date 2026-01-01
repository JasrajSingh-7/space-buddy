import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";

type CelestialObject = Tables<"celestial_objects">;

interface DiscoveryCardProps {
  object: CelestialObject;
  className?: string;
  animationDelay?: number;
}

export function DiscoveryCard({
  object,
  className,
  animationDelay = 0,
}: DiscoveryCardProps) {
  const formatObjectType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Link
      to={`/object/${object.slug}`}
      className={cn(
        "glass-card min-w-[180px] p-4 flex-shrink-0",
        "transition-all duration-300 hover:border-pale-nebula/40",
        "group block animate-fade-in",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Image placeholder */}
      <div className="w-full h-24 rounded-lg bg-gradient-to-br from-secondary to-muted mb-3 flex items-center justify-center overflow-hidden">
        {object.thumbnail_url ? (
          <img
            src={object.thumbnail_url}
            alt={object.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Sparkles className="w-8 h-8 text-muted-foreground/50 group-hover:text-pale-nebula/60 transition-colors" />
        )}
      </div>

      {/* Content */}
      <h3 className="font-heading font-medium text-sm text-foreground line-clamp-1 mb-1">
        {object.name}
      </h3>
      <div className="flex items-center gap-2">
        <span className="text-2xs text-pale-nebula">
          {formatObjectType(object.object_type)}
        </span>
        {object.discovery_year && (
          <>
            <span className="text-2xs text-muted-foreground">•</span>
            <span className="text-2xs text-muted-foreground">
              {object.discovery_year}
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
