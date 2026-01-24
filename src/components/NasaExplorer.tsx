import { useState } from 'react';
import { Star, Globe, Disc, Activity, Rocket, Loader2, Calendar, Hash, ExternalLink } from 'lucide-react';
import { useNasaData, NasaCategory, NasaItem } from '@/hooks/useNasaData';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const CATEGORY_TABS = [
  { id: 'Planet' as NasaCategory, icon: Globe, label: 'Planets' },
  { id: 'Galaxy' as NasaCategory, icon: Disc, label: 'Galaxies' },
  { id: 'Nebula' as NasaCategory, icon: Activity, label: 'Nebulas' },
  { id: 'Star' as NasaCategory, icon: Star, label: 'Stars' },
  { id: 'Exotic' as NasaCategory, icon: Rocket, label: 'Cosmic Extremes' },
];

export function NasaExplorer() {
  const [category, setCategory] = useState<NasaCategory>('Planet');
  const [selectedItem, setSelectedItem] = useState<NasaItem | null>(null);
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
              onClick={() => setSelectedItem(item)}
              className="glass-card overflow-hidden group hover:border-pale-nebula/30 transition-all duration-300 cursor-pointer"
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

      {/* Object Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background border-border">
          {selectedItem && (
            <>
              {/* Hero Image */}
              <div className="h-64 sm:h-80 relative overflow-hidden bg-secondary">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 -mt-16 relative">
                <DialogHeader className="mb-4">
                  <DialogTitle className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    {selectedItem.title}
                  </DialogTitle>
                </DialogHeader>

                {/* Metadata */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1.5 text-pale-nebula text-sm">
                    <Calendar size={14} />
                    <span>{selectedItem.date_created}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-mono">
                    <Hash size={14} />
                    <span>{selectedItem.id}</span>
                  </div>
                </div>

                {/* Description */}
                <DialogDescription asChild>
                  <div className="text-sm text-muted-foreground leading-relaxed max-h-48 overflow-y-auto pr-2">
                    {selectedItem.description}
                  </div>
                </DialogDescription>

                {/* Category Badge */}
                <div className="mt-6 pt-4 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pale-nebula/10 text-pale-nebula text-sm font-medium">
                    {CATEGORY_TABS.find(t => t.id === category)?.icon && (
                      <span>
                        {(() => {
                          const Icon = CATEGORY_TABS.find(t => t.id === category)?.icon;
                          return Icon ? <Icon size={14} /> : null;
                        })()}
                      </span>
                    )}
                    {category}
                  </span>
                  
                  {/* Learn More Button */}
                  <a
                    href={`https://images.nasa.gov/search?q=${encodeURIComponent(selectedItem.title)}&media=image`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pale-nebula text-background font-medium text-sm hover:bg-pale-nebula/90 transition-colors w-full sm:w-auto justify-center"
                  >
                    Explore More on NASA
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
