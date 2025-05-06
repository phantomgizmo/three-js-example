import * as THREE from "three";

export function setupInteraction(
  camera,
  renderer,
  scene,
  objects,
  transformControls,
  appState
) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener("click", (event) => {
    if (!event.ctrlKey) return;

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

      if (appState.selectedObject === parent) return;

      transformControls.attach(parent);
      appState.selectedObject = parent;

      // Remove current highlighBox
      scene.remove(appState.highlightBox);

      // Create new highlightBox for selected object
      appState.highlightBox = new THREE.BoxHelper(parent, 0xffff00);
      scene.add(appState.highlightBox);
    }
  });
}
