'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { useThree, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader, DRACOLoader, KTX2Loader } from 'three-stdlib';
import * as THREE from 'three';
import { Html, useProgress } from '@react-three/drei';

interface Props {
  url: string;
  onError?: () => void;
  onLoaded?: () => void;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: 'white', fontSize: '1.2rem' }}>
        Загрузка... {Math.round(progress)}%
      </div>
    </Html>
  );
}

export function HoverControlledModel({ url, onLoaded }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetScale = useRef<number>(1);
  const currentScale = useRef<number>(1);
  const { gl } = useThree();

  const gltf = useLoader(
    GLTFLoader,
    url,
    (loader) => {
      const ktx2 = new KTX2Loader()
        .setTranscoderPath('https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/')
        .detectSupport(gl);
      const draco = new DRACOLoader().setDecoderPath(
        'https://www.gstatic.com/draco/v1/decoders/'
      );
      loader.setKTX2Loader(ktx2);
      loader.setDRACOLoader(draco);
    }
  );

  const scene = gltf.scene.clone(true);

  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.frustumCulled = true;
      }
    });

    onLoaded?.();
  }, [scene, onLoaded]);

  // ✅ Мышь (десктоп)
  useEffect(() => {
    const canvas = gl.domElement;
    const handle = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) return;

      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetRotation.current.y = x * 2.5;
    };

    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [gl]);

  // ✅ Свайп (мобильные устройства)
  useEffect(() => {
    const canvas = gl.domElement;
    let lastTouchX: number | null = null;

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        lastTouchX = event.touches[0].clientX;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 1 && lastTouchX !== null) {
        const currentX = event.touches[0].clientX;
        const deltaX = currentX - lastTouchX;
        lastTouchX = currentX;

        targetRotation.current.y += deltaX * 0.01; // чувствительность
      }
    };

    const handleTouchEnd = () => {
      lastTouchX = null;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [gl]);

  // ✅ Зум колесиком
  useEffect(() => {

    const canvas = gl.domElement;
    const handle = (event: WheelEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) return;

      event.preventDefault();

      const next = THREE.MathUtils.clamp(
        targetScale.current - event.deltaY * 0.002,
        1,
        2
      );
      targetScale.current = next;
    };

    canvas.addEventListener('wheel', handle, { passive: false });
    return () => canvas.removeEventListener('wheel', handle);


  }, [gl]);

  // ✅ Плавная анимация
  useFrame(() => {
    if (groupRef.current) {
      currentRotation.current.x = THREE.MathUtils.lerp(
        currentRotation.current.x,
        targetRotation.current.x,
        0.1
      );
      currentRotation.current.y = THREE.MathUtils.lerp(
        currentRotation.current.y,
        targetRotation.current.y,
        0.1
      );
      currentScale.current = THREE.MathUtils.lerp(
        currentScale.current,
        targetScale.current,
        0.1
      );

      groupRef.current.rotation.set(
        currentRotation.current.x,
        currentRotation.current.y,
        0
      );

      groupRef.current.scale.setScalar(currentScale.current);
    }
  });

  return (
    <Suspense fallback={<Loader />}>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    </Suspense>
  );
}
