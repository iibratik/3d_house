'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { KTX2Loader } from 'three-stdlib';
import type { floorProps } from './ModelViewer'; // 👈 импорт нужного типа

interface Props {
    url: string;
    onError?: () => void;
    onLoaded?: () => void;
    onFloorChange?: (floorName: floorProps | null) => void; // ✅ правильно указанный тип
}

export function ModelViewerController({
    url,
    onError,
    onLoaded,
    onFloorChange,
}: Props) {
    const groupRef = useRef<THREE.Group>(null);
    const { gl, camera } = useThree();
    const rotationSpeed = useRef(0);

    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    const mouse = useRef(new THREE.Vector2());

    const activeRef = useRef<THREE.Group | null>(null);
    const originalMaterials = useRef<Map<string, THREE.Material>>(new Map());
    const animating = useRef(false);

    const [dragging, setDragging] = useState(false);
    const [lastX, setLastX] = useState<number | null>(null);

    const globalKTX2 = useMemo(() => {
        const loader = new KTX2Loader().setTranscoderPath(
            'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/'
        );
        loader.detectSupport(gl);
        return loader;
    }, [gl]);

    const { scene: rawScene } = useGLTF(
        url,
        true,
        undefined,
        loader => loader.setKTX2Loader(globalKTX2)
    );

    const centeredScene = useMemo<THREE.Group | null>(() => {
        if (!rawScene) return null;
        const clone = rawScene.clone(true) as THREE.Group;
        const box = new THREE.Box3().setFromObject(clone);
        const center = new THREE.Vector3();
        box.getCenter(center);
        clone.position.sub(center);
        return clone;
    }, [rawScene]);

    const loadedOnce = useRef(false);
    useEffect(() => {
        if (centeredScene && !loadedOnce.current) {
            loadedOnce.current = true;
            onLoaded?.();
        }
        if (!centeredScene) onError?.();
    }, [centeredScene, onLoaded, onError]);

    useFrame((_, delta) => {
        if (groupRef.current) {
            // Применяем скорость к вращению
            groupRef.current.rotation.y += rotationSpeed.current * delta * 30;

            // Плавное замедление (damping)
            rotationSpeed.current *= 0.9;
            if (Math.abs(rotationSpeed.current) < 0.0001) {
                rotationSpeed.current = 0;
            }
        }

        // Эффект пульсации при выделении
        if (animating.current && activeRef.current) {
            const t = (Date.now() % 1000) / 1000;
            const intensity = 0.1 + 0.1 * Math.sin(t * Math.PI * 2);
            activeRef.current.children.forEach(child => {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mat) mat.emissiveIntensity = intensity;
            });
        }
    });

    const onPointerDown = (e: ThreeEvent<PointerEvent>) => {

        setDragging(true);
        setLastX(e.clientX);
        const target = e.target as HTMLElement;
        target.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (!dragging || lastX === null) return;

        const dx = (e.clientX - lastX);
        rotationSpeed.current = dx * 0.005; // чувствительность ниже — плавнее
        setLastX(e.clientX);
    };

    const onPointerUp = (e: ThreeEvent<PointerEvent>) => {

        setDragging(false);
        setLastX(null);
        const target = e.target as HTMLElement;
        target.releasePointerCapture?.(e.pointerId);
    };

    const onClick = (e: ThreeEvent<PointerEvent>) => {

        if (!groupRef.current) return;

        const rect = gl.domElement.getBoundingClientRect();
        mouse.current.set(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(mouse.current, camera);

        const hits = raycaster.intersectObject(groupRef.current, true);
        if (hits.length === 0) {
            if (activeRef.current) {
                activeRef.current.children.forEach(child => {
                    const orig = originalMaterials.current.get(child.uuid);
                    if (orig) (child as THREE.Mesh).material = orig;
                    const mt = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                    if (mt) mt.emissiveIntensity = 0;
                });
            }
            activeRef.current = null;
            animating.current = false;
            onFloorChange?.(null); // сброс
            return;
        }

        let obj: THREE.Object3D = hits[0].object;
        while (obj.parent && !(obj.parent instanceof THREE.Group)) {
            obj = obj.parent;
        }
        const floorGrp = obj.parent as THREE.Group;

        const name = floorGrp.name; // e.g., "AFloor3"
        if (!/^[A-Z]Floor\d+$/.test(name)) return;

        // подсветка
        if (activeRef.current) {
            activeRef.current.children.forEach(child => {
                const orig = originalMaterials.current.get(child.uuid);
                if (orig) (child as THREE.Mesh).material = orig;
                const mt = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mt) mt.emissiveIntensity = 0;
            });
        }

        floorGrp.children.forEach(child => {
            if ((child as THREE.Mesh).material) {
                const mesh = child as THREE.Mesh;
                const material = mesh.material;
                if (!originalMaterials.current.has(mesh.uuid) && !Array.isArray(material)) {
                    originalMaterials.current.set(mesh.uuid, material.clone());
                }
                mesh.material = originalMaterials.current.get(mesh.uuid)!;
                const mt = mesh.material as THREE.MeshStandardMaterial;
                mt.emissive = new THREE.Color('red');
                mt.emissiveIntensity = 1;
            }
        });

        activeRef.current = floorGrp;
        animating.current = true;

        const match = name.match(/^([A-Z])Floor(\d+)$/);
        if (match) {
            const parsed = {
                block: match[1],
                floor: match[2],
            };
            onFloorChange?.(parsed); // ✅ передаём правильный объект
        } else {
            onFloorChange?.(null);
        }
    };

    if (!centeredScene) return null;

    return (
        <group
            ref={groupRef}
            onClick={onClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
        >
            <primitive object={centeredScene} />
        </group>
    );
}
