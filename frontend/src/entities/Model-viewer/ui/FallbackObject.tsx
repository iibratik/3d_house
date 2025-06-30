'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FallbackObject({ groupRef }: { groupRef: React.RefObject<THREE.Group> | null }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y = clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}
