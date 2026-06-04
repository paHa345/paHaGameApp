"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
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
  MeshReflectorMaterial,
  OrbitControls,
  PivotControls,
  RandomizedLight,
  Sky,
  SoftShadows,
  Stage,
  Text,
  Text3D,
  TransformControls,
  useHelper,
  useMatcapTexture,
} from "@react-three/drei";
import { Object3D } from "three";
import { button, useControls } from "leva";
import { directPointLight } from "three/tsl";

import Model from "./Model";
import Placeholder from "./Placeholder";
import Hamburger from "./Hamburger";
import Fox from "./Fox";

// extend({ OrbitControls: OrbitControls });

const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32);
const material = new THREE.MeshMatcapMaterial();

const Experience = () => {
  const [matcap, url] = useMatcapTexture(92, 256);
  const donutsGroup = useRef<THREE.Group | null>(null);

  useEffect(() => {
    material.matcap = matcap;
    material.needsUpdate = true;
  }, []);

  //   const [torusGeometry, setTorusGeometry] = useState();
  //   const [material, setMaterial] = useState();

  useFrame((state, delta) => {
    if (donutsGroup.current === null) return;
    for (const donut of donutsGroup.current.children) {
      donut.rotation.y += delta * 0.2;
    }
  });

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} shadow-normalBias={0.04} />
      <ambientLight intensity={1.5} />

      {/* <torusGeometry ref={setTorusGeometry} args={[1, 0.6, 16, 32]} />
      <meshMatcapMaterial ref={setMaterial} matcap={matcap} /> */}

      {/* <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh> */}

      {/* <mesh receiveShadow rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
      <Suspense fallback={<Placeholder position-y={0.5} scale={[2, 3, 2]}></Placeholder>}> */}
      {/* <Model></Model> */}
      {/* <Hamburger scale={0.35}></Hamburger>
        <Fox></Fox>
      </Suspense> */}
      <Center>
        <Text3D
          material={material}
          font={"./fonts/helvetiker_regular.typeface.json"}
          size={0.75}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          AKA 9000
        </Text3D>
      </Center>

      <group ref={donutsGroup}>
        {[...Array(100)].map((value, index) => {
          return (
            <mesh
              key={index}
              geometry={torusGeometry}
              material={material}
              position={[
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
              ]}
              scale={0.2 + Math.random() * 0.2}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            ></mesh>
          );
        })}
      </group>
    </>
  );
};

export default Experience;
