import { useRef, useEffect } from 'react';

import * as THREE from 'three';

// import { useControls } from '@/hooks/useControls';
// import { useScene } from '@/hooks/useScene';

// import useAnimate from './hooks/useAnimate';
import { Object3D, Scene, Camera, WebGLRenderer, BoxHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import { getModelByFilename } from '@/services/supabase/3dmodels';

const Simulation = () => {
  const canvasContainerRef = useRef<HTMLCanvasElement>(null);
  const objectsRef = useRef<{ [id: string]: Object3D }>({});
  // const { sceneRef, cameraRef, rendererRef } = useScene(canvasRef);

  const rendererRef = useRef<WebGLRenderer>(null);
  const sceneRef = useRef<Scene>(null);
  const cameraRef = useRef<Camera>(null);

  const highlightBoxRef = useRef<BoxHelper>(null);
  const selectedObjectId = useRef<string>('');
  const transformControls = useRef<TransformControls>(null);
  const orbitControlsRef = useRef<OrbitControls>(null);

  useEffect(() => {
    const objects = objectsRef.current;
    const canvasContainer = canvasContainerRef.current;

    if (canvasContainerRef?.current && !rendererRef.current) {
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current = renderer;
      canvasContainerRef.current.appendChild(rendererRef.current.domElement);
    }

    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      sceneRef.current = scene;
    }

    if (sceneRef.current) {
      const scene = sceneRef.current;

      const room = new THREE.Mesh(
        new THREE.BoxGeometry(20, 10, 20),
        new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide })
      );
      scene.add(room);

      const grid = new THREE.GridHelper(20, 20, 0xaaaaaa, 0xdddddd);
      grid.position.y = -5;
      scene.add(grid);

      const light_positions = [
        { x: 0, y: 5, z: 5 },
        { x: 0, y: 5, z: -5 },
        { x: 5, y: 5, z: 0 },
        { x: -5, y: 5, z: 0 },
        { x: -5, y: 0, z: 5 },
        { x: -5, y: 0, z: -5 },
        { x: 5, y: 0, z: 5 },
        { x: 5, y: 0, z: -5 }
      ];

      light_positions.map((pos) => {
        const light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(pos.x, pos.y, pos.z);
        light.castShadow = true;
        scene.add(light);
      });

      // Ambient light: soft, even light from all directions
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);

      // Add Hempisphere light
      const hempisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 1);

      scene.add(ambientLight, hempisphereLight);

      // Load car
      getModelByFilename('pickup_car.glb')
        .then((objBlob) => {
          if (objBlob) {
            const url = URL.createObjectURL(objBlob);
            const loader = new GLTFLoader();
            loader.load(url, (gltf) => {
              const model = gltf.scene;
              objects[model.id] = model;
              model.position.y = -2.5;
              scene.add(model);
              model.castShadow = true;
              URL.revokeObjectURL(url);
            });
          }
        })
        .catch((err) => console.log(err));
    }

    if (!cameraRef.current) {
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 2, 5);

      cameraRef.current = camera;
    }

    if (cameraRef?.current && rendererRef?.current) {
      const orbitControls = new OrbitControls(
        cameraRef.current,
        rendererRef.current.domElement
      );
      orbitControls.enableDamping = true;
      orbitControls.dampingFactor = 0.05;

      orbitControlsRef.current = orbitControls;

      transformControls.current = new TransformControls(
        cameraRef.current,
        rendererRef.current.domElement
      );
      transformControls.current.addEventListener('dragging-changed', (e) => {
        orbitControls.enabled = !e.value;
      });

      sceneRef?.current?.add(transformControls.current.getHelper());
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 't') transformControls.current?.setMode('translate');
      if (e.key === 'r') transformControls.current?.setMode('rotate');
      if (e.key === 's') transformControls.current?.setMode('scale');
      if (e.key === 'g') {
        transformControls.current?.detach();
        selectedObjectId.current = '';
        if (highlightBoxRef.current) {
          sceneRef?.current?.remove(highlightBoxRef.current);
        }
        highlightBoxRef.current = null;
      }
      if (e.key == 'Delete') {
        transformControls.current?.detach();
        if (highlightBoxRef.current)
          sceneRef?.current?.remove(highlightBoxRef.current);
        if (selectedObjectId.current) {
          sceneRef?.current?.remove(
            objectsRef.current[selectedObjectId.current]
          );
          delete objectsRef.current[selectedObjectId.current];
        }
        selectedObjectId.current = '';
        highlightBoxRef.current = null;
      }
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    canvasContainerRef.current?.addEventListener('click', (event) => {
      if (!event.ctrlKey) return;

      if (!sceneRef.current) return;

      if (!transformControls.current) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      if (cameraRef.current) raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(
        Object.values(objectsRef.current),
        true
      );

      if (intersects.length > 0) {
        const object = intersects[0].object;
        let parent = object;
        while (
          parent.parent &&
          !Object.values(objectsRef.current).includes(parent)
        ) {
          parent = parent.parent;
        }

        if (objectsRef.current[selectedObjectId.current] === parent) return;

        transformControls.current?.attach(parent);
        selectedObjectId.current = parent.uuid;

        // Remove current highlighBox
        if (highlightBoxRef.current)
          sceneRef.current.remove(highlightBoxRef.current);

        // Create new highlightBox for selected object
        highlightBoxRef.current = new THREE.BoxHelper(parent, 0xffcc00);
        if (highlightBoxRef.current)
          sceneRef.current.add(highlightBoxRef.current);
      }
    });

    const loop = () => {
      requestAnimationFrame(loop);
      highlightBoxRef?.current?.update();
      orbitControlsRef?.current?.update();
      if (sceneRef.current && cameraRef.current)
        rendererRef?.current?.render(sceneRef.current, cameraRef.current);
    };

    loop();

    return () => {
      Object.values(objects).map((object) => {
        sceneRef.current?.remove(object);
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh === true) {
            const mesh = child as THREE.Mesh;

            if (mesh.geometry) mesh.geometry.dispose();

            const materials = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material];
            materials.map((material) => {
              material.dispose();
            });
          }
          if (child.parent) child.parent.remove(child);
        });
      });
      objectsRef.current = {};
      sceneRef.current = null;
      rendererRef.current?.dispose();
      rendererRef.current = null;
      const canvasList = canvasContainer?.getElementsByTagName('canvas');
      if (canvasList) canvasList[0].remove();
    };
  }, [canvasContainerRef]);

  return <section id="canvasContainer" ref={canvasContainerRef}></section>;
};

export default Simulation;
