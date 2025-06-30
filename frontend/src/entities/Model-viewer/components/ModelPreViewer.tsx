'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Html, useProgress } from '@react-three/drei';
import { Suspense, useState, memo } from 'react';
import { CameraControls } from '../lib/cameraControls';
import { HoverControlledModel } from './HoverControlledModel';

interface Props {
  modelUrl?: string;
  className?: string;
  showEnvironment?: boolean;
}

function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
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
}: Props) {
  const [error, setError] = useState(false);

  return (
    <div className={`${className} h-full relative w-full  bg-gray-50 rounded-lg overflow-hidden`}>
      <Canvas camera={{ position: [10, 7, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />

        {showEnvironment && <Environment preset="apartment" />}
        <CameraControls />

        <Suspense fallback={<CanvasLoader />}>
          {modelUrl && (
            <MemoizedHoverModel url={modelUrl} onError={() => setError(true)} />
          )}
        </Suspense>
      </Canvas>

      <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded z-10">
        Наведите мышь для поворота • Прокрутите для масштабирования
      </div>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Не удалось загрузить 3D-модель</p>
            <button
              onClick={() => setError(false)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
