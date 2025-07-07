'use client';

import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useMemo, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { KTX2Loader } from 'three-stdlib';

// Импортируем модуль взаимодействия без store
import {
    getParentFloor,
    resetMaterials,
    highlightFloor,
    animateGlow,
} from '@/entities/Model-viewer/lib/interaction';

interface Props {
    url: string;
    onError?: () => void;
    onLoaded?: () => void;
    minZoom?: number;
    maxZoom?: number;
    onFloorSelect?: (floorName: string | null) => void;
}

export function ModelViewerController({
    url,
    onError,
    onLoaded,
    minZoom = 5,
    maxZoom = 25,
    onFloorSelect,
}: Props) {
    const groupRef = useRef<THREE.Group>(null);
    const { gl, camera } = useThree();
    const [floorGroups, setFloorGroups] = useState<THREE.Group[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [prevMouseX, setPrevMouseX] = useState<number | null>(null);
    const targetRotationY = useRef(0);
    const targetDistance = useRef(camera.position.length());

    const { scene: loadedScene } = useGLTF(url, undefined, undefined, (loader) => {
        const ktx2 = new KTX2Loader().setTranscoderPath('https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/');
        ktx2.detectSupport(gl);
        loader.setKTX2Loader(ktx2);
    });

    const centeredScene = useMemo(() => {
        if (!loadedScene) return null;
        const clone = loadedScene.clone(true);
        const box = new THREE.Box3().setFromObject(clone);
        const center = new THREE.Vector3();
        box.getCenter(center);
        clone.position.sub(center);

        const groups: THREE.Group[] = [];
        clone.traverse((child) => {
            if (child instanceof THREE.Group) {
                groups.push(child);
            }
        });
        setFloorGroups(groups);
        return clone;
    }, [loadedScene]);

    useEffect(() => {
        if (centeredScene) onLoaded?.();
        else onError?.();
    }, [centeredScene, onLoaded, onError]);

    useEffect(() => {
        const canvas = gl.domElement;

        const handleMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) return;
            setIsDragging(true);
            setPrevMouseX(e.clientX);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setPrevMouseX(null);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || prevMouseX === null) return;
            const deltaX = e.clientX - prevMouseX;
            targetRotationY.current += deltaX * 0.01;
            setPrevMouseX(e.clientX);
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY * 0.01;
            targetDistance.current = THREE.MathUtils.clamp(
                targetDistance.current + delta,
                minZoom,
                maxZoom
            );
        };

        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouse = new THREE.Vector2(
                ((e.clientX - rect.left) / rect.width) * 2 - 1,
                -((e.clientY - rect.top) / rect.height) * 2 + 1
            );

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(floorGroups, true);

            if (intersects.length > 0) {
                const clicked = intersects[0].object;
                const parentFloor = getParentFloor(clicked, floorGroups);
                if (!parentFloor) {
                    onFloorSelect?.(null);
                    return;
                }

                resetMaterials(floorGroups);
                highlightFloor(parentFloor);
                animateGlow(parentFloor);

                onFloorSelect?.(parentFloor.name || null);

                console.log('✅ Клик по объекту:', clicked.name || clicked);
                console.log('📦 Родительская группа:', parentFloor.name || '(без имени)');
            } else {
                console.log('❌ Клик мимо модели');
                onFloorSelect?.(null);
            }
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('wheel', handleWheel, { passive: false });
        canvas.addEventListener('click', handleClick);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('click', handleClick);
        };
    }, [gl, camera, floorGroups, isDragging, prevMouseX, minZoom, maxZoom, onFloorSelect]);

    if (!centeredScene) return null;

    return (
        <group ref={groupRef}>
            <primitive object={centeredScene} />
        </group>
    );
}
