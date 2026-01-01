import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, Database } from "@/integrations/supabase/types";

type CelestialObject = Tables<"celestial_objects">;
type CelestialObjectType = Database["public"]["Enums"]["celestial_object_type"];

interface UseCelestialObjectsOptions {
  categoryId?: string;
  objectType?: CelestialObjectType;
  featured?: boolean;
  limit?: number;
}

export function useCelestialObjects(options: UseCelestialObjectsOptions = {}) {
  const { categoryId, objectType, featured, limit = 20 } = options;

  return useQuery({
    queryKey: ["celestial-objects", { categoryId, objectType, featured, limit }],
    queryFn: async (): Promise<CelestialObject[]> => {
      let query = supabase.from("celestial_objects").select("*");

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (objectType) {
        query = query.eq("object_type", objectType);
      }

      if (featured !== undefined) {
        query = query.eq("is_featured", featured);
      }

      query = query.order("created_at", { ascending: false }).limit(limit);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching celestial objects:", error);
        throw error;
      }

      return data || [];
    },
  });
}

export function useCelestialObject(slug: string) {
  return useQuery({
    queryKey: ["celestial-object", slug],
    queryFn: async (): Promise<CelestialObject | null> => {
      const { data, error } = await supabase
        .from("celestial_objects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        console.error("Error fetching celestial object:", error);
        throw error;
      }

      return data;
    },
    enabled: !!slug,
  });
}

export function useFeaturedObject() {
  return useQuery({
    queryKey: ["featured-object"],
    queryFn: async (): Promise<CelestialObject | null> => {
      // First try to get today's featured object
      const today = new Date().toISOString().split("T")[0];
      
      let { data, error } = await supabase
        .from("celestial_objects")
        .select("*")
        .eq("is_featured", true)
        .eq("featured_date", today)
        .maybeSingle();

      // If no object for today, get any featured object
      if (!data) {
        const result = await supabase
          .from("celestial_objects")
          .select("*")
          .eq("is_featured", true)
          .order("featured_date", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        data = result.data;
        error = result.error;
      }

      // If still no featured object, get any object
      if (!data) {
        const result = await supabase
          .from("celestial_objects")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error("Error fetching featured object:", error);
        throw error;
      }

      return data;
    },
  });
}

export function useRecentObjects(limit: number = 10) {
  return useQuery({
    queryKey: ["recent-objects", limit],
    queryFn: async (): Promise<CelestialObject[]> => {
      const { data, error } = await supabase
        .from("celestial_objects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching recent objects:", error);
        throw error;
      }

      return data || [];
    },
  });
}
