'use client';

import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { KTX2Loader, } from 'three-stdlib'

interface Props {
  url: string;
  onError?: () => void;
  onLoaded?: () => void;
}

const gltfCache = new Map<string, THREE.Group>();

export function HoverControlledModel({ url, onError, onLoaded }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
  const [scaleFactor, setScaleFactor] = useState(1);
  const gl = useThree((state) => state.gl);

  const { scene } = useGLTF(url, undefined, undefined, (loader) => {
    const ktx2 = new KTX2Loader()
      .setTranscoderPath('https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/')
    ktx2.detectSupport(gl)
    loader.setKTX2Loader(ktx2)
  });

  const clonedScene = useMemo(() => {
    if (!scene) return null;

    if (!gltfCache.has(url)) {
      gltfCache.set(url, scene.clone(true));
    }
    return gltfCache.get(url)!.clone(true);
  }, [scene, url]);

  useEffect(() => {
    if (clonedScene && onLoaded) {
      onLoaded();
    } else if (!clonedScene && onError) {
      onError();
    }
  }, [clonedScene, onLoaded, onError]);

  // Обработка вращения при наведении
  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (isInside) {
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        setTargetRotation({ x: 0, y: x * 2.5 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gl]);

  // Обработка зума при прокрутке
  useEffect(() => {
    const canvas = gl.domElement;

    const handleWheel = (event: WheelEvent) => {
      const rect = canvas.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (isInside) {
        event.preventDefault(); // Блокирует прокрутку страницы

        setScaleFactor(prev => {
          const next = THREE.MathUtils.clamp(prev - event.deltaY * 0.001, 0.1, 3);
          return next;
        });
      }
    };

    // Добавим и к canvas, и к window для надёжности
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [gl]);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.x,
        0.1
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.y,
        0.1
      );

      groupRef.current.scale.setScalar(scaleFactor);
    }
  });

  if (!clonedScene) return null;

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}
