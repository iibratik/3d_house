'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Html, useProgress } from '@react-three/drei';
import { Suspense, memo } from 'react';
import * as THREE from 'three';
import { HoverControlledModel } from './HoverControlledModel';
import { Button } from '@/shared/ui/Button/Button';
import { CameraControls } from '../lib/cameraControls';

interface Props {
  modelUrl?: string;
  imageUrl?: string;
  className?: string;
  showEnvironment?: boolean;
  index: number;
  loadingCount?: number;
  setLoadingCount: (fn: (prev: number) => number) => void;
  activeModelIndex: number | null;
  setActiveModelIndex: (index: number | null) => void;
  onLoadComplete: () => void;
}

function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center className="relative z-0">
      <div className="flex flex-col items-center space-y-2 bg-white/80 p-4 rounded-lg shadow-md">
        <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-600">{Math.round(progress)}% загружено</p>
      </div>
    </Html>
  );
}

const MemoizedHoverModel = memo(HoverControlledModel);

export function ModelPreViewer({
  modelUrl,
  className,
  showEnvironment = true,
  setLoadingCount,
  activeModelIndex,
  imageUrl,
  setActiveModelIndex,
  index,
  onLoadComplete,
}: Props) {
  const isActive = activeModelIndex === index;

  const handleLoadComplete = () => {
    setLoadingCount((prev) => prev - 1);
    onLoadComplete();
  };

  return (
    <div className={`${className ?? ''} h-full relative w-full bg-gray-50 rounded-lg overflow-hidden`} >
      {!isActive ? (
        <div style={{
          background: `url(${imageUrl})`
        }
        } className="flex items-end mb-4 justify-center h-full pb-3" >
          <Button
            onClick={() => {


              setLoadingCount((prev) => prev + 1);
              setActiveModelIndex(index);
            }}
          >
            Показать модель
          </Button>
        </div>
      ) : modelUrl ? (

        <Canvas style={{ pointerEvents: 'none' }} camera={{ position: new THREE.Vector3(10, 7, 5), fov: 50 }} gl={{ preserveDrawingBuffer: false }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />
          {showEnvironment && <Environment preset="apartment" />}

          <CameraControls />

          <Suspense fallback={<CanvasLoader />}>
            <MemoizedHoverModel
              url={modelUrl}
              onLoaded={handleLoadComplete}
              onError={handleLoadComplete}
            />
          </Suspense>
        </Canvas>

      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          Модель не указана
        </div>
      )}

      {isActive && (
        <>
          <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded z-10">
            Наведите мышь для поворота • Прокрутите для масштабирования
          </div>
          <button
            onClick={() => setActiveModelIndex(null)}
            className="absolute top-2 right-2 text-xs text-red-600 hover:text-red-800 z-10 cursor-pointer"
          >
            Закрыть
          </button>
        </>
      )}
    </div>
  );
}