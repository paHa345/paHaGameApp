import * as THREE from "three";

import React, { useEffect, useRef, useState } from "react";
import {
  CapsuleCollider,
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import { useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useControls } from "leva";
import { useFrame, useThree } from "@react-three/fiber";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import AncientOrc from "../AncientOrcEnemy/AncientOrcEnemy";
import { conditionPatternStatus } from "@/app/types";
import MainTreesComponent from "./MainTreesComponent";
import MainTreeLog from "./MainTreeLog";
import NPCMain from "./NPCMain";
import MainDesertMountainsComponent from "./MainDesertMountainsComponent";
import Platforms from "./Platforms";
import Houses from "./Houses";
import SparksMain from "../Effects/Sparks/SparksMain";
import BarrelsMain from "./Barrels/BarrelsMain";
import StartGameMenuMain from "../Interface/StartGameMenu/StartGameMenuMain";
import Bounds from "./Bounds";
import Grass from "./Grass";

// const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
// const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
// const obstacMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
// const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

export function Trees() {
  const treeHigh = useGLTF("./models/MiniForest/tree-high.glb");
  const patchGrass = useGLTF("./models/MiniForest/patch-grass.glb");
  const rocksHigh = useGLTF("./models/MiniForest/rocks-high.glb");

  treeHigh.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });

  rocksHigh.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });

  return (
    <>
      <mesh position={[0, -0.1, -1.2]}>
        <primitive object={patchGrass.scene} scale={3} receiveShadow></primitive>
      </mesh>
      <RigidBody
        type="fixed"
        colliders="hull"
        position={[0, 0.01, -1.2]}
        restitution={0.2}
        friction={0}
      >
        <primitive object={treeHigh.scene} scale={3} castShadow>
          {/* <meshBasicMaterial map={forestTexture} /> */}
        </primitive>
      </RigidBody>

      <RigidBody type="fixed" colliders="hull" position={[5, 1, 0]} restitution={0.2} friction={0}>
        <primitive object={rocksHigh.scene} scale={2} castShadow>
          {/* <meshBasicMaterial map={forestTexture} /> */}
        </primitive>
      </RigidBody>
    </>
  );
}

// export function Enemyes() {
//   const zombie1Ref = useRef<RapierRigidBody>(null);
//   // const [zombie1RotateTimer, setZombie1RotateTimer] = useState(0);
//   const [isRotating, setIsRotating] = useState(false);

//   const dispatch = useDispatch<AppDispatch>();

//   const zombie1RotateTimer = useSelector(
//     (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.rotateZombieTimer,
//   );

//   const currentQuat = new THREE.Quaternion();
//   const startQuat = new THREE.Quaternion();
//   const data = useThree();

//   const zombie = useGLTF("./models/characters/2/character-o.glb", true);
//   zombie.nodes.torso.castShadow = true;
//   for (const name in zombie.nodes) {
//     zombie.nodes[name].castShadow = true;
//   }
//   const sceneClone = zombie.scene.clone();

//   const currentModelAnimations = useAnimations(zombie.animations, zombie.scene);
//   currentModelAnimations.actions["walk"]?.reset().play();

//   const tempQuat = useRef(new THREE.Quaternion()).current;
//   let progress = 0;

//   function startRotation() {
//     if (!zombie1Ref.current) return;
//     setIsRotating(true);
//     // 1. Получаем кватернион из Rapier-тела
//     const rapierQuat = zombie1Ref.current.rotation();

//     // 2. Конвертируем в Three.js Quaternion
//     startQuat.set(rapierQuat.x, rapierQuat.y, rapierQuat.z, rapierQuat.w);

//     const rotate90Y = new THREE.Quaternion().setFromEuler(
//       new THREE.Euler(0, Math.PI, 0, "XYZ"), // 90 градусов = PI/2 радиан
//     );

//     // 3. Создаем кватернион на который будем поворачивать
//     tempQuat.multiplyQuaternions(startQuat, rotate90Y);
//   }

//   useEffect(() => {
//     // startRotation();
//     const animateZombie = setInterval(() => {
//       if (zombie1RotateTimer + 8 < data.clock.getElapsedTime()) {
//         console.log("Check");
//         dispatch(ReactThreeFiberGameActions.setRotateZombieTimer(data.clock.getElapsedTime()));
//         startRotation();
//       }
//     }, 1000);

//     return () => clearTimeout(animateZombie);
//   }, [zombie1RotateTimer]);

//   useFrame((state, delta) => {
//     // if (tempQuat.angleTo(currentQuat) > 0.001) {
//     if (!zombie1Ref.current) return;

//     const rapierQuat = zombie1Ref.current.rotation();
//     currentQuat.set(rapierQuat.x, rapierQuat.y, rapierQuat.z, rapierQuat.w);
//     currentQuat.slerp(tempQuat, delta);
//     zombie1Ref.current.setRotation(currentQuat, true);
//     // }
//   });

//   return (
//     <>
//       <RigidBody
//         ref={zombie1Ref}
//         type="dynamic"
//         colliders={false}
//         position={[-5, 0, -2]}
//         restitution={0.2}
//         friction={0}
//         enabledRotations={[false, true, false]}
//       >
//         {/* <CapsuleCollider
//           mass={2}
//           position={[0, 0, 0]}
//           args={[0.3, 0.4]}
//         ></CapsuleCollider> */}
//         <primitive position={[0, 0, 0]} object={zombie.scene} scale={0.5} castShadow></primitive>
//         <CuboidCollider mass={2} position={[0, 0.7, 0]} args={[0.4, 0.7, 0.3]} />
//       </RigidBody>
//     </>
//   );
// }

const ForestLevel = () => {
  const dispatch = useDispatch<AppDispatch>();

  // const zombiesArr = [
  //   {
  //     name: "orc1",
  //     position: { x: -5, y: 0, z: -2 },
  //     rotationTimer: 5,
  //     animation: "walk",
  //     conditionPatternStatus: conditionPatternStatus.Peaceful,
  //   },
  //   {
  //     name: "orc2",
  //     position: { x: 2, y: 0, z: -2 },
  //     rotationTimer: 8,
  //     animation: "walk",
  //     conditionPatternStatus: conditionPatternStatus.Peaceful,
  //   },
  //   {
  //     name: "orc3",
  //     position: { x: 5, y: 0, z: -2 },
  //     rotationTimer: 4,
  //     animation: "walk",
  //     conditionPatternStatus: conditionPatternStatus.Peaceful,
  //   },
  // ];

  // const zombies = zombiesArr.map((enemyData) => {
  //   dispatch(
  //     ReactThreeFiberGameActions.setCurrentEnemyObjData({
  //       id: enemyData.name,
  //       rotationTimer: enemyData.rotationTimer,
  //       conditionPatternStatus: enemyData.conditionPatternStatus,
  //       animationName: enemyData.animation,
  //     }),
  //     dispatch(
  //       ReactThreeFiberGameActions.setNPCStat({
  //         id: enemyData.name,
  //         baseHP: 300,
  //         currentHP: 300,
  //       }),
  //     ),
  //   );

  //   return (
  //     <AncientOrc
  //       key={enemyData.name}
  //       position={enemyData.position}
  //       id={enemyData.name}
  //       rotationTimer={enemyData.rotationTimer}
  //     ></AncientOrc>
  //   );
  // });

  return (
    <>
      <Bounds></Bounds>
      <Grass></Grass>
      <Trees></Trees>
      <MainTreesComponent></MainTreesComponent>
      <MainTreeLog></MainTreeLog>
      <Platforms></Platforms>
      <NPCMain></NPCMain>
      <MainDesertMountainsComponent></MainDesertMountainsComponent>
      <Houses></Houses>
      <SparksMain></SparksMain>
      <BarrelsMain></BarrelsMain>
      <StartGameMenuMain></StartGameMenuMain>

      {/* <Enemyes></Enemyes> */}
    </>
  );
};

export default ForestLevel;
