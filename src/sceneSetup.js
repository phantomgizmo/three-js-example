import * as THREE from "three";

export function initScene() {
  const scene = new THREE.Scene();

  const room = new THREE.Mesh(
    new THREE.BoxGeometry(20, 10, 20),
    new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide })
  );
  scene.add(room);

  const grid = new THREE.GridHelper(20, 20, 0xaaaaaa, 0xdddddd);
  grid.position.y = -1;
  scene.add(grid);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 5, 5);
  scene.add(light);

  const objects = [];

  return { scene, camera, renderer, objects };
}
