import { useParams, Link, useNavigate } from "react-router-dom";
import { useCelestialObject, useCelestialObjects } from "@/hooks/useCelestialObjects";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DiscoveryCard } from "@/components/DiscoveryCard";
import {
  ArrowLeft,
  Star,
  Share2,
  Calendar,
  MapPin,
  Ruler,
  Thermometer,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ObjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: object, isLoading, error } = useCelestialObject(slug || "");
  const { data: relatedObjects } = useCelestialObjects({
    objectType: object?.object_type,
    limit: 10,
  });

  const [showFullStory, setShowFullStory] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Filter out current object from related
  const filteredRelated = relatedObjects?.filter((o) => o.id !== object?.id) || [];

  const formatObjectType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: object?.name,
          text: object?.short_description || `Learn about ${object?.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement local storage persistence
  };

  if (isLoading) {
    return <ObjectDetailSkeleton />;
  }

  if (error || !object) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Sparkles className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="font-heading text-xl text-foreground mb-2">Object Not Found</h1>
        <p className="text-muted-foreground text-center mb-6">
          The celestial object you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Image */}
      <div className="relative h-72 sm:h-96 w-full">
        {object.primary_image_url ? (
          <img
            src={object.primary_image_url}
            alt={object.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary via-muted to-card flex items-center justify-center">
            <Sparkles className="w-24 h-24 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Top navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="bg-background/40 backdrop-blur-sm hover:bg-background/60"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className="bg-background/40 backdrop-blur-sm hover:bg-background/60"
            >
              <Star
                className={cn(
                  "w-5 h-5 transition-colors",
                  isFavorite && "fill-stellar-gold text-stellar-gold"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="bg-background/40 backdrop-blur-sm hover:bg-background/60"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Object name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-pale-nebula/20 text-pale-nebula mb-2">
            {formatObjectType(object.object_type)}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            {object.name}
          </h1>
          {object.constellation && (
            <p className="text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {object.constellation}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 space-y-6 -mt-2">
        {/* Quick Facts Card */}
        <GlassCard className="animate-slide-up">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
            Quick Facts
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {object.discovery_year && (
              <QuickFact
                icon={Calendar}
                label="Discovered"
                value={object.discovery_year.toString()}
              />
            )}
            {object.discoverer && (
              <QuickFact icon={User} label="Discoverer" value={object.discoverer} />
            )}
            {object.distance_light_years && (
              <QuickFact
                icon={Ruler}
                label="Distance"
                value={`${Number(object.distance_light_years).toLocaleString()} ly`}
              />
            )}
            {object.temperature && (
              <QuickFact icon={Thermometer} label="Temperature" value={object.temperature} />
            )}
            {object.mass && (
              <QuickFact icon={Sparkles} label="Mass" value={object.mass} />
            )}
            {object.radius && (
              <QuickFact icon={Ruler} label="Radius" value={object.radius} />
            )}
            {object.age && (
              <QuickFact icon={Clock} label="Age" value={object.age} />
            )}
            {object.scientific_classification && (
              <QuickFact
                icon={Sparkles}
                label="Classification"
                value={object.scientific_classification}
              />
            )}
          </div>
        </GlassCard>

        {/* Detailed Description */}
        {(object.short_description || object.detailed_description) && (
          <GlassCard className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              About {object.name}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {object.detailed_description || object.short_description}
            </p>
          </GlassCard>
        )}

        {/* Discovery Story */}
        {object.discovery_story && (
          <GlassCard className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <button
              onClick={() => setShowFullStory(!showFullStory)}
              className="w-full flex items-center justify-between"
            >
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Discovery Story
              </h2>
              {showFullStory ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                showFullStory ? "max-h-[1000px] mt-4" : "max-h-0"
              )}
            >
              <p className="text-muted-foreground leading-relaxed">
                {object.discovery_story}
              </p>
            </div>
          </GlassCard>
        )}

        {/* Coordinates */}
        {(object.right_ascension || object.declination) && (
          <GlassCard className="animate-slide-up" style={{ animationDelay: "300ms" }}>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              Celestial Coordinates
            </h2>
            <div className="flex gap-6 font-mono text-sm">
              {object.right_ascension && (
                <div>
                  <span className="text-muted-foreground">RA: </span>
                  <span className="text-foreground">{object.right_ascension}</span>
                </div>
              )}
              {object.declination && (
                <div>
                  <span className="text-muted-foreground">Dec: </span>
                  <span className="text-foreground">{object.declination}</span>
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* Related Objects */}
        {filteredRelated.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
              Related Objects
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {filteredRelated.slice(0, 6).map((relatedObj, index) => (
                <DiscoveryCard
                  key={relatedObj.id}
                  object={relatedObj}
                  animationDelay={index * 50}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface QuickFactProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function QuickFact({ icon: Icon, label, value }: QuickFactProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-secondary/50">
        <Icon className="w-4 h-4 text-pale-nebula" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function ObjectDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Skeleton className="h-72 sm:h-96 w-full" />
      <div className="px-4 sm:px-6 space-y-6 -mt-2">
        <div className="glass-card p-4">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-4">
          <Skeleton className="h-6 w-40 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export default ObjectDetail;
