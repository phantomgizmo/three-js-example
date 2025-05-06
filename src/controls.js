import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

export function setupControls(camera, renderer, scene, appState) {
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.05;

  const transformControls = new TransformControls(camera, renderer.domElement);
  transformControls.addEventListener("dragging-changed", (e) => {
    orbitControls.enabled = !e.value;
  });
  scene.add(transformControls);

  window.addEventListener("keydown", (e) => {
    if (e.key === "t") transformControls.setMode("translate");
    if (e.key === "r") transformControls.setMode("rotate");
    if (e.key === "s") transformControls.setMode("scale");
    if (e.key === "g") {
      transformControls.detach();
      appState.selectedObject = null;
      if (appState.highlightBox) {
        scene.remove(appState.highlightBox);
      }
      appState.highlightBox = null;
    }
  });

  return { orbitControls, transformControls };
}
