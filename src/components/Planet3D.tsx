import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetMeshProps {
  color: string;
  emissive?: string;
  hasRings?: boolean;
  rotationSpeed?: number;
}

function PlanetMesh({ color, emissive, hasRings, rotationSpeed = 0.003 }: PlanetMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

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
          color={color}
          emissive={emissive || color}
          emissiveIntensity={0.15}
          roughness={0.7}
          metalness={0.2}
        />
      </Sphere>
      
      {hasRings && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[2, 3, 64]} />
          <meshStandardMaterial
            color="#e8d5b0"
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
        
        <PlanetMesh
          color={planetData.color}
          emissive={planetData.emissive}
          hasRings={planetData.hasRings}
        />
        
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
