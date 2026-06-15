import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

export function BlockStart({ position = [0, 0, 0] }: any) {
  return (
    <>
      <group position={position}>
        <mesh
          position={[0, -0.1, 0]}
          geometry={boxGeometry}
          scale={[4, 0.2, 4]}
          material={floor1Material}
          receiveShadow
        >
          {/* <boxGeometry args={[4, 0.2, 4]} /> */}
          {/* <meshStandardMaterial color={"limegreen"} /> */}
        </mesh>
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
  const hamburger = useGLTF("./models/burger.glb");

  hamburger.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });

  return (
    <>
      <group position={position}>
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
          position={[0, 0.25, 0]}
          restitution={0.2}
          friction={0}
        >
          <primitive object={hamburger.scene} scale={0.2} castShadow></primitive>
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

const Level = ({ count = 5, types = [BlockSpinner, BlockAxe, BlockLimbo] }) => {
  // const count = 5
  // const types = [BlockSpinner, BlockAxe, BlockLimbo]

  const blocks = useMemo(() => {
    const blocks: any = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }
    return blocks;
  }, [count, types]);

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
