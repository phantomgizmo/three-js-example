export function animate(renderer, scene, camera, orbitControls, appState) {
  function loop() {
    requestAnimationFrame(loop);
    appState.highlightBox?.update();
    orbitControls.update();
    renderer.render(scene, camera);
  }
  loop();
}
