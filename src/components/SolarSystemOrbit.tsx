import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Planet data with orbital properties (using colors instead of textures for reliability)
const ORBITAL_PLANETS = [
  { id: 'mercury', name: 'Mercury', distance: 2.5, size: 0.15, speed: 4.15, color: '#8c7853', emissive: '#5c5040' },
  { id: 'venus', name: 'Venus', distance: 3.2, size: 0.22, speed: 1.62, color: '#e6c87a', emissive: '#c4a55a' },
  { id: 'earth', name: 'Earth', distance: 4, size: 0.23, speed: 1, color: '#4a90d9', emissive: '#2d5a87' },
  { id: 'mars', name: 'Mars', distance: 5, size: 0.18, speed: 0.53, color: '#c1440e', emissive: '#8a2f08' },
  { id: 'jupiter', name: 'Jupiter', distance: 7, size: 0.5, speed: 0.084, color: '#d4a574', emissive: '#a67c52' },
  { id: 'saturn', name: 'Saturn', distance: 9, size: 0.45, speed: 0.034, color: '#f4d59e', emissive: '#c4a574', hasRings: true },
  { id: 'uranus', name: 'Uranus', distance: 11, size: 0.3, speed: 0.012, color: '#72b5c7', emissive: '#4a8a9a' },
  { id: 'neptune', name: 'Neptune', distance: 13, size: 0.28, speed: 0.006, color: '#4b70dd', emissive: '#2d4a9a' },
];

interface OrbitingPlanetProps {
  planet: typeof ORBITAL_PLANETS[0];
  onClick: (planet: typeof ORBITAL_PLANETS[0]) => void;
  speedMultiplier: number;
}

function OrbitingPlanet({ planet, onClick, speedMultiplier }: OrbitingPlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  // Random starting position for variety
  const initialAngle = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const angle = initialAngle + clock.getElapsedTime() * planet.speed * 0.1 * speedMultiplier;
      groupRef.current.position.x = Math.cos(angle) * planet.distance;
      groupRef.current.position.z = Math.sin(angle) * planet.distance;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere
        ref={meshRef}
        args={[planet.size, 32, 32]}
        onClick={(e) => {
          e.stopPropagation();
          onClick(planet);
        }}
      >
        <meshStandardMaterial 
          color={planet.color}
          emissive={planet.emissive}
          emissiveIntensity={0.2}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>
      
      {planet.hasRings && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[planet.size * 1.4, planet.size * 2, 32]} />
          <meshStandardMaterial
            color="#e8d5b0"
            side={THREE.DoubleSide}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
    </group>
  );
}

function OrbitRing({ distance }: { distance: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[distance - 0.02, distance + 0.02, 128]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshBasicMaterial color="#ffaa00" />
      </Sphere>
      {/* Sun glow layers */}
      <Sphere args={[1.15, 32, 32]}>
        <meshBasicMaterial color="#ff8800" transparent opacity={0.4} />
      </Sphere>
      <Sphere args={[1.3, 32, 32]}>
        <meshBasicMaterial color="#ff6600" transparent opacity={0.2} />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffcc66" distance={50} />
    </group>
  );
}

interface SolarSystemOrbitProps {
  onPlanetClick: (planetId: string) => void;
  speedMultiplier?: number;
}

export function SolarSystemOrbit({ onPlanetClick, speedMultiplier = 1 }: SolarSystemOrbitProps) {
  const handlePlanetClick = (planet: typeof ORBITAL_PLANETS[0]) => {
    onPlanetClick(planet.id);
  };

  return (
    <div className="w-full h-[350px] sm:h-[450px] rounded-xl overflow-hidden bg-background border border-border/30">
      <Canvas camera={{ position: [0, 15, 20], fov: 50 }}>
        <ambientLight intensity={0.15} />
        
        <Stars radius={200} depth={100} count={3000} factor={4} fade speed={0.5} />
        
        {/* Sun */}
        <Sun />
        
        {/* Orbit rings */}
        {ORBITAL_PLANETS.map((planet) => (
          <OrbitRing key={`orbit-${planet.id}`} distance={planet.distance} />
        ))}
        
        {/* Planets */}
        {ORBITAL_PLANETS.map((planet) => (
          <OrbitingPlanet
            key={planet.id}
            planet={planet}
            onClick={handlePlanetClick}
            speedMultiplier={speedMultiplier}
          />
        ))}
        
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={5}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}