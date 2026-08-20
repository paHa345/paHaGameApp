import { AppDispatch } from "@/app/store";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import { useThree } from "@react-three/fiber";
import { useRapier, vec3 } from "@react-three/rapier";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";
import * as rapier from "@dimforge/rapier3d-compat"; // или '@rapier3d', зависит от версии
import { Line } from "@react-three/drei";

const AttackPlayerHandler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const playerAttackStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerAttackStatus,
  );

  const player = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerBodyRef,
  );

  const { world } = useRapier();

  function DrawLine() {
    if (!player) return;

    const playerCenterBody = vec3({
      x: player.translation().x,
      y: player.translation().y,
      z: player.translation().z,
    });

    // Поднимаем точку запуска луча на 0,5 метра вверх
    playerCenterBody.add(new THREE.Vector3(0, 1, 0).multiplyScalar(0.5));

    // Получаем угол поворота игрока
    const playerRotation = player.rotation();
    const quat = new THREE.Quaternion(
      playerRotation.x,
      playerRotation.y,
      playerRotation.z,
      playerRotation.w,
    );

    /**
     * Поворачиваем этот угол поворота на 180 градусов,
     * у нас модель изначально развернута задом наперёд
     */

    // тут угол поворота на 180 градусов по вертикали
    const deltaQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    // прибавляем 180 град по вертикали к повороту модели
    const newQuat = quat.multiply(deltaQuat);

    // Получаем направление луча, который направлен прямо от модели игрока
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(newQuat);

    // Немного смещаем начальную точку луча, чтобы он не шёл из модели
    // а немного перед ней
    playerCenterBody.add(direction.clone().multiplyScalar(0.4));

    const points = [
      playerCenterBody.x,
      playerCenterBody.y,
      playerCenterBody.z,
      playerCenterBody.x + direction.x * 2,
      playerCenterBody.y + direction.y * 2,
      playerCenterBody.z + direction.z * 2,
    ];
    return (
      <Line points={points}>
        <lineBasicMaterial color="red" linewidth={10} />
      </Line>
    );
  }

  useEffect(() => {
    if (!player) return;

    /**
     * При ударе запускается луч
     */

    if (playerAttackStatus) {
      // Координаты игрока, центр масс
      const playerCenterBody = vec3({
        x: player.translation().x,
        y: player.translation().y,
        z: player.translation().z,
      });

      // Поднимаем точку запуска луча на 0,5 метра вверх
      playerCenterBody.add(new THREE.Vector3(0, 1, 0).multiplyScalar(0.5));

      // Получаем угол поворота игрока
      const playerRotation = player.rotation();
      const quat = new THREE.Quaternion(
        playerRotation.x,
        playerRotation.y,
        playerRotation.z,
        playerRotation.w,
      );

      /**
       * Поворачиваем этот угол поворота на 180 градусов,
       * у нас модель изначально развернута задом наперёд
       */

      // тут угол поворота на 180 градусов по вертикали
      const deltaQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI,
      );
      // прибавляем 180 град по вертикали к повороту модели
      const newQuat = quat.multiply(deltaQuat);

      // Получаем направление луча, который направлен прямо от модели игрока
      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(newQuat);

      // Немного смещаем начальную точку луча, чтобы он не шёл из модели
      // а немного перед ней
      playerCenterBody.add(direction.clone().multiplyScalar(0.4));

      // Получаем луч, который идёт из вычисленной точки по заданному направлению вперёд
      const ray = new rapier.Ray(playerCenterBody, direction);

      // Запускаем этот луч с установленной длинной
      const hit = world.castRay(ray, 2, false);
      console.log(hit);

      setTimeout(() => {
        dispatch(ReactThreeFiberGameActions.setPlayerEndAttack());
      }, 500);
    }
  }, [playerAttackStatus]);

  return (
    <>
      <DrawLine></DrawLine>
    </>
  );
};

export default AttackPlayerHandler;
