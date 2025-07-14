import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random particle positions
  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#A855F7"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function NetworkNodes() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={ref}>
      {/* Central node */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#22D3EE" />
      </mesh>
      
      {/* Surrounding nodes */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 3;
        const y = Math.sin(angle) * 3;
        
        return (
          <group key={i}>
            <mesh position={[x, y, 0]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshBasicMaterial color="#A855F7" />
            </mesh>
            {/* Connection lines */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  array={new Float32Array([0, 0, 0, x, y, 0])}
                  count={2}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#A855F7" opacity={0.3} transparent />
            </line>
          </group>
        );
      })}
    </group>
  );
}

export const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <NetworkNodes />
      </Canvas>
    </div>
  );
};