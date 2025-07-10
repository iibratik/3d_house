// components/ModelViewerController.tsx
'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { KTX2Loader } from 'three-stdlib';

interface Props {
    url: string;
    onError?: () => void;
    onLoaded?: () => void;
    /** новый проп */
    onFloorChange?: (floorName: string | null) => void;
}

export function ModelViewerController({
    url,
    onError,
    onLoaded,
    onFloorChange,
}: Props) {
    const groupRef = useRef<THREE.Group>(null);
    const { gl, camera } = useThree();

    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    const mouse = useRef(new THREE.Vector2());

    const activeRef = useRef<THREE.Group | null>(null);
    const originalMaterials = useRef<Map<string, THREE.Material>>(new Map());
    const animating = useRef(false);

    const [targetY, setTargetY] = useState(0);
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

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                targetY,
                0.1
            );
        }
        if (animating.current && activeRef.current) {
            const t = (Date.now() % 1000) / 1000;
            const intensity = 0.5 + 0.5 * Math.sin(t * Math.PI * 2);
            activeRef.current.children.forEach(child => {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mat) mat.emissiveIntensity = intensity;
            });
        }
    });

    const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setDragging(true);
        setLastX(e.clientX);
        e.target.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (!dragging || lastX === null) return;
        e.stopPropagation();
        const dx = (e.clientX - lastX) / 200;
        setTargetY(prev => prev + dx);
        setLastX(e.clientX);
    };
    const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setDragging(false);
        setLastX(null);
        e.target.releasePointerCapture(e.pointerId);
    };

    const onClick = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (!groupRef.current) return;

        const rect = gl.domElement.getBoundingClientRect();
        mouse.current.set(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(mouse.current, camera);

        const hits = raycaster.intersectObject(groupRef.current, true);
        if (hits.length === 0) {
            // Сброс
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
            onFloorChange?.(null);
            return;
        }

        let obj: THREE.Object3D = hits[0].object;
        while (obj.parent && !(obj.parent instanceof THREE.Group)) {
            obj = obj.parent;
        }
        const floorGrp = obj.parent as THREE.Group;

        if (!/^[A-Z]Floor\d+$/.test(floorGrp.name)) {
            // не наш формат
            return;
        }

        // Сброс предыдущей подсветки
        if (activeRef.current) {
            activeRef.current.children.forEach(child => {
                const orig = originalMaterials.current.get(child.uuid);
                if (orig) (child as THREE.Mesh).material = orig;
                const mt = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mt) mt.emissiveIntensity = 0;
            });
        }

        // Подсветка нового
        floorGrp.children.forEach(child => {
            if ((child as THREE.Mesh).material) {
                const mesh = child as THREE.Mesh;
                if (!originalMaterials.current.has(mesh.uuid)) {
                    originalMaterials.current.set(mesh.uuid, mesh.material.clone());
                }
                mesh.material = originalMaterials.current.get(mesh.uuid)!;
                const mt = mesh.material as THREE.MeshStandardMaterial;
                mt.emissive = new THREE.Color('red');
                mt.emissiveIntensity = 1;
            }
        });

        activeRef.current = floorGrp;
        animating.current = true;

        onFloorChange?.(floorGrp.name);
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
