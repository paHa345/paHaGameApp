import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { ReactThreeFiber, useFrame, useThree } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";

interface IChaseCameraProps {
  body: React.RefObject<RapierRigidBody | null>;
  yaw: React.RefObject<number>;
  pitch: React.RefObject<number>;
  _targetPos: THREE.Vector3;
  _rawLook: THREE.Vector3;
  smoothLook: React.RefObject<THREE.Vector3>;
  cameraInitialized: React.RefObject<boolean>;
}
const ChaseCamera = ({
  body,
  yaw,
  pitch,
  _targetPos,
  _rawLook,
  smoothLook,
  cameraInitialized,
}: IChaseCameraProps) => {
  const { camera } = useThree();
  const camDistance = useRef(2); // расстояние от игрока
  const baseHeight = useRef(2); // базовая высота камеры над игроком
  const posLerp = useRef(12); // скорость сглаживания позиции
  const gamePauseStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.gamePauseStatus,
  );

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
    const hDist = camDistance.current * Math.cos(pv);
    const vDist = camDistance.current * Math.sin(pv);

    _targetPos.set(
      bodyPos.x + Math.sin(y) * hDist,
      bodyPos.y + baseHeight.current + vDist,
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
      const t = 1 - Math.exp(-delta * posLerp.current);
      camera.position.lerp(_targetPos, t);
      smoothLook.current.lerp(_rawLook, t);
    }

    camera.lookAt(smoothLook.current);
  });
  return <></>;
};

export default ChaseCamera;
