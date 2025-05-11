import type { BoxHelper } from 'three/webgpu';
import { Scene, Camera } from 'three/webgpu';
import { WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { useEffect } from 'react';

const useAnimate = (
  renderer: React.RefObject<WebGLRenderer | null>,
  scene: React.RefObject<Scene | null>,
  camera: React.RefObject<Camera | null>,
  orbitControls: React.RefObject<OrbitControls | null>,
  highlightBox: React.RefObject<BoxHelper | null>
) => {
  function loop() {
    requestAnimationFrame(loop);
    highlightBox?.current?.update();
    orbitControls?.current?.update();
    if (scene.current && camera.current)
      renderer?.current?.render(scene.current, camera.current);
  }
  useEffect(() => {
    loop();
  }, [loop]);
};

export default useAnimate;
