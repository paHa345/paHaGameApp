import { useGLTF } from "@react-three/drei";
import React, { useMemo } from "react";

const RightHandWeapon = () => {
  const { scene: axeScene } = useGLTF("./models/SurvivalKit/tool-axe-upgraded.glb", true);

  const cloneAxe = useMemo(() => axeScene.clone(), [axeScene]);

  return (
    <primitive
      object={cloneAxe}
      scale={4}
      position={[-0.2, -1, 0]}
      rotation-x={Math.PI / 2}
      rotation-y={Math.PI / 2}
    ></primitive>
  );
};

export default RightHandWeapon;
