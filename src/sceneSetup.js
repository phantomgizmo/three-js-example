import * as THREE from "three";

export function initScene() {
  const scene = new THREE.Scene();

  const room = new THREE.Mesh(
    new THREE.BoxGeometry(20, 10, 20),
    new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide })
  );
  scene.add(room);

  const grid = new THREE.GridHelper(20, 20, 0xaaaaaa, 0xdddddd);
  grid.position.y = -5;
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

  const light_positions = [
    { x: 0, y: 5, z: 5 },
    { x: 0, y: 5, z: -5 },
    { x: 5, y: 5, z: 0 },
    { x: -5, y: 5, z: 0 },
    { x: -5, y: 0, z: 5 },
    { x: -5, y: 0, z: -5 },
    { x: 5, y: 0, z: 5 },
    { x: 5, y: 0, z: -5 },
  ];

  light_positions.map((pos) => {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(pos.x, pos.y, pos.z);
    scene.add(light);
  });

  // Ambient light: soft, even light from all directions
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  scene.add(
    new THREE.AmbientLight(0xffffff, 0.3),
    new THREE.HemisphereLight(0xffffff, 0x888888, 0.5),
    new THREE.DirectionalLight(0xffffff, 1).position.set(3, 5, 2)
  );

  const objects = [];

  return { scene, camera, renderer, objects };
}
