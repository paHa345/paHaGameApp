import { AppDispatch } from "@/app/store";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import { useAnimations, useGLTF, useKeyboardControls, useTexture } from "@react-three/drei";
import { createPortal, ObjectMap, useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier";
import { useControls } from "leva";
import React, { memo, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";
import GameMenu from "../Interface/GameMenu";
import UpdateMouseCoordsAndCameraPosition from "../UpdateMouseCoordsAndCameraPosition";
import PlayerAnimationsController from "./PlayerAnimationsController";
import RightHandWeapon from "./RightHandWeapon";
import LeftHandShield from "./LeftHandShield";
import SetPlayerPickUpObjectStatus from "./SetPlayerPickUpObjectStatus";
import PlayerPickUpObjectHandler from "./PlayerPickUpObjectHandler";
import PlayerThrowObjectHandler from "./PlayerThrowObjectHandler";
import PlayerBody from "./PlayerBody";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import PlayerMoveController from "./PlayerMoveController";
import ChaseCamera from "./ChaseCamera";
import MouseCoordsHandler from "./MouseCoordsHandler";

const Player = () => {
  // const Scratches005Color = useTexture("./textures/Moss002/Moss002Color.jpg");

  // Scratches005Color.repeat.set(24, 1);
  // Scratches005Color.wrapS = THREE.RepeatWrapping;
  // Scratches005Color.wrapT = THREE.RepeatWrapping;

  // Scratches005Color.needsUpdate = true;

  const body = useRef<RapierRigidBody>(null);
  const userMain = useRef<THREE.Mesh>(null);
  const playerModelRef = useRef<THREE.Mesh>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const yaw = useRef(0); // поворот камеры по горизонтали
  const pitch = useRef(0); // наклон камеры (0 = горизонтально, >0 = смотрим сверху)
  const _targetPos = new THREE.Vector3();

  const smoothLook = useRef(new THREE.Vector3());
  const cameraInitialized = useRef(false);
  const _rawLook = new THREE.Vector3();
  const camForward = useMemo(() => new THREE.Vector3(), []);
  const camRight = useMemo(() => new THREE.Vector3(), []);
  const UP = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const moveDir = useMemo(() => new THREE.Vector3(), []);

  const _origin = new THREE.Vector3(0, 0, 0);
  const _targetQuat = new THREE.Quaternion();
  const _m4 = new THREE.Matrix4();
  const _currentQuat = new THREE.Quaternion();
  const _flipQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
  const lastAnim: any = useRef(null);

  const player = useGLTF("./models/characters/2/character-a.glb", true);
  for (const name in player.nodes) {
    player.nodes[name].castShadow = true;
  }
  // const playerTexture = useTexture("./models/characters/2/texture-a.png");
  // playerTexture.flipY = false;

  const dispatch = useDispatch<AppDispatch>();
  const phase = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.phase,
  );

  useEffect(() => {
    if (body.current !== null) {
      dispatch(ReactThreeFiberGameActions.setPlayerBodyRef(body.current));
    }
  }, [body.current]);

  useEffect(() => {
    if (userMain.current !== null) {
      dispatch(ReactThreeFiberGameActions.setPlayerMeshRef(userMain.current));
    }
  }, [userMain.current]);

  const reset = () => {
    body.current?.setTranslation(
      {
        x: 0,
        y: 1,
        z: 0,
      },
      true,
    );
    body.current?.setLinvel(
      {
        x: 0,
        y: 0,
        z: 0,
      },
      true,
    );
    body.current?.setAngvel(
      {
        x: 0,
        y: 1,
        z: 0,
      },
      true,
    );
  };

  useEffect(() => {
    if (phase === "ready") {
      reset();
    }
  }, [phase]);

  return (
    <>
      <Suspense fallback={null}>
        <PlayerBody
          userMain={userMain}
          body={body}
          playerModelRef={playerModelRef}
          player={player as unknown as GLTF & ObjectMap}
        ></PlayerBody>
        <PlayerMoveController
          playerModelRef={playerModelRef}
          body={body}
          camForward={camForward}
          camRight={camRight}
          upDirection={UP}
          moveDir={moveDir}
          lastAnim={lastAnim}
          _m4={_m4}
          _flipQuat={_flipQuat}
          _currentQuat={_currentQuat}
          _origin={_origin}
          _targetQuat={_targetQuat}
        ></PlayerMoveController>
        <ChaseCamera
          body={body}
          yaw={yaw}
          pitch={pitch}
          _targetPos={_targetPos}
          _rawLook={_rawLook}
          smoothLook={smoothLook}
          cameraInitialized={cameraInitialized}
        ></ChaseCamera>
        <MouseCoordsHandler yaw={yaw} pitch={pitch}></MouseCoordsHandler>
        {/* <UpdateMouseCoordsAndCameraPosition
          cameraPoint={cameraPoint}
          dir={dir}
          playerBody={body}
          targetPos={targetPos}
          desiredPos={desiredPos}
        ></UpdateMouseCoordsAndCameraPosition> */}
        <PlayerAnimationsController player={player}></PlayerAnimationsController>
        <SetPlayerPickUpObjectStatus></SetPlayerPickUpObjectStatus>
        <PlayerPickUpObjectHandler></PlayerPickUpObjectHandler>
        <PlayerThrowObjectHandler></PlayerThrowObjectHandler>
      </Suspense>
    </>
  );
};

export default memo(Player);
