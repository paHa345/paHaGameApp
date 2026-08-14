"use client";

import { ReactThreeFiber, ThreeEvent, useFrame, useLoader, useThree } from "@react-three/fiber";
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
  useRapier,
} from "@react-three/rapier";
import Lights from "./Lights";
import Level from "./Level";
import Player from "./Player";
import { useDispatch, useSelector } from "react-redux";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import GameMenu from "./GameMenu";
import { AppDispatch } from "@/app/store";
import { width } from "@fortawesome/free-regular-svg-icons/faSave";
import ForestLevel from "./ForestLevel";
import Camera from "./Camera";
import Controls from "./Controls";

const Experience = () => {
  const { gl } = useThree();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      ReactThreeFiberGameActions.setCanvasWidthHeight({
        width: gl.domElement.clientWidth,
        height: gl.domElement.clientHeight,
      }),
    );
  }, [gl.domElement.clientHeight, gl.domElement.clientWidth]);

  const blocksCount = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.blocksCount,
  );
  const blocksSeed = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.blockSeed,
  );
  return (
    <>
      {/* <OrbitControls makeDefault /> */}

      {/* <color args={["#bdedfc"]} attach={"background"}></color> */}
      <Sky sunPosition={[20, 20, 0]}></Sky>
      <Physics debug={true}>
        <Lights />
        {/* <Level count={blocksCount} seed={blocksSeed}></Level> */}
        <ForestLevel></ForestLevel>

        <Suspense fallback={null}>
          <Player></Player>
        </Suspense>
        <Camera />
        <Controls></Controls>
      </Physics>
    </>
  );
};

export default Experience;
