import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { WebGLRenderer, Scene, Camera } from 'three';

export function useScene(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const rendererRef = useRef<WebGLRenderer>(null);
  const sceneRef = useRef<Scene>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    if (canvasRef?.current && !rendererRef.current) {
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current = renderer;
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
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(pos.x, pos.y, pos.z);
        light.castShadow = true;
        scene.add(light);
      });

      // Ambient light: soft, even light from all directions
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

      // Add Hempisphere light
      const hempisphereLight = new THREE.HemisphereLight(
        0xffffff,
        0x888888,
        0.5
      );

      // Add Directional Light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(3, 5, 2);

      scene.add(ambientLight, hempisphereLight, directionalLight);
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

    // return () => {
    //   rendererRef.current?.dispose();
    //   rendererRef.current = null;
    // };
  }, [canvasRef]);

  return { sceneRef, cameraRef, rendererRef };
}
