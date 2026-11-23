import { AppDispatch } from "@/app/store";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, useRapier } from "@react-three/rapier";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";

interface IPlayerMoveControllerProps {
  playerModelRef: React.RefObject<THREE.Mesh<
    THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>,
    THREE.Material | THREE.Material[],
    THREE.Object3DEventMap
  > | null>;
  body: React.RefObject<RapierRigidBody | null>;
  camForward: THREE.Vector3;
  camRight: THREE.Vector3;
  upDirection: THREE.Vector3;
  moveDir: THREE.Vector3;
  lastAnim: any;
  _origin: THREE.Vector3;
  _targetQuat: THREE.Quaternion;
  _m4: THREE.Matrix4;
  _flipQuat: THREE.Quaternion;
  _currentQuat: THREE.Quaternion;
}

const PlayerMoveController = ({
  playerModelRef,
  body,
  camForward,
  camRight,
  upDirection,
  moveDir,
  lastAnim,
  _m4,
  _flipQuat,
  _currentQuat,
  _origin,
  _targetQuat,
}: IPlayerMoveControllerProps) => {
  const gamePauseStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.gamePauseStatus,
  );
  const MAX_SPEED = useRef(12); // максимальная скорость
  const ACCEL = useRef(12); // скорость набора скорости, 1/сек
  const STEER_STRENGTH = useRef(3);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();

  const dispatch = useDispatch<AppDispatch>();

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
          y: 4,
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

  useFrame((state, delta) => {
    if (gamePauseStatus || !body.current || !playerModelRef.current) return;
    body.current.resetForces(false);
    // --- направление из yaw камеры ---
    state.camera.getWorldDirection(camForward);
    camForward.y = 0;
    camForward.normalize();

    camRight.crossVectors(camForward, upDirection).normalize();

    moveDir.set(0, 0, 0);
    const { forward, backward, leftward, rightward } = getKeys();

    if (forward) moveDir.add(camForward);
    if (backward) moveDir.sub(camForward);
    if (rightward) moveDir.add(camRight);
    if (leftward) moveDir.sub(camRight);

    const isMoving = moveDir.lengthSq() > 0;
    if (isMoving) moveDir.normalize();

    // это вариант с использованием приложения силы для движения

    const vel = body.current.linvel();
    const targetVX = isMoving ? moveDir.x * MAX_SPEED.current : 0;
    const targetVZ = isMoving ? moveDir.z * MAX_SPEED.current : 0;

    // Сила = масса × коэффициент × (желаемая скорость − текущая)
    const mass = body.current.mass();
    const forceX = mass * STEER_STRENGTH.current * (targetVX - vel.x);
    const forceZ = mass * STEER_STRENGTH.current * (targetVZ - vel.z);

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
      _m4.lookAt(_origin, moveDir, upDirection);
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
  return <></>;
};

export default PlayerMoveController;
