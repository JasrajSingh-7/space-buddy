import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { CategoryCard } from "@/components/CategoryCard";
import { DailyFactCard } from "@/components/DailyFactCard";
import GurudevChatbot from "@/components/GurudevChatbot";
import { NasaExplorer } from "@/components/NasaExplorer";
import { useCategories } from "@/hooks/useCategories";
import { useFeaturedObject } from "@/hooks/useCelestialObjects";
import { getCategoryIcon } from "@/lib/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const Index = () => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: featuredObject, isLoading: featuredLoading } = useFeaturedObject();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Star field background */}
      <div className="fixed inset-0 star-field opacity-30 pointer-events-none" />

      {/* Header */}
      <AppHeader />

      {/* Main content */}
      <main className="relative z-10 px-4 py-6">
        {/* Hero Section - Daily Fact */}
        <section className="mb-8">
          {featuredLoading ? (
            <div className="glass-card p-6">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-3/4 mb-3" />
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : featuredObject ? (
            <DailyFactCard object={featuredObject} />
          ) : (
            <div className="glass-card p-6 text-center">
              <p className="text-muted-foreground">No featured discovery today</p>
            </div>
          )}
        </section>

        {/* Categories */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold">Explore</h2>
            <Link to="/categories" className="text-2xs text-pale-nebula hover:underline">
              View all
            </Link>
          </div>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card p-4">
                  <Skeleton className="w-10 h-10 rounded-lg mb-3" />
                  <Skeleton className="h-5 w-20 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {categories?.slice(0, 4).map((category, index) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  slug={category.slug}
                  objectCount={category.object_count}
                  icon={getCategoryIcon(category.icon_name || category.slug)}
                  animationDelay={index * 100}
                />
              ))}
            </div>
          )}
        </section>

        {/* NASA Database Explorer */}
        <NasaExplorer />

        {/* Quick Stats */}
        <section className="mb-8">
          <div className="glass-card p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-heading text-2xl font-bold text-pale-nebula">
                  {categories?.reduce((sum, cat) => sum + (cat.object_count || 0), 0) || 0}
                </p>
                <p className="text-2xs text-muted-foreground">Objects</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-cosmic-purple">
                  {categories?.length || 0}
                </p>
                <p className="text-2xs text-muted-foreground">Categories</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-stellar-gold">∞</p>
                <p className="text-2xs text-muted-foreground">To Explore</p>
              </div>
            </div>
          </div>
        </section>
      </main>


      {/* Footer */}
      <footer className="w-full py-6 mt-8 border-t border-border/30 text-center mb-20">
        <p className="text-muted-foreground/60 text-[10px] uppercase tracking-[0.2em] hover:text-pale-nebula transition-colors cursor-default">
          Made by Jasraj Singh Tailor
        </p>
      </footer>

      {/* Gurudev AI Chatbot */}
      <GurudevChatbot />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
