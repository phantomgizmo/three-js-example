import { useRef } from 'react';

import * as THREE from 'three';
import { Object3D, Camera, Scene, WebGLRenderer, BoxHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

export function useControls(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  camera: React.RefObject<Camera | null>,
  renderer: React.RefObject<WebGLRenderer | null>,
  scene: React.RefObject<Scene | null>,
  objects: React.RefObject<{ [id: string]: Object3D }>
) {
  const highlightBoxRef = useRef<BoxHelper>(null);
  const selectedObjectId = useRef<string>('');
  const transformControls = useRef<TransformControls>(null);
  const orbitControlsRef = useRef<OrbitControls>(null);

  if (camera?.current && renderer?.current) {
    const orbitControls = new OrbitControls(
      camera.current,
      renderer.current.domElement
    );
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;

    orbitControlsRef.current = orbitControls;

    transformControls.current = new TransformControls(
      camera.current,
      renderer.current.domElement
    );
    transformControls.current.addEventListener('dragging-changed', (e) => {
      orbitControls.enabled = !e.value;
    });

    scene?.current?.add(transformControls.current.getHelper());
  }

  canvasRef?.current?.addEventListener('keydown', (e) => {
    if (e.key === 't') transformControls.current?.setMode('translate');
    if (e.key === 'r') transformControls.current?.setMode('rotate');
    if (e.key === 's') transformControls.current?.setMode('scale');
    if (e.key === 'g') {
      transformControls.current?.detach();
      selectedObjectId.current = '';
      if (highlightBoxRef.current) {
        scene?.current?.remove(highlightBoxRef.current);
      }
      highlightBoxRef.current = null;
    }
    if (e.key == 'Delete') {
      transformControls.current?.detach();
      if (highlightBoxRef.current)
        scene?.current?.remove(highlightBoxRef.current);
      if (selectedObjectId.current) {
        scene?.current?.remove(objects.current[selectedObjectId.current]);
        delete objects.current[selectedObjectId.current];
      }
      selectedObjectId.current = '';
      highlightBoxRef.current = null;
    }
  });

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  canvasRef?.current?.addEventListener('click', (event) => {
    if (!event.ctrlKey) return;

    if (!scene.current) return;

    if (!transformControls.current) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (camera.current) raycaster.setFromCamera(mouse, camera.current);
    const intersects = raycaster.intersectObjects(Object.values(objects), true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      let parent = object;
      while (parent.parent && !Object.values(objects).includes(parent)) {
        parent = parent.parent;
      }

      if (objects.current[selectedObjectId.current] === parent) return;

      transformControls.current?.attach(parent);
      selectedObjectId.current = parent.uuid;

      // Remove current highlighBox
      if (highlightBoxRef.current)
        scene.current.remove(highlightBoxRef.current);

      // Create new highlightBox for selected object
      highlightBoxRef.current = new THREE.BoxHelper(parent, 0xffcc00);
      if (highlightBoxRef.current) scene.current.add(highlightBoxRef.current);
    }
  });

  return { orbitControlsRef, transformControls, highlightBoxRef };
}
