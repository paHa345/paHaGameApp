import { AppDispatch } from "@/app/store";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import { useAnimations, useGLTF, useKeyboardControls, useTexture } from "@react-three/drei";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
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

const Player = () => {
  // const Scratches005Color = useTexture("./textures/Moss002/Moss002Color.jpg");

  // Scratches005Color.repeat.set(24, 1);
  // Scratches005Color.wrapS = THREE.RepeatWrapping;
  // Scratches005Color.wrapT = THREE.RepeatWrapping;

  // Scratches005Color.needsUpdate = true;

  const body = useRef<RapierRigidBody>(null);
  const cameraPoint = useRef<THREE.Mesh>(null);
  const userMain = useRef<THREE.Mesh>(null);
  const playerModelRef = useRef<THREE.Mesh>(null);
  const { rapier, world } = useRapier();
  const meshRef = useRef<THREE.Mesh>(null);

  const { gl } = useThree();

  const player = useGLTF("./models/characters/2/character-a.glb", true);
  for (const name in player.nodes) {
    player.nodes[name].castShadow = true;
  }
  // const playerTexture = useTexture("./models/characters/2/texture-a.png");
  // playerTexture.flipY = false;

  const gamePauseStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.gamePauseStatus,
  );

  const dispatch = useDispatch<AppDispatch>();
  const phase = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.phase,
  );

  const [subscribeKeys, getKeys] = useKeyboardControls();

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

  const jump = () => {
    if (!body.current) return;
    const origin = body.current.translation();
    origin.y -= 0.1;

    const direction = {
      x: 0,
      y: -1,
      z: 0,
    };

    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    if (hit === null) return;

    if (hit.timeOfImpact === undefined) return;

    if (hit.timeOfImpact < 0.15) {
      body.current?.applyImpulse(
        {
          x: 0,
          y: 6,
          z: 0,
        },
        true,
      );
    }
  };

  useEffect(() => {
    const unsubscribeJump = subscribeKeys(
      (state) => {
        return state.jump;
      },
      (value) => {
        if (value) {
          // dispatch(ReactThreeFiberGameActions.setJumpAnimation());
          jump();
        }
      },
    );

    const unsunscribleEscapeButton = subscribeKeys(
      (state) => {
        return state.escape;
      },
      (value) => {
        if (value) {
          dispatch(ReactThreeFiberGameActions.setGamePauseStatus());
        }
      },
    );

    const unsubscribeAny = subscribeKeys(() => {
      dispatch(ReactThreeFiberGameActions.start());
    });

    return () => {
      unsubscribeJump();
      unsunscribleEscapeButton();
      unsubscribeAny();
    };
  }, []);

  // useFrame((state, delta) => {
  //   if (gamePauseStatus) return;
  //   if (!body.current) return;

  //   const origin = body.current.translation();

  //   origin.y -= 0.1;

  //   const rayDirection = {
  //     x: 0,
  //     y: -1,
  //     z: 0,
  //   };

  //   const ray = new rapier.Ray(origin, rayDirection);
  //   const hit = world.castRay(ray, 10, true);

  //   /**
  //    * Controls
  //    */
  //   const { forward, backward, leftward, rightward } = getKeys();

  //   // set idle animation if player not move

  //   if (!forward && !backward && !leftward && !rightward && hit?.timeOfImpact === 0) {
  //     dispatch(ReactThreeFiberGameActions.setPlayerNotMove());
  //   }

  //   const moveDirectionVector = new THREE.Vector3(0, 0, 0);
  //   body.current.applyImpulse(moveDirectionVector, true);

  //   if (!playerModelRef.current) return;
  //   if (!forward && !backward) {
  //     playerModelRef.current.rotation.y = 0;
  //   }

  //   if (forward) {
  //     dispatch(ReactThreeFiberGameActions.setWalkAnimation());
  //     moveDirectionVector.set(
  //       origin.x - state.camera.position.x,
  //       0,
  //       origin.z - state.camera.position.z,
  //     );
  //   }

  //   if (rightward) {
  //     dispatch(ReactThreeFiberGameActions.setWalkAnimation());
  //     playerModelRef.current.rotation.y = -Math.PI / 8;

  //     moveDirectionVector.set(
  //       origin.x - state.camera.position.x,
  //       0,
  //       origin.z - state.camera.position.z,
  //     );

  //     moveDirectionVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(-90));
  //   }
  //   if (backward) {
  //     dispatch(ReactThreeFiberGameActions.setWalkAnimation());
  //     moveDirectionVector.set(
  //       origin.x - state.camera.position.x,
  //       0,
  //       origin.z - state.camera.position.z,
  //     );
  //     moveDirectionVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(180));

  //     //   .normalize();

  //     //   impulse.z += impulseStrength;
  //     //   torque.x += torqueStrength;
  //   }
  //   if (leftward) {
  //     dispatch(ReactThreeFiberGameActions.setWalkAnimation());
  //     // dispatch(ReactThreeFiberGameActions.setRotatePlayerModel(0.2));
  //     playerModelRef.current.rotation.y = Math.PI / 8;

  //     moveDirectionVector.set(
  //       origin.x - state.camera.position.x,
  //       0,
  //       origin.z - state.camera.position.z,
  //     );
  //     moveDirectionVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(90));
  //   }

  //   const normalizedDelta = delta * 60;

  //   body.current.applyImpulse(
  //     new THREE.Vector3(
  //       (moveDirectionVector.x / 12) * normalizedDelta,
  //       0,
  //       (moveDirectionVector.z / 12) * normalizedDelta,
  //     ),
  //     true,
  //   );

  //   /**
  //    * Поворот камеры по движению мыши в компоненте UpdateMouseCoordsAndCameraPosition
  //    */

  //   /**
  //    * Camera
  //    */

  //   const bodyPosition = body.current?.translation();

  //   /**
  //    * Phases
  //    */

  //   // if (bodyPosition.z < -(blockCounts * 4 + 2)) {
  //   //   dispatch(ReactThreeFiberGameActions.end());
  //   // }

  //   if (bodyPosition.y < -4) {
  //     dispatch(ReactThreeFiberGameActions.restart());
  //   }
  // });

  // переиспользуемые векторы — вне useFrame, через useMemo

  const camForward = useMemo(() => new THREE.Vector3(), []);
  const camRight = useMemo(() => new THREE.Vector3(), []);
  const UP = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const moveDir = useMemo(() => new THREE.Vector3(), []);

  const MAX_SPEED = 12; // максимальная скорость
  const ACCEL = 12; // скорость набора скорости, 1/сек
  const STEER_STRENGTH = 3;

  const _origin = new THREE.Vector3(0, 0, 0);
  const _up = new THREE.Vector3(0, 1, 0);
  const _targetQuat = new THREE.Quaternion();
  const _m4 = new THREE.Matrix4();
  const _currentQuat = new THREE.Quaternion();
  const _flipQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
  const lastAnim: any = useRef(null);
  function PlayerMove() {
    useFrame((state, delta) => {
      if (gamePauseStatus || !body.current || !playerModelRef.current) return;
      body.current.resetForces(false);
      // --- направление из yaw камеры ---
      state.camera.getWorldDirection(camForward);
      camForward.y = 0;
      camForward.normalize();

      camRight.crossVectors(camForward, UP).normalize();

      const { forward, backward, leftward, rightward } = getKeys();
      moveDir.set(0, 0, 0);
      if (forward) moveDir.add(camForward);
      if (backward) moveDir.sub(camForward);
      if (rightward) moveDir.add(camRight);
      if (leftward) moveDir.sub(camRight);

      const isMoving = moveDir.lengthSq() > 0;
      if (isMoving) moveDir.normalize();

      // это вариант с использованием приложения силы для движения

      const vel = body.current.linvel();
      const targetVX = isMoving ? moveDir.x * MAX_SPEED : 0;
      const targetVZ = isMoving ? moveDir.z * MAX_SPEED : 0;

      // Сила = масса × коэффициент × (желаемая скорость − текущая)
      const mass = body.current.mass();
      const forceX = mass * STEER_STRENGTH * (targetVX - vel.x);
      const forceZ = mass * STEER_STRENGTH * (targetVZ - vel.z);

      body.current.addForce({ x: forceX, y: 0, z: forceZ }, true);

      // // --- управление скоростью через setLinvel (FPS-независимо) ---
      // const vel = body.current.linvel();
      // const targetVX = isMoving ? moveDir.x * MAX_SPEED : 0;
      // const targetVZ = isMoving ? moveDir.z * MAX_SPEED : 0;

      // // экспоненциальное сглаживание: k не зависит от FPS
      // const k = 1 - Math.exp(-ACCEL * delta);
      // const newVX = vel.x + (targetVX - vel.x) * k;
      // const newVZ = vel.z + (targetVZ - vel.z) * k;

      // body.current?.setLinvel({ x: newVX, y: vel.y, z: newVZ }, true);

      // --- анимация: dispatch только при смене состояния ---
      const nextAnim = isMoving ? "walk" : "idle";
      if (lastAnim.current !== nextAnim) {
        lastAnim.current = nextAnim;
        dispatch(
          isMoving
            ? ReactThreeFiberGameActions.setWalkAnimation()
            : ReactThreeFiberGameActions.setPlayerNotMove(),
        );
      }

      // Поворачиваем модель к направлению движения
      // lookAt строит матрицу, у которой -Z смотрит в moveDir
      if (isMoving) {
        _m4.lookAt(_origin, moveDir, _up);
        _targetQuat.setFromRotationMatrix(_m4);
        _targetQuat.multiply(_flipQuat);

        const r = body.current.rotation();
        _currentQuat.set(r.x, r.y, r.z, r.w);
        _currentQuat.slerp(_targetQuat, 1 - Math.exp(-delta * 12));
        body.current.setRotation(_currentQuat, true);
      }

      // --- рестарт при падении ---
      const t = body.current.translation();
      if (t.y < -4) dispatch(ReactThreeFiberGameActions.restart());
    });

    return null;
  }

  const yaw = useRef(0); // поворот камеры по горизонтали
  const pitch = useRef(0); // наклон камеры (0 = горизонтально, >0 = смотрим сверху)
  const _targetPos = new THREE.Vector3();
  const camDistance = 2; // расстояние от игрока
  const baseHeight = 2; // базовая высота камеры над игроком
  const posLerp = 12; // скорость сглаживания позиции

  const smoothLook = useRef(new THREE.Vector3());
  const cameraInitialized = useRef(false);
  const _rawLook = new THREE.Vector3();

  function ChaseCamera() {
    const { camera } = useThree();

    useFrame((state, delta) => {
      if (gamePauseStatus) {
        state.camera.position.set(0, 10, 0);
        cameraInitialized.current = false; // при возобновлении — снапнемся заново
        return;
      }
      if (!body.current) return;
      const bodyPos = body.current.translation();
      if (!bodyPos) return;

      const y = yaw.current;
      const pv = pitch.current;
      const hDist = camDistance * Math.cos(pv);
      const vDist = camDistance * Math.sin(pv);

      _targetPos.set(
        bodyPos.x + Math.sin(y) * hDist,
        bodyPos.y + baseHeight + vDist,
        bodyPos.z + Math.cos(y) * hDist,
      );

      // Смотрим чуть выше центра тела — иначе обзор "в ноги"
      _rawLook.set(bodyPos.x, bodyPos.y + 1.5, bodyPos.z);

      if (!cameraInitialized.current) {
        // Первый кадр — снап, иначе камера летит из (0,0,0)
        camera.position.copy(_targetPos);
        smoothLook.current.copy(_rawLook);
        cameraInitialized.current = true;
      } else {
        const t = 1 - Math.exp(-delta * posLerp);
        camera.position.lerp(_targetPos, t);
        smoothLook.current.lerp(_rawLook, t);
      }

      camera.lookAt(smoothLook.current);
    });
    return null;
  }

  function SetMouseCoords() {
    useEffect(() => {
      const canvas = gl.domElement;

      const handleMouseMove = (e: MouseEvent) => {
        if (document.pointerLockElement && document) {
          const mouseVector = {
            x: (e.movementX / canvas.height) * 2,
            y: (e.movementY / canvas.width) * 2,
          };
          yaw.current = yaw.current - mouseVector.x;
          pitch.current = pitch.current + mouseVector.y;
        }
      };

      canvas.addEventListener("mousemove", handleMouseMove);
      return () => {
        canvas.removeEventListener("mousemove", handleMouseMove);
      };
    }, [gl]);
    return null;
  }

  return (
    <>
      <Suspense fallback={null}>
        <mesh ref={userMain}>
          <mesh ref={cameraPoint}>
            <mesh position={[0, 8, 0]} rotation-x={-Math.PI / 2}>
              {gamePauseStatus && <GameMenu></GameMenu>}
            </mesh>
          </mesh>
          <RigidBody
            userData={{ type: "player", id: "player" }}
            ref={body}
            position={[0, 0.75, 0]}
            // colliders="ball"
            colliders={false}
            restitution={0}
            linearDamping={0.1}
            angularDamping={0.5}
            friction={1}
            type="dynamic"
            enabledRotations={[false, true, false]}
          >
            <CuboidCollider mass={1} position={[0, 0.6, 0]} args={[0.4, 0.6, 0.35]}>
              <group
              // rotation-y={rotationPlayerModel}
              >
                <primitive
                  ref={playerModelRef}
                  position={[0, -0.6, 0]}
                  object={player.scene}
                  scale={0.4}
                  castShadow
                  dispose={null}
                >
                  {/* <meshBasicMaterial map={playerTexture} /> */}
                </primitive>

                {createPortal(<RightHandWeapon></RightHandWeapon>, player.nodes["arm-right"])}
                {createPortal(<LeftHandShield></LeftHandShield>, player.nodes["arm-left"])}
              </group>
            </CuboidCollider>
          </RigidBody>
        </mesh>
        <ChaseCamera></ChaseCamera>
        <SetMouseCoords></SetMouseCoords>
        <PlayerMove></PlayerMove>
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
