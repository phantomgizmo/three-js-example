import "./style.css";
import { initScene } from "./sceneSetup";
import { setupControls } from "./controls";
import { setupLoader } from "./loader";
import { setupInteraction } from "./interaction";
import { animate } from "./animate";

const { scene, camera, renderer, objects } = initScene();
const { orbitControls, transformControls } = setupControls(
  camera,
  renderer,
  scene
);
setupLoader(scene, transformControls, objects);
setupInteraction(camera, renderer, scene, objects, transformControls);
animate(renderer, scene, camera, orbitControls);
