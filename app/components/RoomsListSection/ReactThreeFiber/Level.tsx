import { Float, Text, useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import localFont from "next/font/local";
import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

const Shonen = localFont({
  src: "../../../../public/fonts/Shonen.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export function BlockStart({ position = [0, 0, 0] }: any) {
  const treeHigh = useGLTF("./models/MiniForest/tree-high.glb");
  const patchGrass = useGLTF("./models/MiniForest/patch-grass.glb");

  const rocksHigh = useGLTF("./models/MiniForest/rocks-high.glb");
  // const forestTexture = useTexture("./models/MiniForest/Textures/colormap.png");
  const zombie = useGLTF("./models/characters/2/character-o.glb");
  const beaver = useGLTF("./models/CubePetsModels/animal-beaver.glb");
  // const grassPixelTexture = useTexture("./textures/grassPixelTexture.jpg");
  // const grass5Texture = useTexture("./textures/grass5/grass-5-color.jpg");
  // const grass5AmbientOcclusion = useTexture(
  //   "./textures/grass5/grass-5-ambientOcclusion.jpg",
  // );
  // const grass5Normal = useTexture("./textures/grass5/grass-5-normal.jpg");
  // const grass5Roughness = useTexture("./textures/grass5/grass-5-roughness.jpg");

  // const grassColor = useTexture("./textures/grass/color.jpg");
  // const grassambientOcclusion = useTexture(
  //   "./textures/grass/ambientOcclusion.jpg",
  // );
  // const grassnormal = useTexture("./textures/grass/normal.jpg");
  // const grassroughness = useTexture("./textures/grass/roughness.jpg");
  const grass001Color = useTexture(
    "./textures/Grass001/Grass001_1K-JPG_Color.jpg",
  );
  const grass001Normal = useTexture(
    "./textures/Grass001/Grass001_1K-JPG_NormalGL.jpg",
  );
  const grass001Roughness = useTexture(
    "./textures/Grass001/Grass001_1K-JPG_Roughness.jpg",
  );
  const grass001Displacement = useTexture(
    "./textures/Grass001/Grass001_1K-JPG_Displacement.jpg",
  );
  const grass001AmbientOcclusion = useTexture(
    "./textures/Grass001/Grass001_1K-JPG_AmbientOcclusion.jpg",
  );
  // grass001Color.wrapS = THREE.RepeatWrapping;
  // grass001Color.wrapT = THREE.RepeatWrapping;
  // grass001Color.repeat.set(1, 1);

  beaver.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });

  patchGrass.scene.children.forEach((mesh) => {
    mesh.receiveShadow = true;
  });

  zombie.nodes.torso.castShadow = true;
  for (const name in zombie.nodes) {
    zombie.nodes[name].castShadow = true;
  }

  treeHigh.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });
  console.log(treeHigh);

  rocksHigh.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });
  return (
    <>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          font="./fonts/Shonen.ttf"
          scale={0.3}
          maxWidth={3}
          lineHeight={0.85}
          textAlign="right"
          position={[0.75, 1, 0]}
          rotation-y={-0.25}
        >
          {" "}
          Крафт Орг 3D
        </Text>
        <meshBasicMaterial toneMapped={false} />
      </Float>
      <group position={position}>
        <mesh
          position={[0, -0.1, 0]}
          geometry={boxGeometry}
          scale={[4, 0.2, 4]}
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
            roughness={0.7}
            displacementScale={0.1}
          />
        </mesh>

        <mesh position={[0, -0.01, -1.2]}>
          <primitive
            object={patchGrass.scene}
            scale={1}
            receiveShadow
          ></primitive>
        </mesh>

        <RigidBody
          type="fixed"
          colliders="hull"
          position={[-1, 0, -1]}
          restitution={0.2}
          friction={0}
        >
          <primitive object={zombie.scene} scale={0.5} castShadow></primitive>
        </RigidBody>
        <RigidBody
          type="fixed"
          colliders="hull"
          position={[0, 0.01, -1.2]}
          restitution={0.2}
          friction={0}
        >
          <primitive object={treeHigh.scene} scale={1} castShadow>
            {/* <meshBasicMaterial map={forestTexture} /> */}
          </primitive>
        </RigidBody>
        <RigidBody
          type="fixed"
          colliders="hull"
          position={[1, 0.1, 0]}
          restitution={0.2}
          friction={0}
        >
          <primitive object={rocksHigh.scene} scale={0.75} castShadow>
            {/* <meshBasicMaterial map={forestTexture} /> */}
          </primitive>
        </RigidBody>
      </group>
    </>
  );
}

export function BlockSpinner({ position = [0, 0, 0] }: any) {
  const obstacle = useRef<RapierRigidBody>(null);

  const [speed] = useState(() => {
    return (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1);
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacle.current?.setNextKinematicRotation(rotation);
  });
  return (
    <>
      <group position={position}>
        <mesh
          position={[0, -0.1, 0]}
          geometry={boxGeometry}
          scale={[4, 0.2, 4]}
          material={floor2Material}
          receiveShadow
        ></mesh>

        <RigidBody
          ref={obstacle}
          type="kinematicPosition"
          position={[0, 0.3, 0]}
          restitution={0.3}
          friction={0}
        >
          <mesh
            position={[0, 0, 0]}
            geometry={boxGeometry}
            scale={[3.5, 0.3, 0.3]}
            castShadow
            receiveShadow
            material={obstacMaterial}
          ></mesh>
        </RigidBody>
      </group>
    </>
  );
}

export function BlockLimbo({ position = [0, 0, 0] }: any) {
  const obstacle = useRef<RapierRigidBody>(null);

  const [timeOffset] = useState(() => {
    return Math.random() * Math.PI * 2;
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // const rotation = new THREE.Quaternion();
    // rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    // obstacle.current?.setNextKinematicRotation(rotation);
    obstacle.current?.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + Math.sin(time + timeOffset) + 1.15,
      z: position[2],
    });
  });
  return (
    <>
      <group position={position}>
        <mesh
          position={[0, -0.1, 0]}
          geometry={boxGeometry}
          scale={[4, 0.2, 4]}
          material={floor2Material}
          receiveShadow
        ></mesh>

        <RigidBody
          ref={obstacle}
          type="kinematicPosition"
          position={[0, 0.3, 0]}
          restitution={0.3}
          friction={0}
        >
          <mesh
            position={[0, 0, 0]}
            geometry={boxGeometry}
            scale={[3.5, 0.3, 0.3]}
            castShadow
            receiveShadow
            material={obstacMaterial}
          ></mesh>
        </RigidBody>
      </group>
    </>
  );
}

export function BlockAxe({ position = [0, 0, 0] }: any) {
  const obstacle = useRef<RapierRigidBody>(null);

  const [timeOffset] = useState(() => {
    return Math.random() * Math.PI * 2;
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // const rotation = new THREE.Quaternion();
    // rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    // obstacle.current?.setNextKinematicRotation(rotation);
    obstacle.current?.setNextKinematicTranslation({
      x: position[0] + Math.sin(time + timeOffset) * 1.25,
      y: position[1] + 0.75,
      z: position[2],
    });
  });
  return (
    <>
      <group position={position}>
        <mesh
          position={[0, -0.1, 0]}
          geometry={boxGeometry}
          scale={[4, 0.2, 4]}
          material={floor2Material}
          receiveShadow
        ></mesh>

        <RigidBody
          ref={obstacle}
          type="kinematicPosition"
          position={[0, 0.3, 0]}
          restitution={0.3}
          friction={0}
        >
          <mesh
            position={[0, 0, 0]}
            geometry={boxGeometry}
            scale={[1.5, 1.5, 0.3]}
            castShadow
            receiveShadow
            material={obstacMaterial}
          ></mesh>
        </RigidBody>
      </group>
    </>
  );
}

export function BlockEnd({ position = [0, 0, 0] }: any) {
  const burger = useGLTF("./models/burger.glb");

  const ketchup = useGLTF("./models/Food/bottle-ketchup.glb");
  const donut = useGLTF("./models/Food/donut-sprinkles.glb");
  const foodTexture = useTexture("./models/Food/Textures/colormap.png");

  burger.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });
  ketchup.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });
  donut.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });

  return (
    <>
      <group position={position}>
        <Text font="./fonts/Shonen.ttf" position={[0, 2.25, 2]} scale={1}>
          Финиш
        </Text>
        <mesh
          position={[0, 0, 0]}
          geometry={boxGeometry}
          scale={[4, 0.2, 4]}
          material={floor1Material}
          receiveShadow
        >
          {/* <boxGeometry args={[4, 0.2, 4]} /> */}
          {/* <meshStandardMaterial color={"limegreen"} /> */}
        </mesh>
        <RigidBody
          type="fixed"
          colliders="hull"
          position={[1.5, 0.25, 0]}
          restitution={0.2}
          friction={0}
        >
          <primitive object={ketchup.scene} scale={2} castShadow>
            <meshBasicMaterial map={foodTexture} />
          </primitive>
        </RigidBody>

        <RigidBody
          type="fixed"
          colliders="hull"
          position={[-1.1, 0.25, 0]}
          restitution={0.2}
          friction={0}
        >
          <primitive object={donut.scene} scale={6} castShadow>
            <meshBasicMaterial map={foodTexture} />
          </primitive>
        </RigidBody>

        <RigidBody
          type="fixed"
          colliders="hull"
          position={[0.4, 0.25, 0]}
          restitution={0.2}
          friction={0}
        >
          <primitive object={burger.scene} scale={0.15} castShadow></primitive>
        </RigidBody>
      </group>
    </>
  );
}

export function Bounds({ length = 1 }) {
  return (
    <>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh
          castShadow
          geometry={boxGeometry}
          material={wallMaterial}
          position={[2.15, 0.75, -(length * 2) + 2]}
          scale={[0.3, 1.5, 4 * length]}
        ></mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={boxGeometry}
          material={wallMaterial}
          position={[-2.15, 0.75, -(length * 2) + 2]}
          scale={[0.3, 1.5, 4 * length]}
        ></mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={boxGeometry}
          material={wallMaterial}
          position={[0, 0.75, -(length * 4) + 2]}
          scale={[4, 1.5, 0.3]}
        ></mesh>
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  );
}

const Level = ({
  count = 5,
  types = [BlockSpinner, BlockAxe, BlockLimbo],
  seed = 0,
}) => {
  // const count = 5
  // const types = [BlockSpinner, BlockAxe, BlockLimbo]

  

  const blocks = useMemo(() => {
    const blocks: any = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }
    return blocks;
  }, [count, types, seed]);

  return (
    <>
      <BlockStart position={[0, 0, 0]}></BlockStart>
      {blocks.map((Block: any, index: number) => (
        <Block key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}
      <BlockEnd position={[0, 0, -(count + 1) * 4]}></BlockEnd>
      <Bounds length={count + 2}></Bounds>
    </>
  );
};

export default Level;
