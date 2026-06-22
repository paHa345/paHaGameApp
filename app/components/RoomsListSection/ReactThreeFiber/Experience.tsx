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
  FirstPersonControls,
  Float,
  FlyControls,
  Html,
  Lightformer,
  meshBounds,
  MeshReflectorMaterial,
  OrbitControls,
  PivotControls,
  PointerLockControls,
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
import Lights from "./Lights";
import Level from "./Level";
import Player from "./Player";
import { useSelector } from "react-redux";
import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";

const Experience = () => {
  const blocksCount = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.blocksCount,
  );
  const blocksSeed = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.blockSeed,
  );
  return (
    <>
      {/* <OrbitControls makeDefault /> */}

      <color args={["#bdedfc"]} attach={"background"}></color>
      <Physics
      //  debug={true}
      >
        <Lights />
        <Level count={blocksCount} seed={blocksSeed}></Level>
        <Player></Player>
      </Physics>
    </>
  );
};

export default Experience;
