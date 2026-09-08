import { useGLTF, useTexture } from "@react-three/drei";
import React, { useMemo } from "react";
import * as THREE from "three";

const RightHandWeapon = () => {
  const { scene: axeScene } = useGLTF("./models/Hammers/hammer_13.glb", true);
  const cloneAxe = useMemo(() => axeScene.clone(), [axeScene]);
  const [colorMap] = useTexture(["./models/Hammers/Texture_MAp_axHammers.png"]);

  const material = new THREE.MeshStandardMaterial({
    map: colorMap,
  });

  return (
    <primitive
      object={cloneAxe}
      material={material}
      scale={2}
      position={[-0.2, -1, 0]}
      rotation-x={Math.PI / 2}
      rotation-y={Math.PI / 2}
      dispose={null}
    >
      {" "}
    </primitive>
  );
};

export default RightHandWeapon;
