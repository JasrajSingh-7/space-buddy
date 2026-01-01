import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Star field background */}
      <div className="fixed inset-0 star-field opacity-30 pointer-events-none" />

      {/* Header */}
      <AppHeader />

      {/* Main content */}
      <main className="relative z-10 px-4 py-6">
        {/* Search Input */}
        <div className="glass-card p-2 mb-6">
          <div className="flex items-center gap-3 px-3 py-2">
            <SearchIcon className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search galaxies, stars, planets..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* Placeholder content */}
        <div className="text-center py-12">
          <SearchIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-heading text-lg font-semibold mb-2">Search the Cosmos</h2>
          <p className="text-muted-foreground text-sm">
            Enter a query to discover celestial objects
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Search;
