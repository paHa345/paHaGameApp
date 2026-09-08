import { useFBX, useGLTF, useTexture } from "@react-three/drei";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

const RightHandWeapon = () => {
  //   const { scene: axeScene } = useGLTF("./models/SurvivalKit/tool-axe-upgraded.glb", true);
  const model = useGLTF("./models/Swords/sword_23.glb");

  const [colorMap] = useTexture(["./models/Swords/Texture_MAp_sword.png"]);
  const meshRef = useRef<THREE.Mesh>(null);
  const mesh = model.scene.clone();
  const material = new THREE.MeshStandardMaterial({
    map: colorMap,
  });

  //   const cloneAxe = useMemo(() => axeScene.clone(), [axeScene]);

  return (
    <primitive
      ref={meshRef}
      object={mesh}
      //   scale={0.05}
      scale-x={2}
      scale-y={1.5}
      scale-z={2}
      position={[-0.2, -1, -0.3]}
      rotation-x={Math.PI / 2}
      rotation-y={Math.PI / 2}
      material={material}
    ></primitive>
  );
};

export default RightHandWeapon;
