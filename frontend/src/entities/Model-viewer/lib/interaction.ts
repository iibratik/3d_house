import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const originalMaterials = new Map<THREE.Object3D, THREE.Material | THREE.Material[]>();

let activeFloor: THREE.Object3D | null = null;
let animating = false;

/**
 * Настраивает взаимодействие и возвращает колбэк, который даст имя этажа при клике
 */
export function setupInteraction(
  container: HTMLElement,
  renderer: THREE.WebGLRenderer,
  camera: THREE.Camera,
  floorGroups: THREE.Object3D[],
  onFloorSelect: (floorName: string | null) => void
): void {
  container.addEventListener('click', (event: MouseEvent) =>
    onModelClick(event, renderer, camera, floorGroups, onFloorSelect)
  );
}

function onModelClick(
  event: MouseEvent,
  renderer: THREE.WebGLRenderer,
  camera: THREE.Camera,
  floorGroups: THREE.Object3D[],
  onFloorSelect: (floorName: string | null) => void
): void {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(floorGroups, true);

  if (intersects.length > 0) {
    const clickedFloor = getParentFloor(intersects[0].object, floorGroups);
    if (!clickedFloor) {
      onFloorSelect(null);
      return;
    }

    animating = false;
    resetMaterials(floorGroups);
    highlightFloor(clickedFloor);

    onFloorSelect(clickedFloor.name); // передаем название этажа
    document.getElementById('lists')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    activeFloor = clickedFloor;
    animating = true;
    animateGlow(clickedFloor);
  } else {
    onFloorSelect(null); // клик мимо
  }
}

export function getParentFloor(
  object: THREE.Object3D,
  floorGroups: THREE.Object3D[]
): THREE.Object3D | null {
  while (object && !floorGroups.includes(object)) {
    object = object.parent as THREE.Object3D;
  }
  return object ?? null;
}

export function resetMaterials(floorGroups: THREE.Object3D[]): void {
  floorGroups.forEach((group) => {
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && originalMaterials.has(child)) {
        const mesh = child as THREE.Mesh;
        const original = originalMaterials.get(child);

        if (original) {
          mesh.material = original;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => {
              if ('emissive' in m && m.emissive instanceof THREE.Color) m.emissive.set(0x000000);
              if ('emissiveIntensity' in m) m.emissiveIntensity = 0;
            });
          } else {
            if ('emissive' in mesh.material && mesh.material.emissive instanceof THREE.Color)
              mesh.material.emissive.set(0x000000);
            if ('emissiveIntensity' in mesh.material)
              mesh.material.emissiveIntensity = 0;
          }
        }
      }
    });
  });

  originalMaterials.clear();
}

export function highlightFloor(floor: THREE.Object3D): void {
  floor.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const material = mesh.material;

      if (!originalMaterials.has(mesh)) {
        if (Array.isArray(material)) {
          originalMaterials.set(mesh, material.map((m) => m.clone()));
        } else {
          originalMaterials.set(mesh, material.clone());
        }
      }

      if (Array.isArray(material)) {
        material.forEach((m) => {
          const mat = m as THREE.MeshStandardMaterial;
          if (mat.emissive instanceof THREE.Color) mat.emissive.set(0xff0000);
        });
      } else {
        const mat = material as THREE.MeshStandardMaterial;
        if (mat.emissive instanceof THREE.Color) mat.emissive.set(0xff0000);
      }
    }
  });
}

export function animateGlow(floor: THREE.Object3D): void {
  if (!floor) return;
  let intensity = 0;
  let direction = 1;

  function update(): void {
    if (!animating || activeFloor !== floor) return;

    intensity += direction * 0.05;
    if (intensity >= 1.5) direction = -1;
    if (intensity <= 0) direction = 1;

    floor.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => {
            if ('emissiveIntensity' in m) m.emissiveIntensity = intensity;
          });
        } else {
          if ('emissiveIntensity' in mat) mat.emissiveIntensity = intensity;
        }
      }
    });

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}
