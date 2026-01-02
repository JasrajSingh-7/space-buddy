import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Calendar, Share2, Info, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// Define what a single NASA item looks like for our view
interface NasaDetail {
  title: string;
  description: string;
  imageUrl: string | null;
  date: string | null;
  keywords: string[];
  nasaId: string;
}

const ObjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<NasaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    // 1. Convert the URL slug back to a search term
    // e.g., "andromeda-galaxy" -> "andromeda galaxy"
    const searchTerm = slug.replace(/-/g, " ");

    const fetchDetails = async () => {
      setLoading(true);
      try {
        // 2. Fetch the specific item from NASA
        const response = await fetch(`https://images-api.nasa.gov/search?q=${searchTerm}`);
        const json = await response.json();
        
        // We take the first result as the best match
        const item = json.collection.items[0];

        if (item) {
          setData({
            title: item.data[0].title,
            description: item.data[0].description,
            imageUrl: item.links ? item.links[0].href : null,
            date: item.data[0].date_created ? item.data[0].date_created.substring(0, 10) : null,
            keywords: item.data[0].keywords || [],
            nasaId: item.data[0].nasa_id
          });
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
        <Skeleton className="w-full h-64 rounded-xl mb-6" />
        <Skeleton className="w-3/4 h-8 mb-4" />
        <Skeleton className="w-full h-32" />
        <BottomNav />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
        <h1 className="text-2xl font-bold mb-2">Object Not Found</h1>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Background Effect */}
      <div className="fixed inset-0 star-field opacity-30 pointer-events-none" />

      {/* Hero Image Section */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background z-10" />
        {data.imageUrl ? (
          <img 
            src={data.imageUrl} 
            alt={data.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
            <Info className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        
        {/* Navigation Header (Floating) */}
        <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="secondary" 
            size="icon"
            className="rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80"
            onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                // Optional: Add a toast notification here
            }}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-5 -mt-12 relative z-20">
        <div className="glass-card p-6 rounded-2xl animate-fade-in">
          
          {/* Title & Date */}
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-3 leading-tight">
            {data.title}
          </h1>
          
          {data.date && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
              <Calendar className="w-4 h-4" />
              <span>Captured on {data.date}</span>
            </div>
          )}

          {/* Keywords / Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {data.keywords.slice(0, 5).map((keyword) => (
              <span 
                key={keyword}
                className="px-2.5 py-1 rounded-full bg-secondary/60 text-pale-nebula text-xs font-medium border border-pale-nebula/10"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-pale-nebula" />
              About this Object
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-line">
              {data.description}
            </p>
          </div>

          {/* NASA Source Link */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-muted-foreground mb-3">
              Data provided by NASA Image and Video Library
            </p>
            <a 
              href={`https://images.nasa.gov/details/${data.nasaId}`} 
              target="_blank" 
              rel="noreferrer"
            >
              <Button variant="outline" className="w-full gap-2">
                View Original on NASA <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ObjectDetail;
