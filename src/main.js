import "./style.css";
import { initScene } from "./sceneSetup";
import { setupControls } from "./controls";
import { setupLoader } from "./loader";
import { setupInteraction } from "./interaction";
import { animate } from "./animate";

const appState = {
  highlightBox: null,
  selectedObjectMaterials: [],
  selectedObject: null,
};
const { scene, camera, renderer, objects } = initScene();
const { orbitControls, transformControls } = setupControls(
  camera,
  renderer,
  scene,
  appState
);
setupLoader(scene, transformControls, objects, appState);
setupInteraction(camera, renderer, scene, objects, transformControls, appState);
animate(renderer, scene, camera, orbitControls, appState);
