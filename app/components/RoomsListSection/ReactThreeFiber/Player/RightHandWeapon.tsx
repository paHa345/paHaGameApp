import { useFBX, useGLTF, useTexture } from "@react-three/drei";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

const RightHandWeapon = () => {
  //   const { scene: axeScene } = useGLTF("./models/SurvivalKit/tool-axe-upgraded.glb", true);
  const model = useFBX("./models/Swords/sword_24.fbx");

  const [colorMap] = useTexture(["./models/Swords/Texture_MAp_sword.png"]);
  const meshRef = useRef<THREE.Mesh>(null);
  const mesh = model.children[0].clone() as THREE.Mesh;

  console.log(model);

  colorMap.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshStandardMaterial({
    map: colorMap,
  });

  //   const cloneAxe = useMemo(() => axeScene.clone(), [axeScene]);

  return (
    <primitive
      ref={meshRef}
      object={mesh}
      //   scale={0.05}
      scale-x={0.02}
      scale-y={0.02}
      scale-z={0.05}
      position={[-0.2, -1, -0.3]}
      rotation-x={Math.PI / 2}
      rotation-y={Math.PI / 2}
      material={material}
    ></primitive>
  );
};

export default RightHandWeapon;
