import { RigidBody } from "@react-three/rapier";
import React, { useMemo } from "react";
import * as THREE from "three";

interface ITree {
  id: string;
  position: THREE.Vector3;
  scene: THREE.Group<THREE.Object3DEventMap>;
  nodes: {
    [name: string]: THREE.Object3D<THREE.Object3DEventMap>;
  };
}

const Tree = ({ id, position, scene, nodes }: ITree) => {
  for (const name in nodes) {
    nodes[name].castShadow = true;
  }

  const cloneModel = useMemo(() => scene.clone(), [scene]);
  return (
    <>
      <RigidBody type="fixed" colliders="hull" position={position} restitution={0.2} friction={0}>
        <primitive object={cloneModel} scale={2} castShadow>
          {/* <meshBasicMaterial map={forestTexture} /> */}
        </primitive>
      </RigidBody>
    </>
  );
};

export default Tree;
