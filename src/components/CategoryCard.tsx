import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  name: string;
  slug: string;
  objectCount: number | null;
  icon: LucideIcon;
  description?: string | null;
  className?: string;
  animationDelay?: number;
}

export function CategoryCard({
  name,
  slug,
  objectCount,
  icon: Icon,
  description,
  className,
  animationDelay = 0,
}: CategoryCardProps) {
  return (
    <Link
      to={`/categories/${slug}`}
      className={cn(
        "glass-card p-4 text-left transition-all duration-300",
        "hover:border-pale-nebula/40 hover:bg-secondary/40",
        "group block animate-fade-in",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pale-nebula/20 to-cosmic-purple/20 flex items-center justify-center group-hover:from-pale-nebula/30 group-hover:to-cosmic-purple/30 transition-colors">
          <Icon className="w-5 h-5 text-pale-nebula" />
        </div>
        {objectCount !== null && objectCount > 0 && (
          <span className="text-2xs text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">
            {objectCount}
          </span>
        )}
      </div>
      <h3 className="font-heading font-medium text-foreground mb-1">{name}</h3>
      {description && (
        <p className="text-2xs text-muted-foreground line-clamp-2">{description}</p>
      )}
    </Link>
  );
}
