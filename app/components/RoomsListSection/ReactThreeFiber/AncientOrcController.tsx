import { AppDispatch } from "@/app/store";
import {
  IReactThreeFiberGameSlice,
  NPCAttackHandler,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import { conditionPatternStatus } from "@/app/types";
import { Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";
import { useRapier, vec3 } from "@react-three/rapier";

import * as rapier from "@dimforge/rapier3d-compat";

interface IAncientOrcController {
  currentTarget: React.RefObject<RapierRigidBody | null>;
  id: string;
  rotationTimer: number;
}

const AncientOrcController = ({ currentTarget, id, rotationTimer }: IAncientOrcController) => {
  const playerBodyRef = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerBodyRef,
  );

  const currentObjConditionPatternStatus = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.enemyNPCData[id].conditionPatternStatus,
  );
  const currentObjAttackStatus = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.enemyNPCData[id].attackStatus,
  );

  const currentQuat = new THREE.Quaternion();
  const startQuat = new THREE.Quaternion();
  const data = useThree();
  const tempQuat = useRef(new THREE.Quaternion()).current;
  const [restInterval, setRestInterval] = useState(10);
  const [restStatus, setRestStatus] = useState(false);

  let timer = rotationTimer;

  const corners = useRef<THREE.Vector3[]>([]).current;
  const lookDir = new THREE.Vector3();

  const dispatch = useDispatch<AppDispatch>();
  const { world } = useRapier();

  const rotateToPlayer = () => {
    /**
     * Поворот в сторону игрока, который попал в зону видимости
     */

    if (!currentTarget.current) return;

    const playerCoords = playerBodyRef?.translation();
    if (!playerCoords) return;

    const directionFromCurrentToPlayer = new THREE.Vector3()
      .fromArray([playerCoords.x, 0, playerCoords.z])
      .sub(currentTarget.current.translation())
      .normalize();

    const rotationQuaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      directionFromCurrentToPlayer,
    );

    const currentOrcBody = currentTarget.current.rotation();

    const smoothRotationQuaternion = new THREE.Quaternion().slerpQuaternions(
      new THREE.Quaternion(currentOrcBody.x, currentOrcBody.y, 0, currentOrcBody.w),
      rotationQuaternion,
      0.08,
    );
    currentTarget.current.setRotation(smoothRotationQuaternion, true);
  };

  function startRotation() {
    /**
     * Поворот при мирном режиме
     */
    if (!currentTarget.current) return;
    // 1. Получаем кватернион из Rapier-тела
    const rapierQuat = currentTarget.current.rotation();
    // 2. Конвертируем в Three.js Quaternion
    startQuat.set(rapierQuat.x, rapierQuat.y, 0, rapierQuat.w);
    const rotate90Y = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, Math.PI, 0, "XYZ"), // 90 градусов = PI/2 радиан
    );
    // 3. Создаем кватернион на который будем поворачивать
    tempQuat.multiplyQuaternions(startQuat, rotate90Y);
  }

  useEffect(() => {
    const animateZombie = setInterval(() => {
      if (timer < data.clock.getElapsedTime()) {
        timer = data.clock.getElapsedTime() + rotationTimer;

        if (currentObjConditionPatternStatus === conditionPatternStatus.Peaceful) {
          startRotation();
        }
      }
      if (
        data.clock.getElapsedTime() > restInterval &&
        (currentObjConditionPatternStatus === conditionPatternStatus.Peaceful ||
          currentObjConditionPatternStatus === conditionPatternStatus.Rest)
      ) {
        if (!restStatus && !currentObjAttackStatus) {
          setRestInterval(data.clock.getElapsedTime() + Math.floor(Math.random() * 8) + 5);
          setRestStatus(true);
          dispatch(
            ReactThreeFiberGameActions.setCurrentEnemyAnimationName({
              id: id,
              animationName: "idle",
            }),
          );
        }
        if (restStatus && !currentObjAttackStatus) {
          setRestInterval(data.clock.getElapsedTime() + Math.floor(Math.random() * 8) + 15);
          setRestStatus(false);
          dispatch(
            ReactThreeFiberGameActions.setCurrentEnemyAnimationName({
              id: id,
              animationName: "walk",
            }),
          );
        }
      }
    }, 1000);

    return () => clearTimeout(animateZombie);
  });

  useEffect(() => {
    const calculateViewArea = setInterval(() => {
      const center = new THREE.Vector3(
        currentTarget.current?.translation().x,
        currentTarget.current?.translation().y,
        currentTarget.current?.translation().z,
      );

      const quat = currentTarget.current?.rotation();
      if (!quat) return;

      const forwardPos = new THREE.Vector3(0, 0, 1);
      forwardPos.applyQuaternion(quat);
      const right = new THREE.Vector3(1, 0, 0);
      right.applyQuaternion(quat);

      const halfSize = 2;

      // Вычисляем 4 угла квадрата (плоскость перпендикулярна forward)
      corners[0] = center
        .clone()
        .add(forwardPos.clone().multiplyScalar(halfSize - 2))
        .add(right.clone().multiplyScalar(-halfSize)); // левый ближний
      corners[1] = center
        .clone()
        .add(forwardPos.clone().multiplyScalar(halfSize - 2))
        .add(right.clone().multiplyScalar(halfSize)); // правый ближний
      corners[2] = center
        .clone()
        .add(forwardPos.clone().multiplyScalar(halfSize * 4))
        .add(right.clone().multiplyScalar(halfSize + 4)); // правый дальний (если нужно вытянуть)
      corners[3] = center
        .clone()
        .add(forwardPos.clone().multiplyScalar(halfSize * 4))
        .add(right.clone().multiplyScalar(-halfSize - 4)); // левый дальний

      const playerCoords = playerBodyRef?.translation();
      if (!playerCoords) return;

      const playerInOrcViewArea =
        pointInTriangle2D(
          playerCoords?.x,
          playerCoords?.z,
          corners[0].x,
          corners[0].z,
          corners[1].x,
          corners[1].z,
          corners[3].x,
          corners[3].z,
        ) ||
        pointInTriangle2D(
          playerCoords?.x,
          playerCoords?.z,
          corners[1].x,
          corners[1].z,
          corners[2].x,
          corners[2].z,
          corners[3].x,
          corners[3].z,
        );

      if (
        playerInOrcViewArea &&
        currentObjConditionPatternStatus !== conditionPatternStatus.Agressive &&
        !currentObjAttackStatus
      ) {
        dispatch(
          ReactThreeFiberGameActions.setCurrentEnemyConditionStatus({
            id: id,
            conditionPatternStatus: conditionPatternStatus.Agressive,
          }),
        );
        dispatch(
          ReactThreeFiberGameActions.setCurrentEnemyAnimationName({
            id: id,
            animationName: "walk",
          }),
        );
        setRestStatus(false);
      }
      if (
        !playerInOrcViewArea &&
        currentObjConditionPatternStatus !== conditionPatternStatus.Peaceful &&
        !currentObjAttackStatus
      ) {
        dispatch(
          ReactThreeFiberGameActions.setCurrentEnemyConditionStatus({
            id: id,
            conditionPatternStatus: conditionPatternStatus.Peaceful,
          }),
        );
        dispatch(
          ReactThreeFiberGameActions.setCurrentEnemyAnimationName({
            id: id,
            animationName: "walk",
          }),
        );
        setRestStatus(false);
      }
      if (playerInOrcViewArea) {
        if (!currentTarget.current) return;
        // Координаты игрока, центр масс
        const NPCCenterBody = vec3({
          x: currentTarget.current.translation().x,
          y: currentTarget.current.translation().y,
          z: currentTarget.current.translation().z,
        });

        // Поднимаем точку запуска луча на 0,5 метра вверх
        NPCCenterBody.add(new THREE.Vector3(0, 1, 0).multiplyScalar(0.5));

        // Получаем угол поворота игрока
        const NPCRotation = currentTarget.current.rotation();
        const quat = new THREE.Quaternion(
          NPCRotation.x,
          NPCRotation.y,
          NPCRotation.z,
          NPCRotation.w,
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
        NPCCenterBody.add(direction.clone().multiplyScalar(0.4));

        // Получаем луч, который идёт из вычисленной точки по заданному направлению вперёд
        const ray = new rapier.Ray(NPCCenterBody, direction);

        // Запускаем этот луч с установленной длинной
        const hit = world.castRay(ray, 2, true);
        // console.log(hit);
        if (hit !== null) {
          // Определяем в какой объект попал луч
          const collider = hit.collider;
          if (!collider) return;
          const underAttackObjectData = collider.parent()?.userData as { id: string; type: string };
          if (!underAttackObjectData) return;
          // Если он попал в NPC-врага
          if (underAttackObjectData.type === "player") {
            dispatch(NPCAttackHandler({ id: id }));

            // // получаем позицию игрока и этого врага
            // const NPCPos = currentTarget.current.translation();
            // const enemyPos = playerBodyRef?.translation();
            // if (!enemyPos) return;
            // // Высчитываем направление вектора от игрока к врагу
            // const direction = new THREE.Vector3()
            //   .copy(enemyPos)
            //   .sub(new THREE.Vector3(NPCPos.x, NPCPos.y - 0.2, NPCPos.z))
            //   .normalize();
            // // Направляем импульс по данному вектору, который отталкивает врага
            // playerBodyRef?.setLinvel(direction.multiplyScalar(8), true);
          }
        }
      }
    }, 300);

    return () => clearTimeout(calculateViewArea);
  });

  const pointInTriangle2D = (
    pointX: number,
    pointZ: number,
    aX: number,
    aZ: number,
    bX: number,
    bZ: number,
    cX: number,
    cZ: number,
  ): boolean => {
    const d1 = sign(pointX, pointZ, aX, aZ, bX, bZ);
    const d2 = sign(pointX, pointZ, bX, bZ, cX, cZ);
    const d3 = sign(pointX, pointZ, cX, cZ, aX, aZ);

    if (d1 < 0 || d2 < 0 || d3 < 0) {
      return false;
    } else {
      return true;
    }
  };

  const sign = (px: number, py: number, x1: number, y1: number, x2: number, y2: number): number => {
    return (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
  };

  const points = [
    corners[0],
    corners[1],
    corners[2],
    corners[3],
    corners[0], // замыкаем контур
  ];

  useFrame((state, delta) => {
    if (!currentTarget.current) return;

    if (
      !currentTarget.current
      // || !meshRef.current
    )
      return;

    if (restStatus) return;

    if (
      (currentObjConditionPatternStatus === conditionPatternStatus.Peaceful ||
        currentObjConditionPatternStatus === conditionPatternStatus.Agressive) &&
      !currentObjAttackStatus
    ) {
      // if (tempQuat.angleTo(currentQuat) > 0.001) {

      /**
       * Поворот в мирном режиме
       */

      const rapierQuat = currentTarget.current.rotation();
      currentQuat.set(rapierQuat.x, rapierQuat.y, rapierQuat.z, rapierQuat.w);
      currentQuat.slerp(tempQuat, delta);
      currentTarget.current.setRotation(currentQuat, true);

      /**
       * Движение в сторону направления взгляда в мирном и агрессивном режимах
       */

      // if (!zombie1Ref.current) return;
      const rotationQuat = new THREE.Quaternion(
        currentTarget.current.rotation().x,
        currentTarget.current.rotation().y,
        currentTarget.current.rotation().z,
        currentTarget.current.rotation().w,
      );

      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyQuaternion(rotationQuat); // повернём вектор вперёд на ориентацию тела
      lookDir.copy(forward).normalize();
      const normalizedDelta = delta * 60;

      currentTarget.current.applyImpulse(
        new THREE.Vector3(
          -lookDir.x * 0.19 * normalizedDelta,
          0,
          -lookDir.z * 0.19 * normalizedDelta,
        ),
        true,
      );
      // }
    }
    if (currentObjConditionPatternStatus === conditionPatternStatus.Agressive) {
      /**
       * Поворотв сторону игрока в агрессивном режиме
       */
      rotateToPlayer();
    }
  });

  return (
    <>
      <Line points={points} color="red" linewidth={1} />
    </>
  );
};

export default AncientOrcController;
