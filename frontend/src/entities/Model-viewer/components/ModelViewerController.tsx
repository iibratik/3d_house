'use client';

import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { KTX2Loader } from 'three-stdlib';

interface Props {
    url: string;
    onError?: () => void;
    onLoaded?: () => void;
}


export function ModelViewerController({ url, onError, onLoaded }: Props) {
    const groupRef = useRef<THREE.Group>(null);
    const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
    const gl = useThree((state) => state.gl);

    const { scene } = useGLTF(url, undefined, undefined, (loader) => {
        const ktx2 = new KTX2Loader().setTranscoderPath(
            'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/'
        );
        ktx2.detectSupport(gl);
        loader.setKTX2Loader(ktx2);
    });

    const centeredScene = useMemo(() => {
        if (!scene) return null;

        const clone = scene.clone(true);

        const box = new THREE.Box3().setFromObject(clone);
        const center = new THREE.Vector3();
        box.getCenter(center);
        clone.position.sub(center); // Сдвиг в (0, 0, 0)

        return clone;
    }, [scene]);

    useEffect(() => {
        if (centeredScene && onLoaded) {
            onLoaded();
        } else if (!centeredScene && onError) {
            onError();
        }
    }, [centeredScene, onLoaded, onError]);

    // Вращение при наведении мыши
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

    // ❌ Удаляем handleWheel (если используем CameraControls зум)

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
        }
    });

    if (!centeredScene) return null;

    return (
        <group ref={groupRef}>
            <primitive object={centeredScene} />
        </group>
    );
}
