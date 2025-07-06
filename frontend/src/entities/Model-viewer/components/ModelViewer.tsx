'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Html, useProgress, CameraControls as DreiCameraControls, CameraControlsImpl } from '@react-three/drei';
import { Suspense, useState, memo, useRef, useEffect, FC } from 'react';
import { ModelViewerController } from './ModelViewerController';

interface Props {
    modelUrl?: string;
    className?: string;
    showEnvironment?: boolean;
}

// Компонент загрузки модели
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

// Мемоизированная модель
const MemoizedModel = memo(ModelViewerController);

// Основной компонент
export const ModelViewer: FC<Props> = ({
    modelUrl,
    className,
    showEnvironment = true,
}) => {
    const [error, setError] = useState<boolean>(false);

    return (
        <div className={`${className ?? ''} h-full relative w-full bg-primary-dark rounded-lg overflow-hidden`}>
            <Canvas camera={{ position: [10, 15, 15], fov: 50 }}>
                {/* Освещение */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} />
                <directionalLight position={[-10, -10, -5]} intensity={0.3} />

                {/* Среда */}
                {showEnvironment && <Environment preset="apartment" />}

                {/* Камера с фиксированным таргетом */}
                <CameraControlsWithTarget />

                {/* Загрузка модели */}
                <Suspense fallback={<CanvasLoader />}>
                    {modelUrl && (
                        <MemoizedModel url={modelUrl} onError={() => setError(true)} />
                    )}
                </Suspense>
            </Canvas>

            {/* Инструкция */}
            <div className="absolute bottom-4 left-4 lg:right-auto right-4  text-xs text-gray-500 bg-white/80 px-2 py-1 rounded z-10">
                Наведите мышь для поворота • Прокрутите для масштабирования
            </div>

            {/* Ошибка загрузки */}
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

// Камера с направлением на центр
const CameraControlsWithTarget: FC = () => {
    const ref = useRef<CameraControlsImpl | null>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.setLookAt(
                15, 7, 5,
                0, 0, 0,
                true      
            );
        }
    }, []);

    return <DreiCameraControls ref={ref} makeDefault />;
};
