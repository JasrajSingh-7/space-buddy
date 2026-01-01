import {
  Globe2,
  Star,
  Sparkles,
  Telescope,
  CircleDot,
  Orbit,
  Circle,
  Moon,
  LucideIcon,
} from "lucide-react";

// Map category slugs/icon_names to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  planets: Globe2,
  "globe-2": Globe2,
  stars: Star,
  star: Star,
  galaxies: Sparkles,
  sparkles: Sparkles,
  nebulas: Telescope,
  telescope: Telescope,
  asteroids: CircleDot,
  "circle-dot": CircleDot,
  comets: Orbit,
  comet: Orbit,
  orbit: Orbit,
  "black-holes": Circle,
  circle: Circle,
  moons: Moon,
  moon: Moon,
};

export function getCategoryIcon(iconNameOrSlug: string | null | undefined): LucideIcon {
  if (!iconNameOrSlug) return Sparkles;
  
  const key = iconNameOrSlug.toLowerCase();
  return iconMap[key] || Sparkles;
}
