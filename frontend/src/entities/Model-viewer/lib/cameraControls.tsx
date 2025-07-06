'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CameraControlsProps {
  /** Минимальное приближение камеры (Z-позиция) */
  minZoom?: number;
  /** Максимальное отдаление камеры (Z-позиция) */
  maxZoom?: number;
  /** Чувствительность зума колёсиком */
  zoomSpeed?: number;
}

/**
 * Простой контроллер камеры:
 * — плавный зум колёсиком мыши в диапазоне [minZoom, maxZoom]
 * — камера всегда смотрит на центр сцены (0, 0, 0)
 */
export function CameraControls({
  minZoom = 2,
  maxZoom = 5,
  zoomSpeed = 0.1,
}: CameraControlsProps) {
  const { camera, gl } = useThree();
  // Начальный целевой зум — текущая Z-позиция камеры
  const targetZoom = useRef(camera.position.z);

  // useFrame для плавного приближения/отдаления и постоянного LookAt(0,0,0)
  useFrame(() => {
    // Ограничиваем целевой зум в заданном диапазоне
    const clamped = THREE.MathUtils.clamp(targetZoom.current, minZoom, maxZoom);
    // Плавно интерполируем фактическую позицию к целевой
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, clamped, 0.1);
    // Камера всегда смотрит в точку (0,0,0) — центр модели
    camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    const canvas = gl.domElement;
    // Привязываем обработчик к контейнеру канваса, чтобы блокировать прокрутку страницы
    const container = canvas.parentElement ?? canvas;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      // Меняем целевой зум с учётом чувствительности
      targetZoom.current = THREE.MathUtils.clamp(
        targetZoom.current + event.deltaY * zoomSpeed,
        minZoom,
        maxZoom
      );
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [gl, minZoom, maxZoom, zoomSpeed]);

  return null;
}
