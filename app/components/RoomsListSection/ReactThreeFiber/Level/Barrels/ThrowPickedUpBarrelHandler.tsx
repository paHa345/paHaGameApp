import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";

interface IThrowPickedUpBarrelProps {
  instancedRapierBodies: React.RefObject<RapierRigidBody[]>;
}

const ThrowPickedUpBarrelHandler = ({ instancedRapierBodies }: IThrowPickedUpBarrelProps) => {
  const throwStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerThrowBarrelStatus,
  );

  const pickedUpBarrel = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerPickedUpBarrel,
  );

  const player = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerBodyRef,
  );

  const thrownRef = useRef(false);
  const pendingThrowRef = useRef(false);

  useEffect(() => {
    if (!throwStatus) {
      thrownRef.current = false;
      pendingThrowRef.current = false;
      return;
    }

    if (thrownRef.current) return;
    thrownRef.current = true;

    const body = instancedRapierBodies.current?.[pickedUpBarrel.index];
    if (!body) return;

    // ✅ Меняем тип и массу
    body.setBodyType(0, true);
    body.wakeUp();

    // ✅ Откладываем импульс на следующий кадр
    pendingThrowRef.current = true;
  }, [throwStatus]);

  useFrame(() => {
    if (!pendingThrowRef.current) return;

    const body = instancedRapierBodies.current?.[pickedUpBarrel.index];
    if (!body) return;
    if (!player) return;
    const r = player.rotation();
    const quat = new THREE.Quaternion(r.x, r.y, r.z, r.w);
    const impulse = new THREE.Vector3(0, 1, 5);
    impulse.applyQuaternion(quat); // Поворачиваем в мировые координаты

    body.applyImpulse(impulse, true);
    pendingThrowRef.current = false;
  });

  return <></>;
};

export default ThrowPickedUpBarrelHandler;
