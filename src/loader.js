import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export function setupLoader(scene, transformControls, objects, appState) {
  const dropzone = document.getElementById("dropzone");

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#0f0";
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#fff";

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".glb")) {
      const url = URL.createObjectURL(file);
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        const model = gltf.scene;
        objects.push(model);
        scene.add(model);
        if (appState.highlightBox) scene.remove(appState.highlightBox);
        appState.highlightBox = new THREE.BoxHelper(model, 0xffcc00);
        appState.selectedObject = model;
        scene.add(appState.highlightBox);
        model.castShadow = true;
        transformControls.attach(model);
        URL.revokeObjectURL(url);
      });
    }
  });
}
