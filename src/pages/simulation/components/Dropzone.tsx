import type { Scene, Object3D } from 'three';

import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const Dropzone = ({
  scene,
  objects
}: {
  scene: React.RefObject<Scene | null>;
  objects: { [id: string]: Object3D };
}) => {
  const onDropHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer?.files[0];
    if (file && file.name.endsWith('.glb')) {
      const url = URL.createObjectURL(file);
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        const model = gltf.scene;
        objects[model.id] = model;
        scene?.current?.add(model);
        model.castShadow = true;
        URL.revokeObjectURL(url);
      });
    }
  };

  return (
    <div
      id="dropzone"
      className="absolute top-0 left-0 z-1000 box-border border-2 border-dashed bg-transparent p-8 text-white hover:border-green-400"
      onDrop={(e) => onDropHandler(e)}
      onDragOver={(e) => e.preventDefault()}
    >
      Drop your .glb here
    </div>
  );
};

export default Dropzone;
