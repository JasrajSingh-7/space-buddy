import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Compass, X, Maximize2, Info, Star, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Constellation data with star positions (simplified for demo)
const CONSTELLATIONS = [
  {
    name: 'Orion',
    stars: [
      { name: 'Betelgeuse', ra: 88.79, dec: 7.41, magnitude: 0.42 },
      { name: 'Rigel', ra: 78.63, dec: -8.20, magnitude: 0.13 },
      { name: 'Bellatrix', ra: 81.28, dec: 6.35, magnitude: 1.64 },
      { name: 'Mintaka', ra: 83.00, dec: -0.30, magnitude: 2.23 },
      { name: 'Alnilam', ra: 84.05, dec: -1.20, magnitude: 1.69 },
      { name: 'Alnitak', ra: 85.19, dec: -1.94, magnitude: 1.77 },
      { name: 'Saiph', ra: 86.94, dec: -9.67, magnitude: 2.09 },
    ],
    lines: [[0, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1], [1, 5], [0, 4]],
    description: 'The Hunter - One of the most recognizable constellations',
  },
  {
    name: 'Ursa Major',
    stars: [
      { name: 'Dubhe', ra: 165.93, dec: 61.75, magnitude: 1.79 },
      { name: 'Merak', ra: 165.46, dec: 56.38, magnitude: 2.37 },
      { name: 'Phecda', ra: 178.46, dec: 53.69, magnitude: 2.44 },
      { name: 'Megrez', ra: 183.86, dec: 57.03, magnitude: 3.31 },
      { name: 'Alioth', ra: 193.51, dec: 55.96, magnitude: 1.77 },
      { name: 'Mizar', ra: 200.98, dec: 54.93, magnitude: 2.27 },
      { name: 'Alkaid', ra: 206.89, dec: 49.31, magnitude: 1.86 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
    description: 'The Great Bear - Contains the Big Dipper asterism',
  },
  {
    name: 'Cassiopeia',
    stars: [
      { name: 'Schedar', ra: 10.13, dec: 56.54, magnitude: 2.24 },
      { name: 'Caph', ra: 2.29, dec: 59.15, magnitude: 2.28 },
      { name: 'Gamma Cas', ra: 14.18, dec: 60.72, magnitude: 2.47 },
      { name: 'Ruchbah', ra: 21.45, dec: 60.24, magnitude: 2.68 },
      { name: 'Segin', ra: 28.60, dec: 63.67, magnitude: 3.37 },
    ],
    lines: [[0, 1], [0, 2], [2, 3], [3, 4]],
    description: 'The Queen - Distinctive W-shaped pattern',
  },
  {
    name: 'Leo',
    stars: [
      { name: 'Regulus', ra: 152.09, dec: 11.97, magnitude: 1.35 },
      { name: 'Denebola', ra: 177.26, dec: 14.57, magnitude: 2.14 },
      { name: 'Algieba', ra: 146.46, dec: 19.84, magnitude: 2.08 },
      { name: 'Zosma', ra: 168.53, dec: 20.52, magnitude: 2.56 },
      { name: 'Chertan', ra: 168.56, dec: 15.43, magnitude: 3.34 },
    ],
    lines: [[0, 2], [2, 3], [3, 1], [3, 4], [4, 0]],
    description: 'The Lion - Bright star Regulus marks its heart',
  },
  {
    name: 'Scorpius',
    stars: [
      { name: 'Antares', ra: 247.35, dec: -26.43, magnitude: 0.96 },
      { name: 'Shaula', ra: 263.40, dec: -37.10, magnitude: 1.63 },
      { name: 'Sargas', ra: 264.33, dec: -43.00, magnitude: 1.87 },
      { name: 'Dschubba', ra: 240.08, dec: -22.62, magnitude: 2.32 },
      { name: 'Acrab', ra: 241.36, dec: -19.81, magnitude: 2.62 },
    ],
    lines: [[4, 3], [3, 0], [0, 1], [1, 2]],
    description: 'The Scorpion - Antares glows red at its heart',
  },
];

// Generate random background stars
const generateStars = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    ra: Math.random() * 360,
    dec: (Math.random() - 0.5) * 180,
    magnitude: 2 + Math.random() * 4,
  }));
};

const BACKGROUND_STARS = generateStars(200);

interface DeviceOrientation {
  alpha: number | null; // compass direction (0-360)
  beta: number | null;  // front/back tilt (-180 to 180)
  gamma: number | null; // left/right tilt (-90 to 90)
}

export function ARStarViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'skymap' | 'camera'>('skymap');
  const [orientation, setOrientation] = useState<DeviceOrientation>({ alpha: 0, beta: 0, gamma: 0 });
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [selectedConstellation, setSelectedConstellation] = useState<typeof CONSTELLATIONS[0] | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Request device orientation permission (needed for iOS 13+)
  const requestOrientationPermission = useCallback(async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        setHasPermission(permission === 'granted');
        return permission === 'granted';
      } catch {
        setHasPermission(false);
        return false;
      }
    }
    setHasPermission(true);
    return true;
  }, []);

  // Handle device orientation
  useEffect(() => {
    if (!isOpen) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      });
    };

    // For desktop, simulate with mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 360;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 180;
        setOrientation({
          alpha: x,
          beta: 90 - y,
          gamma: 0,
        });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    
    // Add mouse fallback for desktop
    if (!('DeviceOrientationEvent' in window)) {
      containerRef.current?.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen]);

  // Handle camera stream
  useEffect(() => {
    if (mode === 'camera' && isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode, isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Convert RA/Dec to screen position based on device orientation
  const getScreenPosition = (ra: number, dec: number) => {
    const alpha = orientation.alpha || 0;
    const beta = orientation.beta || 90;
    
    // Calculate relative position
    let relRA = ra - alpha;
    while (relRA > 180) relRA -= 360;
    while (relRA < -180) relRA += 360;
    
    const relDec = dec - (90 - beta);
    
    // Convert to screen coordinates (centered)
    const x = 50 + (relRA / 180) * 50;
    const y = 50 - (relDec / 90) * 50;
    
    // Check if visible on screen
    const visible = Math.abs(relRA) < 90 && Math.abs(relDec) < 60;
    
    return { x, y, visible };
  };

  const handleOpen = async () => {
    await requestOrientationPermission();
    setIsOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        className="bg-gradient-to-r from-accent to-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        <Star className="w-4 h-4 mr-2" />
        AR Star Viewer
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 bg-background border-secondary">
          <div ref={containerRef} className="relative w-full h-full overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-background/90 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  <span className="font-semibold text-foreground">AR Star Viewer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Mode Tabs */}
              <Tabs value={mode} onValueChange={(v) => setMode(v as 'skymap' | 'camera')} className="mt-3">
                <TabsList className="bg-secondary/50">
                  <TabsTrigger value="skymap" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    <Compass className="w-4 h-4 mr-2" />
                    Sky Map
                  </TabsTrigger>
                  <TabsTrigger value="camera" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    <Camera className="w-4 h-4 mr-2" />
                    Camera AR
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Camera Background (for AR mode) */}
            {mode === 'camera' && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Sky Background (for Sky Map mode) */}
            {mode === 'skymap' && (
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#1a1a3a]">
                {/* Milky Way effect */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: 'radial-gradient(ellipse at 30% 50%, rgba(200, 180, 255, 0.3) 0%, transparent 50%)',
                  }}
                />
              </div>
            )}

            {/* Star Field Overlay */}
            <div className="absolute inset-0 z-10">
              {/* Background stars */}
              {BACKGROUND_STARS.map((star) => {
                const pos = getScreenPosition(star.ra, star.dec);
                if (!pos.visible) return null;
                const size = Math.max(1, 4 - star.magnitude);
                return (
                  <div
                    key={star.id}
                    className="absolute rounded-full bg-white transition-all duration-100"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      width: size,
                      height: size,
                      opacity: Math.max(0.3, 1 - star.magnitude / 6),
                      boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.5)`,
                    }}
                  />
                );
              })}

              {/* Constellation stars and lines */}
              {CONSTELLATIONS.map((constellation) => {
                const starPositions = constellation.stars.map(star => ({
                  ...star,
                  pos: getScreenPosition(star.ra, star.dec),
                }));

                const anyVisible = starPositions.some(s => s.pos.visible);
                if (!anyVisible) return null;

                return (
                  <div key={constellation.name}>
                    {/* Constellation lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {constellation.lines.map(([start, end], i) => {
                        const s1 = starPositions[start];
                        const s2 = starPositions[end];
                        if (!s1.pos.visible && !s2.pos.visible) return null;
                        return (
                          <line
                            key={i}
                            x1={`${s1.pos.x}%`}
                            y1={`${s1.pos.y}%`}
                            x2={`${s2.pos.x}%`}
                            y2={`${s2.pos.y}%`}
                            stroke="rgba(56, 189, 248, 0.4)"
                            strokeWidth="1"
                            strokeDasharray="4,4"
                          />
                        );
                      })}
                    </svg>

                    {/* Stars */}
                    {starPositions.map((star, i) => {
                      if (!star.pos.visible) return null;
                      const size = Math.max(4, 10 - star.magnitude * 2);
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedConstellation(constellation)}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                          style={{
                            left: `${star.pos.x}%`,
                            top: `${star.pos.y}%`,
                          }}
                        >
                          <div
                            className="rounded-full bg-accent transition-all duration-200 group-hover:scale-150"
                            style={{
                              width: size,
                              height: size,
                              boxShadow: `0 0 ${size * 3}px rgba(56, 189, 248, 0.8), 0 0 ${size * 6}px rgba(56, 189, 248, 0.4)`,
                            }}
                          />
                          <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 text-xs text-accent whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {star.name}
                          </span>
                        </button>
                      );
                    })}

                    {/* Constellation label */}
                    {starPositions.some(s => s.pos.visible) && (
                      <div
                        className="absolute text-accent/70 text-sm font-medium pointer-events-none"
                        style={{
                          left: `${starPositions.reduce((acc, s) => acc + (s.pos.visible ? s.pos.x : 0), 0) / starPositions.filter(s => s.pos.visible).length}%`,
                          top: `${Math.min(...starPositions.filter(s => s.pos.visible).map(s => s.pos.y)) - 5}%`,
                        }}
                      >
                        {constellation.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Compass/Direction Indicator */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-secondary/80 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground">
                    {orientation.alpha !== null ? `${Math.round(orientation.alpha)}°` : '--'}
                  </span>
                </div>
                <div className="h-4 w-px bg-muted-foreground/30" />
                <span className="text-xs text-muted-foreground">
                  {getCardinalDirection(orientation.alpha || 0)}
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-8 left-0 right-0 z-20 text-center">
              <p className="text-xs text-muted-foreground">
                {mode === 'skymap' 
                  ? 'Move your device to explore the night sky • Tap stars for info'
                  : 'Point your camera at the sky to see constellations overlaid'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Constellation Info Modal */}
      <Dialog open={!!selectedConstellation} onOpenChange={() => setSelectedConstellation(null)}>
        <DialogContent className="bg-background border-secondary">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Star className="w-5 h-5 text-accent" />
              {selectedConstellation?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedConstellation?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Notable Stars</h4>
              <div className="flex flex-wrap gap-2">
                {selectedConstellation?.stars.map((star, i) => (
                  <Badge key={i} variant="secondary" className="bg-secondary text-secondary-foreground">
                    {star.name} (mag {star.magnitude.toFixed(2)})
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="w-4 h-4" />
              <span>Magnitude indicates brightness - lower is brighter</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function getCardinalDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export default ARStarViewer;
