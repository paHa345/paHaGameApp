import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { useGLTF, useTexture } from "@react-three/drei";
import React, { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";

// const RightHandWeapon = () => {
//   //   const { scene: axeScene } = useGLTF("./models/SurvivalKit/tool-axe-upgraded.glb", true);

//   const swordModelName = useSelector(
//     (state: IReactThreeFiberGameSlice) =>
//       state.ReactThreeFiberGameState.playerItems.equipment.weapon.modelName,
//   );
//   const model = useGLTF(`./models/Swords/${swordModelName}.glb`);

//   const [colorMap] = useTexture(["./models/Swords/Texture_MAp_sword.png"]);
//   const meshRef = useRef<THREE.Mesh>(null);
//   const mesh = model.scene.clone();
//   const material = new THREE.MeshStandardMaterial({
//     map: colorMap,
//   });

//   //   const cloneAxe = useMemo(() => axeScene.clone(), [axeScene]);

//   return (
//     <primitive
//       ref={meshRef}
//       object={mesh}
//       //   scale={0.05}
//       scale-x={2}
//       scale-y={1.5}
//       scale-z={2}
//       position={[-0.2, -1, -0.3]}
//       rotation-x={Math.PI / 2}
//       rotation-y={Math.PI / 2}
//       material={material}
//     ></primitive>
//   );
// };

// export default RightHandWeapon;

const RightHandWeapon = () => {
  const swordModelName = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.playerItems.equipment.weapon.modelName,
  );

  // Хуки вызваны безусловно, а сама загрузка — только когда есть имя
  if (!swordModelName) return null;

  return <RightHandWeaponModel key={swordModelName} modelName={swordModelName} />;
};

type WeaponModelProps = { modelName: string };

const RightHandWeaponModel = ({ modelName }: WeaponModelProps) => {
  const { scene } = useGLTF(`./models/Swords/${modelName}.glb`);
  const colorMap = useTexture("./models/Swords/Texture_MAp_sword.png");

  // Клонируем сцену один раз, а не каждый рендер
  const mesh = useMemo(() => scene.clone(), [scene]);

  // Материал создаём один раз
  const material = useMemo(() => new THREE.MeshStandardMaterial({ map: colorMap }), [colorMap]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <primitive
      object={mesh}
      scale-x={2}
      scale-y={1.5}
      scale-z={2}
      position={[-0.2, -1, -0.3]}
      rotation-x={Math.PI / 2}
      rotation-y={Math.PI / 2}
      material={material}
    />
  );
};

export default RightHandWeapon;
