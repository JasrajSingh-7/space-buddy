import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";

type CelestialObject = Tables<"celestial_objects">;

interface DailyFactCardProps {
  object: CelestialObject;
  className?: string;
}

export function DailyFactCard({ object, className }: DailyFactCardProps) {
  return (
    <Link
      to={`/object/${object.slug}`}
      className={cn("block animate-fade-in group", className)}
    >
      <div className="glass-card p-6 relative overflow-hidden transition-all duration-300 hover:border-pale-nebula/40">
        {/* Background glow effect */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pale-nebula/20 to-cosmic-purple/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-nebula-pink/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Label */}
        <span className="relative text-2xs uppercase tracking-wider text-pale-nebula font-medium">
          Daily Discovery
        </span>

        {/* Title */}
        <h1 className="relative font-heading text-2xl font-semibold mt-2 mb-3 text-foreground group-hover:text-pale-nebula transition-colors">
          {object.name}
        </h1>

        {/* Description */}
        <p className="relative text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {object.short_description || object.detailed_description}
        </p>

        {/* Discovery info */}
        {(object.discovery_year || object.discoverer) && (
          <div className="relative flex items-center gap-2 mt-4 text-2xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>
              {object.discovery_year && `Discovered ${object.discovery_year}`}
              {object.discovery_year && object.discoverer && " by "}
              {object.discoverer}
            </span>
          </div>
        )}

        {/* View indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-2xs text-pale-nebula">Learn more →</span>
        </div>
      </div>
    </Link>
  );
}
