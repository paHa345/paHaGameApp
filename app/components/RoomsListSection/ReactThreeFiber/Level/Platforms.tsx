import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import React from "react";

const Platforms = () => {
  const platform = useGLTF("./models/PlatformerKit/block-grass-large-slope-narrow.glb");
  const barrel = useGLTF("./models/PlatformerKit/barrel.glb");
  return (
    <>
      <RigidBody
        type="fixed"
        colliders="hull"
        position={[30, -0.5, 18]}
        restitution={0.2}
        friction={0}
      >
        <primitive object={platform.scene} scale={2}>
          {/* <meshBasicMaterial map={forestTexture} /> */}
        </primitive>
      </RigidBody>

      <RigidBody
        type="dynamic"
        colliders="hull"
        position={[35, 1, 33]}
        restitution={0.2}
        friction={0}
      >
        <primitive object={barrel.scene} scale={2}>
          {/* <meshBasicMaterial map={forestTexture} /> */}
        </primitive>
      </RigidBody>
    </>
  );
};

export default Platforms;
