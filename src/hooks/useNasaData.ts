import { useState, useEffect } from 'react';

export type NasaCategory = 'Planet' | 'Star' | 'Nebula' | 'Galaxy' | 'Exotic';

export interface NasaItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date_created: string;
}

export function useNasaData(category: NasaCategory) {
  const [items, setItems] = useState<NasaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNasaData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Map our categories to search terms that work well in NASA's database
        let query: string = category;
        if (category === 'Exotic') query = 'quasar neutron star black hole';
        if (category === 'Star') query = 'star cluster'; // 'star' alone is too generic

        // Connect to NASA Image and Video Library (No API Key Required)
        const response = await fetch(
          `https://images-api.nasa.gov/search?q=${query}&media_type=image&page_size=24`
        );
        const data = await response.json();

        // Transform the messy API data into a clean format for our app
        const cleanData = data.collection.items
          .filter((item: any) => item.links && item.links[0] && item.data && item.data[0])
          .map((item: any) => ({
            id: item.data[0].nasa_id,
            title: item.data[0].title,
            description: item.data[0].description || "No description provided by NASA.",
            imageUrl: item.links[0].href,
            date_created: new Date(item.data[0].date_created).getFullYear().toString()
          }));

        setItems(cleanData);
      } catch (err) {
        console.error("Failed to connect to NASA database:", err);
        setError("Failed to fetch data from NASA");
      } finally {
        setLoading(false);
      }
    };

    fetchNasaData();
  }, [category]);

  return { items, loading, error };
}
