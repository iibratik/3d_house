// components/ModelViewer.tsx
'use client';

import React, { FC, Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html, useProgress, CameraControls as DreiCameraControls, CameraControlsImpl } from '@react-three/drei';
import { ModelViewerController } from './ModelViewerController';

interface floorProps {
    block: string,
    floor: string
}

interface Props {
    modelUrl?: string;
    className?: string;
    showEnvironment?: boolean;
    /** Передаём колбэк из родителя */
    onFloorChange: (floorName: floorProps | null) => void;
}

const CanvasLoader: FC = () => {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center space-y-2 bg-white/80 p-4 rounded-lg shadow-md">
                <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-sm text-gray-600">{Math.round(progress)}% загружено</p>
            </div>
        </Html>
    );
};

export const ModelViewer: FC<Props> = ({
    modelUrl,
    className,
    showEnvironment = true,
    onFloorChange,
}) => {
    const [error, setError] = useState(false);

    return (
        <div className={`${className ?? ''} h-full relative w-full bg-primary-dark rounded-lg overflow-hidden`}>
            <Canvas camera={{ position: [10, 15, 15], fov: 50 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} />
                <directionalLight position={[-10, -10, -5]} intensity={0.3} />

                {showEnvironment && <Environment preset="apartment" />}
                <CameraControlsWithTarget />

                <Suspense fallback={<CanvasLoader />}>
                    {modelUrl && (
                        <ModelViewerController
                            url={modelUrl}
                            onError={() => setError(true)}
                            onLoaded={() => { }}
                            onFloorChange={onFloorChange}
                        />
                    )}
                </Suspense>
            </Canvas>

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
};

const CameraControlsWithTarget: FC = () => {
    const ref = useRef<CameraControlsImpl | null>(null);
    useEffect(() => {
        ref.current?.setLookAt(15, 7, 5, 0, 0, 0, true);
    }, []);
    return <DreiCameraControls ref={ref} makeDefault minDistance={8} maxDistance={20} />;
};
