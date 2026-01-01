import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { CategoryCard } from "@/components/CategoryCard";
import { useCategories } from "@/hooks/useCategories";
import { getCategoryIcon } from "@/lib/icons";
import { Skeleton } from "@/components/ui/skeleton";

const Categories = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Star field background */}
      <div className="fixed inset-0 star-field opacity-30 pointer-events-none" />

      {/* Header */}
      <AppHeader />

      {/* Main content */}
      <main className="relative z-10 px-4 py-6">
        <h1 className="font-heading text-2xl font-semibold mb-2">Categories</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Explore the cosmos by category
        </p>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="glass-card p-4">
                <Skeleton className="w-10 h-10 rounded-lg mb-3" />
                <Skeleton className="h-5 w-20 mb-1" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {categories?.map((category, index) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                objectCount={category.object_count}
                description={category.description}
                icon={getCategoryIcon(category.icon_name || category.slug)}
                animationDelay={index * 50}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Categories;
