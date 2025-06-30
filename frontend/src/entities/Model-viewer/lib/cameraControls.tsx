'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function CameraControls() {
  const { camera, gl } = useThree();
  const targetZoom = useRef(camera.position.z);

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZoom.current, 0.1);
  });

  useEffect(() => {
    const canvas = gl.domElement;
    const container = canvas.parentElement;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      // Блокируем скролл страницы
      event.preventDefault();

      const delta = event.deltaY * 0.01;
      targetZoom.current = Math.max(2, Math.min(15, targetZoom.current + delta));
    };

    // Слушаем именно на canvas (или div вокруг него)
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [gl]);

  return null;
}
