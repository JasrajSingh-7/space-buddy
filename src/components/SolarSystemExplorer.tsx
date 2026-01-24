import { useState, Suspense } from 'react';
import { Orbit, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Planet3D } from './Planet3D';
import { cn } from '@/lib/utils';

interface Planet {
  id: string;
  name: string;
  color: string;
  emissive?: string;
  hasRings?: boolean;
  ringColor?: string;
  distance: string;
  diameter: string;
  moons: number;
  description: string;
  funFact: string;
}

const PLANETS: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    color: '#8c7853',
    emissive: '#5c5040',
    distance: '57.9 million km',
    diameter: '4,879 km',
    moons: 0,
    description: 'The smallest planet and closest to the Sun. Despite being nearest to our star, it\'s not the hottest planet.',
    funFact: 'A day on Mercury lasts 59 Earth days!'
  },
  {
    id: 'venus',
    name: 'Venus',
    color: '#e6c87a',
    emissive: '#c4a55a',
    distance: '108.2 million km',
    diameter: '12,104 km',
    moons: 0,
    description: 'Often called Earth\'s twin due to similar size. It has a thick, toxic atmosphere that traps heat.',
    funFact: 'Venus rotates backwards compared to most planets!'
  },
  {
    id: 'earth',
    name: 'Earth',
    color: '#4a90d9',
    emissive: '#2d5a87',
    distance: '149.6 million km',
    diameter: '12,742 km',
    moons: 1,
    description: 'Our home planet and the only known world with liquid water on its surface and life as we know it.',
    funFact: 'Earth is the only planet not named after a god!'
  },
  {
    id: 'mars',
    name: 'Mars',
    color: '#c1440e',
    emissive: '#8a2f08',
    distance: '227.9 million km',
    diameter: '6,779 km',
    moons: 2,
    description: 'The Red Planet, named after the Roman god of war. It hosts the largest volcano in our solar system.',
    funFact: 'Mars has seasons like Earth, but they last twice as long!'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    color: '#d4a574',
    emissive: '#a67c52',
    distance: '778.5 million km',
    diameter: '139,820 km',
    moons: 95,
    description: 'The largest planet in our solar system. Its Great Red Spot is a storm larger than Earth.',
    funFact: 'Jupiter has the shortest day of all planets—just 10 hours!'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    color: '#f4d59e',
    emissive: '#c4a574',
    hasRings: true,
    ringColor: '#c4a574',
    distance: '1.4 billion km',
    diameter: '116,460 km',
    moons: 146,
    description: 'Famous for its stunning ring system made of ice and rock. It\'s the least dense planet.',
    funFact: 'Saturn would float if placed in water!'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    color: '#72b5c7',
    emissive: '#4a8a9a',
    hasRings: true,
    ringColor: '#5a9aaa',
    distance: '2.9 billion km',
    diameter: '50,724 km',
    moons: 28,
    description: 'An ice giant that rotates on its side. It has a blue-green color from methane in its atmosphere.',
    funFact: 'Uranus was the first planet discovered with a telescope!'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    color: '#4b70dd',
    emissive: '#2d4a9a',
    distance: '4.5 billion km',
    diameter: '49,244 km',
    moons: 16,
    description: 'The windiest planet with storms reaching 2,100 km/h. It\'s the most distant planet from the Sun.',
    funFact: 'Neptune was discovered through mathematical predictions!'
  }
];

export function SolarSystemExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
          <Orbit size={20} className="text-pale-nebula" />
          Solar System
        </h2>
        <span className="text-2xs text-muted-foreground font-mono">
          3D Interactive
        </span>
      </div>

      {/* Planet Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {PLANETS.map((planet) => (
          <button
            key={planet.id}
            onClick={() => setSelectedPlanet(planet)}
            className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/80 border border-border/30 hover:border-pale-nebula/30 transition-all duration-300"
          >
            {/* Planet Preview Circle */}
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.emissive || planet.color})`,
                boxShadow: `0 0 20px ${planet.color}40`
              }}
            />
            <span className="text-2xs sm:text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">
              {planet.name}
            </span>
          </button>
        ))}
      </div>

      {/* Planet Detail Modal */}
      <Dialog open={!!selectedPlanet} onOpenChange={(open) => !open && setSelectedPlanet(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background border-border">
          {selectedPlanet && (
            <>
              {/* 3D Planet Viewer */}
              <Suspense fallback={
                <div className="w-full h-[300px] sm:h-[400px] flex items-center justify-center bg-background">
                  <Loader2 className="animate-spin text-pale-nebula" size={32} />
                </div>
              }>
                <Planet3D planetData={selectedPlanet} />
              </Suspense>

              {/* Content */}
              <div className="p-6">
                <DialogHeader className="mb-4">
                  <DialogTitle className="font-heading text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.color}, ${selectedPlanet.emissive || selectedPlanet.color})`
                      }}
                    />
                    {selectedPlanet.name}
                  </DialogTitle>
                </DialogHeader>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-2xs text-muted-foreground uppercase tracking-wide">Distance</p>
                    <p className="text-sm font-semibold text-foreground">{selectedPlanet.distance}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-2xs text-muted-foreground uppercase tracking-wide">Diameter</p>
                    <p className="text-sm font-semibold text-foreground">{selectedPlanet.diameter}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-2xs text-muted-foreground uppercase tracking-wide">Moons</p>
                    <p className="text-sm font-semibold text-foreground">{selectedPlanet.moons}</p>
                  </div>
                </div>

                {/* Description */}
                <DialogDescription asChild>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedPlanet.description}
                    </p>
                    <div className="bg-pale-nebula/10 rounded-lg p-3 border border-pale-nebula/20">
                      <p className="text-sm text-pale-nebula">
                        <span className="font-semibold">Fun Fact:</span> {selectedPlanet.funFact}
                      </p>
                    </div>
                  </div>
                </DialogDescription>

                {/* Interaction Hint */}
                <p className="text-2xs text-muted-foreground text-center mt-4">
                  Drag to rotate • Scroll to zoom
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
