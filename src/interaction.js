import * as THREE from "three";

export function setupInteraction(
  camera,
  renderer,
  scene,
  objects,
  transformControls
) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      let parent = object;
      while (parent.parent && !objects.includes(parent)) {
        parent = parent.parent;
      }
      transformControls.attach(parent);
    }
  });
}
