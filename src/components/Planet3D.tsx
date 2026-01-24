import { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

// NASA/Solar System Scope texture URLs
const PLANET_TEXTURES: Record<string, string> = {
  mercury: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
  venus: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
  earth: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
  mars: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
  jupiter: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
  saturn: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
  uranus: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
  neptune: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
};

const RING_TEXTURE = 'https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png';

interface PlanetMeshProps {
  planetId: string;
  color: string;
  hasRings?: boolean;
  rotationSpeed?: number;
}

function PlanetMesh({ planetId, color, hasRings, rotationSpeed = 0.003 }: PlanetMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const textureUrl = PLANET_TEXTURES[planetId];
  const texture = useLoader(TextureLoader, textureUrl || '');
  
  // Load ring texture for Saturn/Uranus
  const ringTexture = hasRings ? useLoader(TextureLoader, RING_TEXTURE) : null;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += rotationSpeed * 0.3;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <meshStandardMaterial
          map={texture}
          roughness={0.9}
          metalness={0.1}
        />
      </Sphere>
      
      {hasRings && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[2, 3, 64]} />
          <meshStandardMaterial
            map={ringTexture}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
            color={planetId === 'saturn' ? '#e8d5b0' : '#7ab8c9'}
          />
        </mesh>
      )}
    </group>
  );
}

// Fallback component when texture loading fails
function FallbackPlanet({ color, hasRings }: { color: string; hasRings?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.001;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>
      {hasRings && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[2, 3, 64]} />
          <meshStandardMaterial
            color="#c4a574"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

interface Planet3DProps {
  planetData: {
    id: string;
    name: string;
    color: string;
    emissive?: string;
    hasRings?: boolean;
    ringColor?: string;
  };
}

export function Planet3D({ planetData }: Planet3DProps) {
  return (
    <div className="w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden bg-background">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#38bdf8" />
        
        <Stars radius={100} depth={50} count={1500} factor={3} fade speed={1} />
        
        <ErrorBoundary fallback={<FallbackPlanet color={planetData.color} hasRings={planetData.hasRings} />}>
          <PlanetMesh
            planetId={planetData.id}
            color={planetData.color}
            hasRings={planetData.hasRings}
          />
        </ErrorBoundary>
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

// Simple error boundary for 3D content
function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  return <>{children}</>;
}
