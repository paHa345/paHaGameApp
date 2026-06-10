"use client";

import { ThreeEvent, useFrame, useLoader } from "@react-three/fiber";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { DirectionalLight, Mesh, Object3DEventMap } from "three";
import {
  AccumulativeShadows,
  BakeShadows,
  Center,
  ContactShadows,
  Environment,
  Float,
  Html,
  Lightformer,
  meshBounds,
  MeshReflectorMaterial,
  OrbitControls,
  PivotControls,
  PresentationControls,
  RandomizedLight,
  shaderMaterial,
  Sky,
  SoftShadows,
  Sparkles,
  Stage,
  Text,
  Text3D,
  TransformControls,
  useFBX,
  useGLTF,
  useHelper,
  useMatcapTexture,
  useTexture,
} from "@react-three/drei";

import { Object3D } from "three";
import { button, useControls } from "leva";
import { directPointLight } from "three/tsl";

import Model from "./Model";
import Placeholder from "./Placeholder";
import Hamburger from "./Hamburger";
import Fox from "./Fox";

import portalVertexShader from "../shaders/portal/vertex.glsl";
import portalFragmentShader from "../shaders/portal/fragment.glsl";
import { extend } from "@react-three/fiber";

import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Glitch,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import {
  BlendFunction,
  DepthOfFieldEffect,
  EffectPass,
  GlitchMode,
  RenderPass,
} from "postprocessing";
import Drunk from "./Drunk";
import DrunkEffect from "./DrunkEffect";
import {
  BallCollider,
  CuboidCollider,
  CylinderCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
  InstancedRigidBodies,
} from "@react-three/rapier";

const Experience = () => {
  const cubeCount = 10;
  const cube = useRef<RapierRigidBody>(null);
  const twister = useRef<RapierRigidBody>(null);

  const [hitSound] = useState(() => new Audio("./hit.mp3"));

  const burger = useGLTF("./models/burger.glb");

  const cubes = useRef<THREE.InstancedMesh>(null);

  // useEffect(() => {
  //   if (!cubes.current) return;
  //   for (let i = 0; i < cubeCount; i++) {
  //     const matrix = new THREE.Matrix4();
  //     matrix.compose(
  //       new THREE.Vector3(i * 2, 0, 0),
  //       new THREE.Quaternion(),
  //       new THREE.Vector3(1, 1, 1),
  //     );
  //     console.log("set cube");
  //     cubes.current.setMatrixAt(i, matrix);
  //   }
  //   cubes.current.instanceMatrix.needsUpdate = true;
  // }, []);

  const instances = useMemo(() => {
    const instances: any = [];

    for (let i = 0; i < cubeCount; i++) {
      instances.push({
        key: "instance_" + i,
        position: [Math.random() * 0.5 * 8, 6 + i * 0.2, Math.random() * 0.5 * 8],
        rotation: [Math.random(), Math.random(), Math.random()],
      });
    }

    return instances;
  }, []);

  const cubeJump = (e: ThreeEvent<MouseEvent>) => {
    if (!cube.current) return;

    const mass = cube.current.mass();
    cube.current?.applyImpulse({ x: 0, y: 5 * mass, z: 0 }, true);
    cube.current?.applyTorqueImpulse(
      { x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 },
      true,
    );
  };

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const eulerRotation = new THREE.Euler(0, time * 3, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);
    twister.current?.setNextKinematicRotation(quaternionRotation);

    const angle = time * 0.5;
    const x = Math.cos(angle) * 2;
    const z = Math.sin(angle) * 2;
    twister.current?.setNextKinematicTranslation({ x: x, y: -0.8, z: z });
  });

  const collisionEnter = () => {
    // hitSound.currentTime = 0;
    // hitSound.volume = Math.random();
    // hitSound.play();
  };

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <Physics debug={true} gravity={[0, -9.08, 0]}>
        <RigidBody colliders={"ball"}>
          <mesh castShadow position={[-1.5, 2, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        {/* <RigidBody>
          <mesh castShadow position={[2, 2, 0]}>
            <boxGeometry args={[3, 2, 1]} />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
          <mesh castShadow position={[2, 2, 3]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody> */}

        {/* <RigidBody colliders={false} position={[0, 1, 0]} rotation-x={-Math.PI * 0.5}>
          <BallCollider args={[1.5]} />
           <CuboidCollider
            args={[0.25, 1, 0.25]}
            position={[0, 0, 1]}
            rotation={[-Math.PI * 0.35, 0, 0]}
          /> 
          <mesh castShadow={true}>
            <torusGeometry args={[1, 0.5, 16, 32]} />
            <meshStandardMaterial color={"red"} />
          </mesh>
        </RigidBody> */}

        <RigidBody
          ref={cube}
          colliders={false}
          position={[1.5, 2, 0]}
          gravityScale={1}
          restitution={0}
          friction={0.7}
          onCollisionEnter={collisionEnter}
          // onCollisionExit={() => {
          //   console.log("Exit");
          // }}

          onWake={() => {
            console.log("Wake");
          }}
        >
          <mesh onClick={cubeJump} castShadow={true}>
            <boxGeometry />
            <meshStandardMaterial color={"red"} />
          </mesh>
          <CuboidCollider mass={2} args={[0.5, 0.5, 0.5]} />
        </RigidBody>

        {/* <RigidBody ref={twister} position={[0, -0.8, 0]} type="kinematicPosition">
          <mesh castShadow={true} scale={[0.4, 0.4, 3]}>
            <boxGeometry />
            <meshStandardMaterial color={"brown"} />
          </mesh>
        </RigidBody> */}

        <RigidBody position={[-2, -0.5, 2]} type="kinematicPosition">
          <mesh castShadow>
            <boxGeometry />
            <meshStandardMaterial color={"yellow"} />
          </mesh>
        </RigidBody>

        <RigidBody colliders={false} position={[0, 0, 0]}>
          <primitive
            onClick={(e: any) => e.stopPropagation()}
            castShadow
            object={burger.scene}
            scale={0.2}
            position-y={-0.4}
          />
          <CylinderCollider args={[0.35, 0.95]} />
          {/* <CuboidCollider mass={2} args={[1, 1, 1]} /> */}
        </RigidBody>

        <RigidBody type="fixed">
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]}></CuboidCollider>
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]}></CuboidCollider>
          <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]}></CuboidCollider>
          <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]}></CuboidCollider>
        </RigidBody>

        <RigidBody type="fixed">
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>

        <InstancedRigidBodies instances={instances}>
          <instancedMesh castShadow args={[undefined, undefined, cubeCount]}>
            <boxGeometry />
            <meshStandardMaterial color={"tomato"} />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  );
};

export default Experience;
