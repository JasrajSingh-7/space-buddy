import { useState } from 'react';
import { Star, Globe, Disc, Activity, Rocket, Loader2 } from 'lucide-react';
import { useNasaData, NasaCategory } from '@/hooks/useNasaData';
import { cn } from '@/lib/utils';

const CATEGORY_TABS = [
  { id: 'Planet' as NasaCategory, icon: Globe, label: 'Planets' },
  { id: 'Galaxy' as NasaCategory, icon: Disc, label: 'Galaxies' },
  { id: 'Nebula' as NasaCategory, icon: Activity, label: 'Nebulas' },
  { id: 'Star' as NasaCategory, icon: Star, label: 'Stars' },
  { id: 'Exotic' as NasaCategory, icon: Rocket, label: 'Cosmic Extremes' },
];

export function NasaExplorer() {
  const [category, setCategory] = useState<NasaCategory>('Planet');
  const { items, loading, error } = useNasaData(category);

  return (
    <section className="mb-8">
      {/* Category Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-semibold">NASA Database</h2>
        <span className="text-2xs text-muted-foreground font-mono">
          Live API
        </span>
      </div>

      <nav className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategory(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium",
              category === tab.id
                ? "bg-pale-nebula text-background shadow-lg shadow-pale-nebula/20 scale-105"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Loading State */}
      {loading && (
        <div className="glass-card p-8 flex flex-col items-center justify-center text-muted-foreground">
          <Loader2 className="animate-spin mb-3 text-pale-nebula" size={32} />
          <p className="text-sm">Fetching from NASA Database...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="glass-card p-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Content Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.slice(0, 8).map((item) => (
            <div
              key={item.id}
              className="glass-card overflow-hidden group hover:border-pale-nebula/30 transition-all duration-300"
            >
              {/* Image */}
              <div className="h-36 overflow-hidden relative bg-background">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-heading text-sm font-semibold text-foreground leading-tight mb-2 line-clamp-1 group-hover:text-pale-nebula transition-colors">
                  {item.title}
                </h3>
                <p className="text-2xs text-muted-foreground line-clamp-2 mb-3">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <span className="text-2xs font-mono text-muted-foreground">
                    {item.id.slice(0, 10)}
                  </span>
                  <span className="text-2xs bg-secondary/80 px-2 py-0.5 rounded text-foreground">
                    {item.date_created}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View More */}
      {!loading && !error && items.length > 8 && (
        <div className="mt-4 text-center">
          <span className="text-2xs text-muted-foreground">
            Showing 8 of {items.length} results
          </span>
        </div>
      )}
    </section>
  );
}
