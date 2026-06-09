"use client";

import { ThreeEvent, useFrame, useLoader } from "@react-three/fiber";
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

const Experience = () => {
  const computer = useFBX("./models/Macbook.FBX");

  const { PositionX, PositionY, PositionZ, RotationX, distanceFactor } = useControls(
    "framePosition",
    {
      PositionX: { value: -0.96, min: -2, max: 2, step: 0.01 },
      PositionY: { value: 4.88, min: -2, max: 6, step: 0.01 },
      PositionZ: { value: 0.21, min: -2, max: 2, step: 0.01 },
      RotationX: { value: 1.57, min: -2, max: 2, step: 0.01 },
      distanceFactor: { value: 4.54, min: 3, max: 6, step: 0.01 },
    },
  );

  return (
    <>
      <Environment preset="city"></Environment>
      <color args={["#241a1a"]} attach={"background"}></color>
      {/* <OrbitControls makeDefault /> */}

      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        snap={0.5}
        // config={{ mass: 4, tension: 400 }}
      >
        <Float rotationIntensity={0.4}>
          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={65}
            color={"#ff6900"}
            rotation={[0.1, Math.PI, 0.0]}
            position={[-0.96, 4.88, 0.21]}
          ></rectAreaLight>
          <primitive object={computer} scale={0.4} position={[0, 0.8, 0]}>
            <Html
              transform
              wrapperClass="htmlScreen"
              distanceFactor={distanceFactor}
              position={[PositionX, PositionY, PositionZ]}
              rotation-x={RotationX}
            >
              <iframe src="https://paha-game-app.vercel.app/game"></iframe>
            </Html>
          </primitive>
          <Text
            font="./bangers-v20-latin-regular.woff"
            fontSize={1}
            position={[3, 1, 0.75]}
            rotation-y={-1.25}
            maxWidth={2}
            textAlign={"center"}
          >
            Pavel Rychta (paHa345)
          </Text>
        </Float>
      </PresentationControls>
      <ContactShadows position-y={-1.4} opacity={0.4} scale={5} blur={2.4}></ContactShadows>
    </>
  );
};

export default Experience;
