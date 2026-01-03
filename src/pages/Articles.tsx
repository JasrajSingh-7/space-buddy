import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, ArrowRight, ExternalLink } from "lucide-react";

interface ArticleItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  slug: string;
  date: string;
}

const Articles = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We search for "Research" and "Science" to get article-like content
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "https://images-api.nasa.gov/search?q=research&media_type=image&year_start=2022"
        );
        const data = await response.json();
        
        // Transform NASA data into our Article format
        const items = data.collection.items.slice(0, 15).map((item: any) => ({
          id: item.data[0].nasa_id,
          title: item.data[0].title,
          // Create a snippet for the preview
          description: item.data[0].description, 
          image_url: item.links ? item.links[0].href : null,
          // Create a slug for the URL
          slug: item.data[0].title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          date: item.data[0].date_created.substring(0, 10),
        }));

        setArticles(items);
      } catch (error) {
        console.error("Failed to load articles", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Dynamic Background */}
      <div className="fixed inset-0 star-field opacity-30 pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pale-nebula/20 rounded-lg">
            <Newspaper className="w-5 h-5 text-pale-nebula" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold">Space News</h1>
            <p className="text-xs text-muted-foreground">Latest from NASA Research</p>
          </div>
        </div>
      </header>

      {/* Article Feed */}
      <main className="px-4 py-6 space-y-6 relative z-10">
        {loading ? (
          // Loading Skeletons
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="w-full h-48 rounded-xl bg-secondary/20" />
              <Skeleton className="w-2/3 h-6 bg-secondary/20" />
              <Skeleton className="w-full h-20 bg-secondary/20" />
            </div>
          ))
        ) : (
          articles.map((article) => (
            <Link 
              key={article.id} 
              to={`/object/${article.slug}`} // Reuses our existing Detail Page!
              className="group block glass-card rounded-xl overflow-hidden border border-white/10 hover:border-pale-nebula/50 transition-colors"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12">
                   <span className="text-xs font-mono text-pale-nebula bg-pale-nebula/10 px-2 py-1 rounded border border-pale-nebula/20">
                      {article.date}
                   </span>
                </div>
              </div>

              {/* Text Section */}
              <div className="p-5">
                <h2 className="font-heading text-lg font-bold mb-2 leading-tight group-hover:text-pale-nebula transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                  {article.description}
                </p>
                
                <div className="flex items-center text-xs font-medium text-white/70 group-hover:text-white">
                  Read Full Article <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </Link>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Articles;
