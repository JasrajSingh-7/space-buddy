import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

// Planet data with orbital properties
const ORBITAL_PLANETS = [
  { id: 'mercury', name: 'Mercury', distance: 2.5, size: 0.15, speed: 4.15, color: '#8c7853', texture: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg' },
  { id: 'venus', name: 'Venus', distance: 3.2, size: 0.22, speed: 1.62, color: '#e6c87a', texture: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg' },
  { id: 'earth', name: 'Earth', distance: 4, size: 0.23, speed: 1, color: '#4a90d9', texture: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg' },
  { id: 'mars', name: 'Mars', distance: 5, size: 0.18, speed: 0.53, color: '#c1440e', texture: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg' },
  { id: 'jupiter', name: 'Jupiter', distance: 7, size: 0.5, speed: 0.084, color: '#d4a574', texture: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg' },
  { id: 'saturn', name: 'Saturn', distance: 9, size: 0.45, speed: 0.034, color: '#f4d59e', texture: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg', hasRings: true },
  { id: 'uranus', name: 'Uranus', distance: 11, size: 0.3, speed: 0.012, color: '#72b5c7', texture: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg' },
  { id: 'neptune', name: 'Neptune', distance: 13, size: 0.28, speed: 0.006, color: '#4b70dd', texture: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg' },
];

const SUN_TEXTURE = 'https://www.solarsystemscope.com/textures/download/2k_sun.jpg';

interface OrbitingPlanetProps {
  planet: typeof ORBITAL_PLANETS[0];
  onClick: (planet: typeof ORBITAL_PLANETS[0]) => void;
  speedMultiplier: number;
}

function OrbitingPlanet({ planet, onClick, speedMultiplier }: OrbitingPlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const texture = useLoader(TextureLoader, planet.texture);
  
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
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(planet);
        }}
      >
        <sphereGeometry args={[planet.size, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      
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
  const texture = useLoader(TextureLoader, SUN_TEXTURE);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      {/* Sun glow */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.15} />
      </mesh>
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
