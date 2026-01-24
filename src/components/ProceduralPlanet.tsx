import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simplex noise functions embedded in shader
const noiseGLSL = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  float fbm(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for(int i = 0; i < 6; i++) {
      if(i >= octaves) break;
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
`;

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Atmosphere glow vertex shader
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

// Atmosphere glow fragment shader
const atmosphereFragmentShader = `
  uniform vec3 uAtmosphereColor;
  uniform float uIntensity;
  uniform float uPower;
  uniform vec3 uLightDirection;
  
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), uPower);
    
    // Add light-facing enhancement
    float lightFacing = max(dot(vNormal, uLightDirection), 0.0) * 0.3 + 0.7;
    
    vec3 glowColor = uAtmosphereColor * fresnel * uIntensity * lightFacing;
    float alpha = fresnel * uIntensity * 0.8;
    
    gl_FragColor = vec4(glowColor, alpha);
  }
`;

// Earth-like planet shader
const earthFragmentShader = `
  ${noiseGLSL}
  
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vec3 pos = vPosition * 2.0;
    
    float continents = fbm(pos + vec3(0.0, 0.0, uTime * 0.02), 5);
    continents = smoothstep(-0.1, 0.3, continents);
    
    vec3 ocean = vec3(0.1, 0.3, 0.6);
    vec3 land = vec3(0.2, 0.5, 0.2);
    vec3 desert = vec3(0.6, 0.5, 0.3);
    vec3 ice = vec3(0.9, 0.95, 1.0);
    
    float latitude = abs(vPosition.y);
    vec3 landColor = mix(land, desert, smoothstep(0.2, 0.6, fbm(pos * 3.0, 3)));
    landColor = mix(landColor, ice, smoothstep(0.7, 0.9, latitude));
    
    vec3 baseColor = mix(ocean, landColor, continents);
    
    // Clouds
    float clouds = fbm(pos * 1.5 + vec3(uTime * 0.05, 0.0, 0.0), 4);
    clouds = smoothstep(0.1, 0.5, clouds) * 0.4;
    baseColor = mix(baseColor, vec3(1.0), clouds);
    
    // Lighting
    vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    float ambient = 0.2;
    
    vec3 finalColor = baseColor * (ambient + diff * 0.8);
    
    // Atmosphere rim (subtle, main glow is separate layer)
    float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    finalColor += vec3(0.3, 0.5, 0.8) * pow(rim, 4.0) * 0.3;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Mars-like planet shader
const marsFragmentShader = `
  ${noiseGLSL}
  
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vec3 pos = vPosition * 3.0;
    
    float terrain = fbm(pos, 5);
    float craters = fbm(pos * 5.0, 3);
    craters = smoothstep(0.3, 0.5, craters) * 0.3;
    
    vec3 rust = vec3(0.7, 0.3, 0.15);
    vec3 darkRust = vec3(0.4, 0.2, 0.1);
    vec3 sand = vec3(0.8, 0.6, 0.4);
    
    vec3 baseColor = mix(darkRust, rust, terrain * 0.5 + 0.5);
    baseColor = mix(baseColor, sand, smoothstep(0.2, 0.4, terrain));
    baseColor -= craters * 0.2;
    
    // Polar ice caps
    float latitude = abs(vPosition.y);
    baseColor = mix(baseColor, vec3(0.9, 0.85, 0.8), smoothstep(0.85, 0.95, latitude));
    
    vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    gl_FragColor = vec4(baseColor * (0.3 + diff * 0.7), 1.0);
  }
`;

// Gas giant (Jupiter) shader
const jupiterFragmentShader = `
  ${noiseGLSL}
  
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    float bands = sin(vPosition.y * 15.0) * 0.5 + 0.5;
    float turbulence = fbm(vec3(vPosition.x * 3.0, vPosition.y * 8.0, uTime * 0.03), 4);
    bands += turbulence * 0.3;
    
    vec3 cream = vec3(0.9, 0.85, 0.7);
    vec3 orange = vec3(0.85, 0.55, 0.35);
    vec3 brown = vec3(0.6, 0.4, 0.3);
    vec3 white = vec3(0.95, 0.92, 0.88);
    
    vec3 baseColor = mix(cream, orange, smoothstep(0.3, 0.7, bands));
    baseColor = mix(baseColor, brown, smoothstep(0.6, 0.8, turbulence));
    baseColor = mix(baseColor, white, smoothstep(0.7, 0.9, bands) * 0.5);
    
    // Great Red Spot
    vec2 spotPos = vec2(vPosition.x - 0.3, vPosition.y + 0.2);
    float spot = 1.0 - smoothstep(0.0, 0.15, length(spotPos * vec2(1.0, 2.0)));
    baseColor = mix(baseColor, vec3(0.8, 0.3, 0.2), spot * 0.8);
    
    vec3 lightDir = normalize(vec3(1.0, 0.3, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Subtle atmosphere rim
    float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    baseColor += vec3(0.9, 0.7, 0.5) * pow(rim, 4.0) * 0.2;
    
    gl_FragColor = vec4(baseColor * (0.4 + diff * 0.6), 1.0);
  }
`;

// Saturn shader
const saturnFragmentShader = `
  ${noiseGLSL}
  
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    float bands = sin(vPosition.y * 12.0) * 0.5 + 0.5;
    float turbulence = fbm(vec3(vPosition.x * 2.0, vPosition.y * 6.0, uTime * 0.02), 3);
    bands += turbulence * 0.2;
    
    vec3 gold = vec3(0.9, 0.8, 0.5);
    vec3 tan = vec3(0.85, 0.75, 0.55);
    vec3 cream = vec3(0.95, 0.9, 0.8);
    
    vec3 baseColor = mix(gold, tan, smoothstep(0.3, 0.7, bands));
    baseColor = mix(baseColor, cream, smoothstep(0.6, 0.8, bands) * 0.4);
    
    vec3 lightDir = normalize(vec3(1.0, 0.3, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Subtle atmosphere rim
    float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    baseColor += vec3(0.95, 0.85, 0.6) * pow(rim, 4.0) * 0.2;
    
    gl_FragColor = vec4(baseColor * (0.4 + diff * 0.6), 1.0);
  }
`;

// Ice giant (Uranus/Neptune) shader
const iceGiantFragmentShader = `
  ${noiseGLSL}
  
  uniform float uTime;
  uniform vec3 uBaseColor;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    float bands = sin(vPosition.y * 8.0) * 0.5 + 0.5;
    float turbulence = fbm(vec3(vPosition.x * 2.0, vPosition.y * 4.0, uTime * 0.01), 4);
    
    vec3 light = uBaseColor * 1.3;
    vec3 dark = uBaseColor * 0.6;
    
    vec3 baseColor = mix(dark, light, bands * 0.5 + turbulence * 0.3);
    
    // Subtle storms
    float storms = fbm(vPosition * 4.0 + vec3(uTime * 0.02, 0.0, 0.0), 3);
    baseColor += vec3(0.1) * smoothstep(0.4, 0.6, storms);
    
    vec3 lightDir = normalize(vec3(1.0, 0.3, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Atmosphere rim
    float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    baseColor += uBaseColor * pow(rim, 3.0) * 0.4;
    
    gl_FragColor = vec4(baseColor * (0.3 + diff * 0.7), 1.0);
  }
`;

// Rocky planet (Mercury/Venus) shader
const rockyFragmentShader = `
  ${noiseGLSL}
  
  uniform float uTime;
  uniform vec3 uBaseColor;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vec3 pos = vPosition * 4.0;
    
    float terrain = fbm(pos, 5);
    float craters = fbm(pos * 8.0, 3);
    craters = pow(smoothstep(0.35, 0.45, craters), 2.0) * 0.4;
    
    vec3 light = uBaseColor * 1.2;
    vec3 dark = uBaseColor * 0.5;
    
    vec3 baseColor = mix(dark, light, terrain * 0.5 + 0.5);
    baseColor -= craters;
    
    vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    gl_FragColor = vec4(baseColor * (0.2 + diff * 0.8), 1.0);
  }
`;

type PlanetType = 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'mercury' | 'venus';

interface AtmosphereConfig {
  color: string;
  intensity: number;
  power: number;
  scale: number;
}

const atmosphereConfigs: Record<PlanetType, AtmosphereConfig | null> = {
  earth: { color: '#4da6ff', intensity: 1.2, power: 2.5, scale: 1.15 },
  mars: null, // Mars has thin atmosphere, skip
  jupiter: { color: '#ffcc99', intensity: 0.8, power: 3.0, scale: 1.08 },
  saturn: { color: '#ffe4b3', intensity: 0.7, power: 3.0, scale: 1.08 },
  uranus: { color: '#a6e6ff', intensity: 0.9, power: 2.5, scale: 1.12 },
  neptune: { color: '#6699ff', intensity: 1.0, power: 2.5, scale: 1.12 },
  mercury: null,
  venus: { color: '#ffdd99', intensity: 0.6, power: 3.5, scale: 1.1 }, // Venus has thick hazy atmosphere
};

interface AtmosphereGlowProps {
  config: AtmosphereConfig;
  size: number;
}

function AtmosphereGlow({ config, size }: AtmosphereGlowProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    uAtmosphereColor: { value: new THREE.Color(config.color) },
    uIntensity: { value: config.intensity },
    uPower: { value: config.power },
    uLightDirection: { value: new THREE.Vector3(1, 0.5, 1).normalize() }
  }), [config]);

  return (
    <mesh ref={meshRef} scale={config.scale}>
      <sphereGeometry args={[size, 64, 64]} />
      <shaderMaterial
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

interface ProceduralPlanetProps {
  planetType: PlanetType;
  baseColor?: string;
  size?: number;
}

export function ProceduralPlanet({ planetType, baseColor = '#888888', size = 1.5 }: ProceduralPlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const { fragmentShader, uniforms } = useMemo(() => {
    const baseUniforms = {
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color(baseColor) }
    };
    
    switch (planetType) {
      case 'earth':
        return { fragmentShader: earthFragmentShader, uniforms: baseUniforms };
      case 'mars':
        return { fragmentShader: marsFragmentShader, uniforms: baseUniforms };
      case 'jupiter':
        return { fragmentShader: jupiterFragmentShader, uniforms: baseUniforms };
      case 'saturn':
        return { fragmentShader: saturnFragmentShader, uniforms: baseUniforms };
      case 'uranus':
        return { 
          fragmentShader: iceGiantFragmentShader, 
          uniforms: { ...baseUniforms, uBaseColor: { value: new THREE.Color('#72b5c7') } }
        };
      case 'neptune':
        return { 
          fragmentShader: iceGiantFragmentShader, 
          uniforms: { ...baseUniforms, uBaseColor: { value: new THREE.Color('#4b70dd') } }
        };
      case 'mercury':
        return { 
          fragmentShader: rockyFragmentShader, 
          uniforms: { ...baseUniforms, uBaseColor: { value: new THREE.Color('#8c7853') } }
        };
      case 'venus':
        return { 
          fragmentShader: rockyFragmentShader, 
          uniforms: { ...baseUniforms, uBaseColor: { value: new THREE.Color('#e6c87a') } }
        };
      default:
        return { fragmentShader: rockyFragmentShader, uniforms: baseUniforms };
    }
  }, [planetType, baseColor]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.uTime.value = clock.getElapsedTime();
      }
    }
  });

  const atmosphereConfig = atmosphereConfigs[planetType];

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      {atmosphereConfig && (
        <AtmosphereGlow config={atmosphereConfig} size={size} />
      )}
    </group>
  );
}
