"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import * as THREE from "three";

import { DirectionalLight, Mesh, Object3DEventMap } from "three";
import {
  AccumulativeShadows,
  BakeShadows,
  ContactShadows,
  Environment,
  Float,
  Html,
  Lightformer,
  MeshReflectorMaterial,
  OrbitControls,
  PivotControls,
  RandomizedLight,
  Sky,
  SoftShadows,
  Stage,
  Text,
  TransformControls,
  useHelper,
} from "@react-three/drei";
import { Object3D } from "three";
import { button, useControls } from "leva";
import { directPointLight } from "three/tsl";

import Model from "./Model";

// extend({ OrbitControls: OrbitControls });

const Experience = () => {
  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      {/* <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh> */}

      <mesh receiveShadow position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
      <Suspense
        fallback={
          <mesh position-y={0.5} scale={[2, 3, 2]}>
            <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
            <meshBasicMaterial color={"red"} wireframe />
          </mesh>
        }
      >
        <Model></Model>
      </Suspense>
    </>
  );
};

export default Experience;
