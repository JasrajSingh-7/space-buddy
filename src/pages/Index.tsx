import React, { useState, useEffect } from 'react';
import { Star, Globe, Disc, Activity, Rocket, Info, X, Loader2 } from 'lucide-react';

// --- CONFIGURATION ---
const APP_NAME = "Brahmand";
// I put a reliable link here that will work instantly!
const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/3212/3212567.png";

// --- COMPONENT: SMART NASA IMAGE ---
const NasaSmartImage = ({ query, fallbackUrl, alt }: { query: string, fallbackUrl: string, alt: string }) => {
  const [imgSrc, setImgSrc] = useState<string>(fallbackUrl);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://images-api.nasa.gov/search?q=${query}%20space&media_type=image`);
        const data = await response.json();
        
        if (isMounted && data.collection?.items?.[0]?.links?.[0]?.href) {
          setImgSrc(data.collection.items[0].links[0].href);
        }
      } catch (err) {
        console.log(`Using fallback for ${query}`);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchImage();
    return () => { isMounted = false; };
  }, [query]);

  return (
    <div className="w-full h-full relative bg-slate-950">
      <img 
        src={hasError ? fallbackUrl : imgSrc} 
        alt={alt}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover transition-opacity duration-700 ${loading ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`}
        loading="lazy"
        onError={(e) => {
          if (!hasError) {
             setHasError(true);
             e.currentTarget.src = fallbackUrl;
          }
        }}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
          <Loader2 className="animate-spin text-indigo-500" size={24} />
        </div>
      )}
    </div>
  );
};

// --- DATA: 55+ Astronomical Objects ---
type AstroCategory = 'Planet' | 'Star' | 'Nebula' | 'Galaxy' | 'Exotic';

interface AstroObject {
  id: string;
  name: string;
  category: AstroCategory;
  distance: string;
  description: string;
  imageUrl: string; 
  specialTrait?: string;
}

const COSMOS_DATA: AstroObject[] = [
  // --- COSMIC EXTREMES ---
  { id: 'ex1', name: 'TON 618', category: 'Exotic', distance: '10.4 billion ly', description: 'The largest known black hole in the universe.', specialTrait: 'Hyper-Luminous Quasar', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artist%E2%80%99s_impression_of_the_quasar_3C_279.jpg/800px-Artist%E2%80%99s_impression_of_the_quasar_3C_279.jpg' },
  { id: 'ex2', name: 'The Crab Pulsar', category: 'Exotic', distance: '6,500 ly', description: 'A neutron star spinning 30 times per second.', specialTrait: 'Spinning Neutron Star', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Crab_Nebula_-_Hubble_Space_Telescope.jpg/800px-Crab_Nebula_-_Hubble_Space_Telescope.jpg' },
  { id: 'ex3', name: 'Magnetar SGR 1806-20', category: 'Exotic', distance: '50,000 ly', description: 'A neutron star with a magnetic field quadrillions of times stronger than Earths.', specialTrait: 'Magnetar', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Magnetar_concept_art.jpg' },
  { id: 'ex4', name: '3C 273', category: 'Exotic', distance: '2.4 billion ly', description: 'The first quasar ever identified, optically the brightest in our sky.', specialTrait: 'First Quasar', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Best_image_of_bright_quasar_3C_273.jpg/800px-Best_image_of_bright_quasar_3C_273.jpg' },
  { id: 'ex5', name: 'Geminga', category: 'Exotic', distance: '815 ly', description: 'A mysterious neutron star bright in gamma rays but faint in visible light.', specialTrait: 'Gamma-Ray Pulsar', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Geminga.jpg' },
  
  // --- PLANETS ---
  { id: 'p1', name: 'Mercury', category: 'Planet', distance: '0.39 AU', description: 'The smallest planet in the Solar System.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/600px-Mercury_in_true_color.jpg' },
  { id: 'p2', name: 'Venus', category: 'Planet', distance: '0.72 AU', description: 'The hottest planet, shrouded in thick clouds.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/600px-Venus-real_color.jpg' },
  { id: 'p3', name: 'Earth', category: 'Planet', distance: '1 AU', description: 'Our home, the Blue Marble.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/600px-The_Earth_seen_from_Apollo_17.jpg' },
  { id: 'p4', name: 'Mars', category: 'Planet', distance: '1.52 AU', description: 'The Red Planet, home to Olympus Mons.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/600px-OSIRIS_Mars_true_color.jpg' },
  { id: 'p5', name: 'Jupiter', category: 'Planet', distance: '5.20 AU', description: 'The King of Planets with the Great Red Spot.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/600px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg' },
  { id: 'p6', name: 'Saturn', category: 'Planet', distance: '9.58 AU', description: 'The Jewel of the Solar System with its ring system.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/600px-Saturn_during_Equinox.jpg' },
  { id: 'p7', name: 'Uranus', category: 'Planet', distance: '19.2 AU', description: 'The tilted Ice Giant.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/600px-Uranus2.jpg' },
  { id: 'p8', name: 'Neptune', category: 'Planet', distance: '30.1 AU', description: 'The windy, dark blue Ice Giant.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/600px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg' },
  { id: 'p9', name: 'Pluto', category: 'Planet', distance: '39.5 AU', description: 'The beloved dwarf planet with a heart of nitrogen ice.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pluto_in_True_Color_-_High_Res.jpg/600px-Pluto_in_True_Color_-_High_Res.jpg' },
  { id: 'p10', name: 'Ceres', category: 'Planet', distance: '2.77 AU', description: 'The largest object in the asteroid belt.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29_%28cropped%29.jpg/600px-Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29_%28cropped%29.jpg' },
  { id: 'p11', name: 'Eris', category: 'Planet', distance: '68 AU', description: 'A massive dwarf planet in the scattered disc.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Eris_and_Dysnomia2.jpg/600px-Eris_and_Dysnomia2.jpg' },
  { id: 'p12', name: 'Makemake', category: 'Planet', distance: '45.8 AU', description: 'A dwarf planet in the Kuiper belt.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Makemake_moon_number_2.jpg' },
  { id: 'p13', name: 'Haumea', category: 'Planet', distance: '43.3 AU', description: 'A dwarf planet shaped like an egg due to fast rotation.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Haumea_Rotation.gif/220px-Haumea_Rotation.gif' },

  // --- STARS ---
  { id: 's1', name: 'Sirius', category: 'Star', distance: '8.6 ly', description: 'The brightest star in the night sky.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sirius_A_and_B_Hubble_photo.jpg/600px-Sirius_A_and_B_Hubble_photo.jpg' },
  { id: 's2', name: 'Betelgeuse', category: 'Star', distance: '642 ly', description: 'A red supergiant expected to go supernova.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Betelgeuse_pulsing_UV.jpg/600px-Betelgeuse_pulsing_UV.jpg' },
  { id: 's3', name: 'UY Scuti', category: 'Star', distance: '9,500 ly', description: 'One of the largest known stars by radius.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/UY_Scuti_size_comparison_to_the_sun.png' },
  { id: 's4', name: 'Rigel', category: 'Star', distance: '860 ly', description: 'A powerful blue supergiant in Orion.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Rigel_blue_supergiant.jpg' },
  { id: 's5', name: 'Proxima Centauri', category: 'Star', distance: '4.24 ly', description: 'The closest star to the Sun.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/New_Shot_of_Proxima_Centauri.jpg/600px-New_Shot_of_Proxima_Centauri.jpg' },
  { id: 's6', name: 'Vega', category: 'Star', distance: '25 ly', description: 'A bright blue star, once the North Star.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vega_Spitzer.jpg/600px-Vega_Spitzer.jpg' },
  { id: 's7', name: 'Antares', category: 'Star', distance: '550 ly', description: 'The red heart of Scorpius.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Antares_in_Scorpius.jpg/600px-Antares_in_Scorpius.jpg' },
  { id: 's8', name: 'Aldebaran', category: 'Star', distance: '65 ly', description: 'The fiery eye of Taurus.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Aldebaran_2.jpg' },
  { id: 's9', name: 'Polaris', category: 'Star', distance: '323 ly', description: 'The North Star.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Polaris_B.jpg' },
  { id: 's10', name: 'Deneb', category: 'Star', distance: '2,600 ly', description: 'A supergiant forming the Summer Triangle.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Deneb.jpg' },
  { id: 's11', name: 'Arcturus', category: 'Star', distance: '37 ly', description: 'A red giant, the brightest in the northern hemisphere.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Arcturus.jpg' },
  { id: 's12', name: 'Stephenson 2-18', category: 'Star', distance: '19,000 ly', description: 'Record holder for largest known star radius.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Stephenson_2-18_Compare_Sun.jpg' },
  { id: 's13', name: 'Sun', category: 'Star', distance: '0 AU', description: 'Our life-giving star.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/600px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg' },

  // --- NEBULAS ---
  { id: 'n1', name: 'Orion Nebula', category: 'Nebula', distance: '1,344 ly', description: 'A stellar nursery visible to the naked eye.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/600px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg' },
  { id: 'n2', name: 'Crab Nebula', category: 'Nebula', distance: '6,500 ly', description: 'Remnant of a supernova observed in 1054 AD.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Hubble_Files_High-Resolution_Image_of_the_Crab_Nebula.jpg/600px-Hubble_Files_High-Resolution_Image_of_the_Crab_Nebula.jpg' },
  { id: 'n3', name: 'Horsehead Nebula', category: 'Nebula', distance: '1,375 ly', description: 'Iconic dark nebula in Orion.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Barnard_33.jpg/600px-Barnard_33.jpg' },
  { id: 'n4', name: 'Eagle Nebula', category: 'Nebula', distance: '7,000 ly', description: 'Home to the Pillars of Creation.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Eagle_nebula_pillars.jpg/600px-Eagle_nebula_pillars.jpg' },
  { id: 'n5', name: 'Ring Nebula', category: 'Nebula', distance: '2,570 ly', description: 'A classic planetary nebula.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/M57_The_Ring_Nebula.jpg/600px-M57_The_Ring_Nebula.jpg' },
  { id: 'n6', name: 'Helix Nebula', category: 'Nebula', distance: '650 ly', description: 'Often called the Eye of God.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Helix_Nebula_merged.jpg/600px-Helix_Nebula_merged.jpg' },
  { id: 'n7', name: 'Carina Nebula', category: 'Nebula', distance: '8,500 ly', description: 'A massive nebula containing Eta Carinae.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Carina_Nebula_by_Harel_Boren_%28153045992%29.jpeg/600px-Carina_Nebula_by_Harel_Boren_%28153045992%29.jpeg' },
  { id: 'n8', name: 'Veil Nebula', category: 'Nebula', distance: '2,100 ly', description: 'A delicate supernova remnant.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Veil_Nebula_-_NGC6960.jpg/600px-Veil_Nebula_-_NGC6960.jpg' },
  { id: 'n9', name: 'Lagoon Nebula', category: 'Nebula', distance: '4,100 ly', description: 'A giant interstellar cloud in Sagittarius.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/M8_Lagoon_Nebula_Jap.jpg/600px-M8_Lagoon_Nebula_Jap.jpg' },
  { id: 'n10', name: 'Trifid Nebula', category: 'Nebula', distance: '5,200 ly', description: 'A rare combination of emission, reflection, and dark nebula.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Trifid_Nebula_by_Harel_Boren.jpg/600px-Trifid_Nebula_by_Harel_Boren.jpg' },

  // --- GALAXIES ---
  { id: 'g1', name: 'Andromeda Galaxy', category: 'Galaxy', distance: '2.5 million ly', description: 'Our massive neighbor, on a collision course with us.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/M31_Andromeda_Galaxy_%28cropped%29.jpg/600px-M31_Andromeda_Galaxy_%28cropped%29.jpg' },
  { id: 'g2', name: 'Milky Way', category: 'Galaxy', distance: 'Home', description: 'Our galaxy, a barred spiral containing 100-400 billion stars.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Milky_Way_2005.jpg/600px-Milky_Way_2005.jpg' },
  { id: 'g3', name: 'Whirlpool Galaxy', category: 'Galaxy', distance: '23 million ly', description: 'A classic spiral interacting with a neighbor.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Messier51_sRGB.jpg/600px-Messier51_sRGB.jpg' },
  { id: 'g4', name: 'Sombrero Galaxy', category: 'Galaxy', distance: '29 million ly', description: 'Features a brilliant white core and thick dust lanes.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/M104_ngc4594_sombrero_galaxy_hi-res.jpg/600px-M104_ngc4594_sombrero_galaxy_hi-res.jpg' },
  { id: 'g5', name: 'Triangulum Galaxy', category: 'Galaxy', distance: '3 million ly', description: 'The third largest in our Local Group.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/M33_-_Triangulum_Galaxy.jpg/600px-M33_-_Triangulum_Galaxy.jpg' },
  { id: 'g6', name: 'Pinwheel Galaxy', category: 'Galaxy', distance: '21 million ly', description: 'A grand design spiral galaxy.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/M101_hires_STScI-PRC2006-10a.jpg/600px-M101_hires_STScI-PRC2006-10a.jpg' },
  { id: 'g7', name: 'Cigar Galaxy', category: 'Galaxy', distance: '12 million ly', description: 'A starburst galaxy with a superwind.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/M82_HST_ACS_2006-14-a-large_web.jpg/600px-M82_HST_ACS_2006-14-a-large_web.jpg' },
  { id: 'g8', name: 'Black Eye Galaxy', category: 'Galaxy', distance: '17 million ly', description: 'Famous for its dark absorbing dust band.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Black_Eye_Galaxy.jpg/600px-Black_Eye_Galaxy.jpg' },
  { id: 'g9', name: 'Centaurus A', category: 'Galaxy', distance: '12 million ly', description: 'A peculiar galaxy with a massive radio source.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/ESO_Centaurus_A_LABOCA.jpg/600px-ESO_Centaurus_A_LABOCA.jpg' },
  { id: 'g10', name: 'Cartwheel Galaxy', category: 'Galaxy', distance: '500 million ly', description: 'A ring galaxy formed by a collision.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Cartwheel_Galaxy.jpg/600px-Cartwheel_Galaxy.jpg' },
  { id: 'g11', name: 'Hoags Object', category: 'Galaxy', distance: '600 million ly', description: 'A perfect ring of young blue stars.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Hoag%27s_object.jpg' },
  { id: 'g12', name: 'Large Magellanic Cloud', category: 'Galaxy', distance: '163,000 ly', description: 'A satellite galaxy of the Milky Way.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Large_Magellanic_Cloud_mosaic.jpg/600px-Large_Magellanic_Cloud_mosaic.jpg' },
];

export default function BrahmandApp() {
  const [filter, setFilter] = useState<AstroCategory | 'All'>('All');
  const [selectedItem, setSelectedItem] = useState<AstroObject | null>(null);

  const filteredData = filter === 'All' 
    ? COSMOS_DATA 
    : COSMOS_DATA.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Section */}
            <div className="h-10 w-10 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/50 overflow-hidden">
               <img src={LOGO_URL} alt="Brahmand" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
              {APP_NAME}
            </h1>
          </div>
          {/* Object Count */}
          <div className="text-xs font-mono text-slate-500 hidden sm:block">
            {COSMOS_DATA.length} Cosmic Objects
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 flex-grow">
        {/* Nav */}
        <nav className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { id: 'All', icon: Globe, label: 'All' },
            { id: 'Planet', icon: Globe, label: 'Planets' },
            { id: 'Star', icon: Star, label: 'Stars' },
            { id: 'Nebula', icon: Activity, label: 'Nebulas' },
            { id: 'Galaxy', icon: Disc, label: 'Galaxies' },
            { id: 'Exotic', icon: Rocket, label: 'Extremes' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${
                filter === btn.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105' 
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <btn.icon size={16} />
              {btn.label}
            </button>
          ))}
        </nav>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden relative">
                <NasaSmartImage 
                  query={item.name} 
                  fallbackUrl={item.imageUrl} 
                  alt={item.name} 
                />
   