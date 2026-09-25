import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";

interface IBarrelPickedUpProps {
  instancedRapierBodies: React.RefObject<RapierRigidBody[]>;
}

const BarrelPickedUpMoveHandler = ({ instancedRapierBodies }: IBarrelPickedUpProps) => {
  const player = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerBodyRef,
  );
  const pickedUpBarrel = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerPickedUpBarrel,
  );

  const barrelsArr = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.barrelsArr,
  );

  useEffect(() => {
    if (!pickedUpBarrel.id) return;

    if (!instancedRapierBodies.current[pickedUpBarrel.index]) return;
    instancedRapierBodies.current[pickedUpBarrel.index].setBodyType(2, true);
  });

  useFrame(() => {
    if (!pickedUpBarrel.id) return;

    if (!player) return;
    if (!instancedRapierBodies.current) return;
    const body = instancedRapierBodies.current[pickedUpBarrel.index];
    if (!body) return;
    const playerPos = player?.translation();
    const playerQuat = player?.rotation();
    if (!playerPos) return;
    /**
     * Смещаем искры немного вперёд и влевоо (localOffset) относительно модели игрока
     * при этом учитываем поворот модели
     * чтобы правильно рассчитать смещение
     */
    const point = new THREE.Vector3(playerPos.x, playerPos.y, playerPos.z);
    const quat = new THREE.Quaternion(playerQuat.x, playerQuat.y, playerQuat.z, playerQuat.w);
    const localOffset = new THREE.Vector3(0, 0.5, 1.3);
    localOffset.applyQuaternion(quat);
    const newPoint = point.clone().add(localOffset);
    body.setTranslation(newPoint, true);
  });
  return <></>;
};

export default BarrelPickedUpMoveHandler;
