import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ProceduralPlanet } from './ProceduralPlanet';

// Saturn's rings component
function SaturnRings() {
  return (
    <mesh rotation={[Math.PI / 2.2, 0, 0]}>
      <ringGeometry args={[2, 3.2, 64]} />
      <meshStandardMaterial
        color="#d4b896"
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

// Uranus rings (thinner)
function UranusRings() {
  return (
    <mesh rotation={[Math.PI / 2.2, 0, 0]}>
      <ringGeometry args={[2.2, 2.6, 64]} />
      <meshStandardMaterial
        color="#7ab8c9"
        side={THREE.DoubleSide}
        transparent
        opacity={0.5}
      />
    </mesh>
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

type PlanetType = 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'mercury' | 'venus';

export function Planet3D({ planetData }: Planet3DProps) {
  const planetType = planetData.id as PlanetType;
  
  return (
    <div className="w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden bg-background">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.2} color="#38bdf8" />
        
        <Stars radius={100} depth={50} count={1500} factor={3} fade speed={1} />
        
        <Suspense fallback={null}>
          <group>
            <ProceduralPlanet 
              planetType={planetType} 
              baseColor={planetData.color}
              size={1.5}
            />
            {planetData.id === 'saturn' && <SaturnRings />}
            {planetData.id === 'uranus' && <UranusRings />}
          </group>
        </Suspense>
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}

// Simple error boundary for 3D content
function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  return <>{children}</>;
}
