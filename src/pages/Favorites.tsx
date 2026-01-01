import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Star } from "lucide-react";

const Favorites = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Star field background */}
      <div className="fixed inset-0 star-field opacity-30 pointer-events-none" />

      {/* Header */}
      <AppHeader />

      {/* Main content */}
      <main className="relative z-10 px-4 py-6">
        <h1 className="font-heading text-2xl font-semibold mb-2">Favorites</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Your personal collection of celestial wonders
        </p>

        {/* Empty state */}
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-secondary/60 flex items-center justify-center mx-auto mb-4">
            <Star className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h2 className="font-heading text-lg font-semibold mb-2">No Favorites Yet</h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Start exploring and save your favorite celestial objects to build your personal collection.
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Favorites;
