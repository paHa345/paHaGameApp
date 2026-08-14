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
import AncientOrc from "./AncientOrcEnemy";
import { conditionPatternStatus } from "@/app/types";
import MainTreesComponent from "./MainTreesComponent";
import MainTreeLog from "./MainTreeLog";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });
export function Bounds({ length = 1 }) {
  const rock061Color = useTexture("./textures/Rock061/Rock061Color.jpg");
  const rock061Normal = useTexture("./textures/Rock061/Rock061NormalGL.jpg");
  const rock061Roughness = useTexture("./textures/Rock061/Rock061Roughness.jpg");
  const rock061Displacement = useTexture("./textures/Rock061/Rock061Displacement.jpg");
  const rock061AmbientOcclusion = useTexture("./textures/Rock061/Rock061Occlusion.jpg");

  rock061Color.repeat.set(24, 1);
  rock061Color.wrapS = THREE.RepeatWrapping;
  rock061Color.wrapT = THREE.RepeatWrapping;
  rock061Normal.repeat.set(24, 1);
  rock061Normal.wrapS = THREE.RepeatWrapping;
  rock061Normal.wrapT = THREE.RepeatWrapping;
  rock061Roughness.repeat.set(24, 1);
  rock061Roughness.wrapS = THREE.RepeatWrapping;
  rock061Roughness.wrapT = THREE.RepeatWrapping;
  rock061Displacement.repeat.set(24, 1);
  rock061Displacement.wrapS = THREE.RepeatWrapping;
  rock061Displacement.wrapT = THREE.RepeatWrapping;
  rock061AmbientOcclusion.repeat.set(24, 1);
  rock061AmbientOcclusion.wrapS = THREE.RepeatWrapping;
  rock061AmbientOcclusion.wrapT = THREE.RepeatWrapping;

  rock061Color.needsUpdate = true;
  rock061Normal.needsUpdate = true;
  rock061Roughness.needsUpdate = true;
  rock061Displacement.needsUpdate = true;
  rock061AmbientOcclusion.needsUpdate = true;

  return (
    <>
      <mesh position={[0, 0.75, -60]}>
        <boxGeometry args={[96, 4, 4]} />
        <meshStandardMaterial
          // color={"red"}
          map={rock061Color}
          normalMap={rock061Normal}
          roughnessMap={rock061Roughness}
          // displacementMap={rock061Displacement}
          aoMap={rock061AmbientOcclusion}
          // // roughness={grassRoughtness}
          // // displacementScale={grassDisplacementScale}
          // // metalness={grassMetalness}
          // // aoMapIntensity={grassAOMapIntensity}
          // // normalScale={[4, 4]}
        />
      </mesh>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <CuboidCollider
          args={[0.3, 1.5, 48]}
          position={[-48.15, 0.75, -10]}
          restitution={0.2}
          friction={1}
        />

        <CuboidCollider
          args={[0.3, 1.5, 48]}
          position={[48.15, 0.75, -10]}
          restitution={0.2}
          friction={1}
        />
        <CuboidCollider
          args={[48, 1.5, 0.3]}
          position={[0, 0.75, -58]}
          restitution={0.2}
          friction={1}
        />
        <CuboidCollider
          args={[48, 1.5, 0.3]}
          position={[0, 0.75, 38.25]}
          restitution={0.2}
          friction={1}
        />
        <CuboidCollider
          args={[48, 0.1, 48]}
          position={[0, -0.1, -10]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  );
}

export function Grass() {
  const { grassRoughtness, grassMetalness, grassAOMapIntensity, grassDisplacementScale } =
    useControls("Grass", {
      grassRoughtness: { value: 0.85, min: 0.1, max: 1 },
      grassMetalness: { value: 0.1, min: 0.1, max: 1 },
      grassAOMapIntensity: { value: 0.5, min: 0.1, max: 1 },
      grassDisplacementScale: { value: 0, min: 0.01, max: 1 },
    });
  const grass001Color = useTexture("./textures/Grass001/Grass001_1K-JPG_Color.jpg");
  const grass001Normal = useTexture("./textures/Grass001/Grass001_1K-JPG_NormalGL.jpg");
  const grass001Roughness = useTexture("./textures/Grass001/Grass001_1K-JPG_Roughness.jpg");
  const grass001Displacement = useTexture("./textures/Grass001/Grass001_1K-JPG_Displacement.jpg");
  const grass001AmbientOcclusion = useTexture(
    "./textures/Grass001/Grass001_1K-JPG_AmbientOcclusion.jpg",
  );

  grass001Color.repeat.set(16, 16);
  grass001Color.wrapS = THREE.RepeatWrapping;
  grass001Color.wrapT = THREE.RepeatWrapping;
  grass001Normal.repeat.set(16, 16);
  grass001Normal.wrapS = THREE.RepeatWrapping;
  grass001Normal.wrapT = THREE.RepeatWrapping;
  grass001Roughness.repeat.set(16, 16);
  grass001Roughness.wrapS = THREE.RepeatWrapping;
  grass001Roughness.wrapT = THREE.RepeatWrapping;
  grass001Displacement.repeat.set(16, 16);
  grass001Displacement.wrapS = THREE.RepeatWrapping;
  grass001Displacement.wrapT = THREE.RepeatWrapping;
  grass001AmbientOcclusion.repeat.set(16, 16);
  grass001AmbientOcclusion.wrapS = THREE.RepeatWrapping;
  grass001AmbientOcclusion.wrapT = THREE.RepeatWrapping;

  grass001Color.needsUpdate = true;
  grass001Normal.needsUpdate = true;
  grass001Roughness.needsUpdate = true;
  grass001Displacement.needsUpdate = true;
  grass001AmbientOcclusion.needsUpdate = true;

  return (
    <>
      <mesh
        position={[0, -0.1, -10]}
        geometry={boxGeometry}
        scale={[96, 0.2, 96]}
        // material={grassTexture}
        receiveShadow
      >
        {/* <boxGeometry args={[4, 0.2, 4]} /> */}
        <meshStandardMaterial
          map={grass001Color}
          normalMap={grass001Normal}
          roughnessMap={grass001Roughness}
          displacementMap={grass001Displacement}
          aoMap={grass001AmbientOcclusion}
          roughness={grassRoughtness}
          displacementScale={grassDisplacementScale}
          metalness={grassMetalness}
          aoMapIntensity={grassAOMapIntensity}
          // normalScale={[4, 4]}
        />
      </mesh>
    </>
  );
}

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

export function Enemyes() {
  const zombie1Ref = useRef<RapierRigidBody>(null);
  // const [zombie1RotateTimer, setZombie1RotateTimer] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const zombie1RotateTimer = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.rotateZombieTimer,
  );

  const currentQuat = new THREE.Quaternion();
  const startQuat = new THREE.Quaternion();
  const data = useThree();

  const zombie = useGLTF("./models/characters/2/character-o.glb", true);
  zombie.nodes.torso.castShadow = true;
  for (const name in zombie.nodes) {
    zombie.nodes[name].castShadow = true;
  }
  const sceneClone = zombie.scene.clone();

  const currentModelAnimations = useAnimations(zombie.animations, zombie.scene);
  currentModelAnimations.actions["walk"]?.reset().play();

  console.log(currentModelAnimations.actions["walk"]);

  const tempQuat = useRef(new THREE.Quaternion()).current;
  let progress = 0;

  function startRotation() {
    if (!zombie1Ref.current) return;
    setIsRotating(true);
    // 1. Получаем кватернион из Rapier-тела
    const rapierQuat = zombie1Ref.current.rotation();

    // 2. Конвертируем в Three.js Quaternion
    startQuat.set(rapierQuat.x, rapierQuat.y, rapierQuat.z, rapierQuat.w);

    const rotate90Y = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, Math.PI, 0, "XYZ"), // 90 градусов = PI/2 радиан
    );

    // 3. Создаем кватернион на который будем поворачивать
    tempQuat.multiplyQuaternions(startQuat, rotate90Y);
  }

  useEffect(() => {
    // startRotation();
    const animateZombie = setInterval(() => {
      if (zombie1RotateTimer + 8 < data.clock.getElapsedTime()) {
        console.log("Check");
        dispatch(ReactThreeFiberGameActions.setRotateZombieTimer(data.clock.getElapsedTime()));
        startRotation();
      }
    }, 1000);

    return () => clearTimeout(animateZombie);
  }, [zombie1RotateTimer]);

  useFrame((state, delta) => {
    // if (tempQuat.angleTo(currentQuat) > 0.001) {
    if (!zombie1Ref.current) return;

    const rapierQuat = zombie1Ref.current.rotation();
    currentQuat.set(rapierQuat.x, rapierQuat.y, rapierQuat.z, rapierQuat.w);
    currentQuat.slerp(tempQuat, delta);
    zombie1Ref.current.setRotation(currentQuat, true);
    // }
  });

  return (
    <>
      <RigidBody
        ref={zombie1Ref}
        type="dynamic"
        colliders={false}
        position={[-5, 0, -2]}
        restitution={0.2}
        friction={0}
        enabledRotations={[false, true, false]}
      >
        {/* <CapsuleCollider
          mass={2}
          position={[0, 0, 0]}
          args={[0.3, 0.4]}
        ></CapsuleCollider> */}
        <primitive position={[0, 0, 0]} object={zombie.scene} scale={0.5} castShadow></primitive>
        <CuboidCollider mass={2} position={[0, 0.7, 0]} args={[0.4, 0.7, 0.3]} />
      </RigidBody>
    </>
  );
}

const ForestLevel = () => {
  const dispatch = useDispatch<AppDispatch>();

  const zombiesArr = [
    {
      name: "orc1",
      position: { x: -5, y: 0, z: -2 },
      rotationTimer: 5,
      animation: "walk",
      conditionPatternStatus: conditionPatternStatus.Peaceful,
    },
    {
      name: "orc2",
      position: { x: 2, y: 0, z: -2 },
      rotationTimer: 8,
      animation: "walk",
      conditionPatternStatus: conditionPatternStatus.Peaceful,
    },
    {
      name: "orc3",
      position: { x: 5, y: 0, z: -2 },
      rotationTimer: 4,
      animation: "walk",
      conditionPatternStatus: conditionPatternStatus.Peaceful,
    },
  ];

  const zombies = zombiesArr.map((enemyData) => {
    dispatch(
      ReactThreeFiberGameActions.setCurrentEnemyObjData({
        id: enemyData.name,
        rotationTimer: enemyData.rotationTimer,
        conditionPatternStatus: enemyData.conditionPatternStatus,
        animationName: enemyData.animation,
      }),
    );

    return (
      <AncientOrc
        key={enemyData.name}
        position={enemyData.position}
        id={enemyData.name}
        rotationTimer={enemyData.rotationTimer}
      ></AncientOrc>
    );
  });

  return (
    <>
      <Bounds length={2 + 2}></Bounds>
      <Grass></Grass>
      <Trees></Trees>
      <MainTreesComponent></MainTreesComponent>
      <MainTreeLog></MainTreeLog>
      {/* <Enemyes></Enemyes> */}
      {zombies}
    </>
  );
};

export default ForestLevel;
