export function animate(renderer, scene, camera, orbitControls) {
  function loop() {
    requestAnimationFrame(loop);
    orbitControls.update();
    renderer.render(scene, camera);
  }
  loop();
}
