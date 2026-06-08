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
        snap={4}
        // config={{ mass: 4, tension: 400 }}
      >
        <Float rotationIntensity={0.4}>
          <primitive object={computer} scale={0.4} position={[0, 0.8, 0]}></primitive>
        </Float>
      </PresentationControls>
    </>
  );
};

export default Experience;
