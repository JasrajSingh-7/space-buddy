import { Star, Telescope, Globe2, Sparkles, Clock } from "lucide-react";

const Index = () => {
  const categories = [
    { icon: Globe2, label: "Planets", count: 8 },
    { icon: Star, label: "Stars", count: "∞" },
    { icon: Sparkles, label: "Galaxies", count: "2T+" },
    { icon: Telescope, label: "Nebulas", count: "3K+" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Star field background */}
      <div className="fixed inset-0 star-field opacity-30 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pale-nebula via-cosmic-purple to-nebula-pink flex items-center justify-center">
            <Telescope className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-semibold text-xl">Shunya</span>
        </div>
        <button className="touch-target flex items-center justify-center rounded-full bg-secondary/60 backdrop-blur-sm">
          <Star className="w-5 h-5" />
        </button>
      </header>

      {/* Main content */}
      <main className="relative z-10 px-4 pb-24">
        {/* Hero Section - Daily Fact */}
        <section className="mb-8 animate-fade-in">
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pale-nebula/20 to-cosmic-purple/20 rounded-full blur-3xl" />
            <span className="text-2xs uppercase tracking-wider text-pale-nebula font-medium">Daily Discovery</span>
            <h1 className="font-heading text-2xl font-semibold mt-2 mb-3">
              The Andromeda Galaxy
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              At 2.537 million light-years away, Andromeda is the nearest major galaxy to our Milky Way and is on a collision course with us.
            </p>
            <div className="flex items-center gap-2 mt-4 text-2xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Discovered 964 AD by Abd al-Rahman al-Sufi</span>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <h2 className="font-heading text-lg font-semibold mb-4">Explore</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category, index) => (
              <button
                key={category.label}
                className="glass-card p-4 text-left transition-all hover:border-pale-nebula/40 hover:glow-accent group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <category.icon className="w-6 h-6 text-pale-nebula mb-3 group-hover:animate-pulse-glow" />
                <h3 className="font-heading font-medium">{category.label}</h3>
                <span className="text-2xs text-muted-foreground">{category.count} objects</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Discoveries */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold">Recent Discoveries</h2>
            <button className="text-2xs text-pale-nebula">View all</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {["TOI-700 d", "Betelgeuse Dimming", "James Webb First Light"].map((discovery, index) => (
              <div
                key={discovery}
                className="glass-card min-w-[200px] p-4 flex-shrink-0"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="w-full h-24 rounded-lg bg-gradient-to-br from-secondary to-muted mb-3 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-heading font-medium text-sm">{discovery}</h3>
                <span className="text-2xs text-muted-foreground">2024</span>
              </div>
            ))}
          </div>
        </section>

        {/* Design System Preview */}
        <section className="mt-12 glass-card p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Design System</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-pale-nebula text-primary-foreground text-sm">Pale Nebula</span>
              <span className="px-3 py-1 rounded-full bg-cosmic-purple text-white text-sm">Cosmic Purple</span>
              <span className="px-3 py-1 rounded-full bg-stellar-gold text-primary-foreground text-sm">Stellar Gold</span>
              <span className="px-3 py-1 rounded-full bg-nebula-pink text-white text-sm">Nebula Pink</span>
              <span className="px-3 py-1 rounded-full bg-galaxy-green text-white text-sm">Galaxy Green</span>
            </div>
            <p className="text-sm text-muted-foreground font-body">
              Typography: <span className="font-heading font-semibold">Inter for headings</span>, 
              <span className="font-body"> Source Sans Pro for body</span>, 
              <code className="font-mono text-pale-nebula"> JetBrains Mono for code</code>
            </p>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border safe-bottom">
        <div className="flex items-center justify-around py-3">
          {[
            { icon: Globe2, label: "Home", active: true },
            { icon: Telescope, label: "Search", active: false },
            { icon: Star, label: "Favorites", active: false },
            { icon: Clock, label: "Timeline", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 touch-target ${
                item.active ? "text-pale-nebula" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-2xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Index;
