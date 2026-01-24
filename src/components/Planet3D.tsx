import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetMeshProps {
  color: string;
  emissive?: string;
  hasRings?: boolean;
  ringColor?: string;
  rotationSpeed?: number;
}

function PlanetMesh({ color, emissive, hasRings, ringColor, rotationSpeed = 0.005 }: PlanetMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += rotationSpeed * 0.5;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <meshStandardMaterial
          color={color}
          emissive={emissive || color}
          emissiveIntensity={0.1}
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>
      
      {hasRings && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[2, 2.8, 64]} />
          <meshStandardMaterial
            color={ringColor || '#c4a574'}
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
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#38bdf8" />
        
        <Stars radius={100} depth={50} count={1000} factor={2} fade speed={1} />
        
        <PlanetMesh
          color={planetData.color}
          emissive={planetData.emissive}
          hasRings={planetData.hasRings}
          ringColor={planetData.ringColor}
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
