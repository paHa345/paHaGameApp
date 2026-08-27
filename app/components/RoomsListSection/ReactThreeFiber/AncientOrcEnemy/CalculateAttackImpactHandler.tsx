import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { RapierRigidBody } from "@react-three/rapier";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";
import { useRapier, vec3 } from "@react-three/rapier";

import * as rapier from "@dimforge/rapier3d-compat";
import { AppDispatch } from "@/app/store";

interface ICalculateAttack {
  id: string;
  currentTarget: React.RefObject<RapierRigidBody | null>;
}

const CalculateAttackImpactHandler = ({ id, currentTarget }: ICalculateAttack) => {
  const dispatch = useDispatch<AppDispatch>();
  const { world } = useRapier();

  const enemyHitStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.enemyNPCData[id].hitStatus,
  );

  const playerBodyRef = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerBodyRef,
  );

  useEffect(() => {
    if (enemyHitStatus) {
      if (!currentTarget.current) return;
      // Координаты NPC, центр масс
      const NPCCenterBody = vec3({
        x: currentTarget.current.translation().x,
        y: currentTarget.current.translation().y,
        z: currentTarget.current.translation().z,
      });

      // Поднимаем точку запуска луча на 0,5 метра вверх
      NPCCenterBody.add(new THREE.Vector3(0, 1, 0).multiplyScalar(0.5));

      // Получаем угол поворота NPC
      const NPCRotation = currentTarget.current.rotation();
      const quat = new THREE.Quaternion(NPCRotation.x, NPCRotation.y, NPCRotation.z, NPCRotation.w);

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

      // Получаем направление луча, который направлен прямо от модели NPC
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
          // получаем позицию игрока и этого врага
          const NPCPos = currentTarget.current.translation();
          const enemyPos = playerBodyRef?.translation();
          if (!enemyPos) return;
          // Высчитываем направление вектора от игрока к врагу
          const direction = new THREE.Vector3()
            .copy(enemyPos)
            .sub(new THREE.Vector3(NPCPos.x, NPCPos.y - 0.5, NPCPos.z))
            .normalize();
          // Направляем импульс по данному вектору, который отталкивает игрока
          playerBodyRef?.setLinvel(direction.multiplyScalar(8), true);
        }
      }
    }
  }, [enemyHitStatus]);

  return <></>;
};

export default CalculateAttackImpactHandler;
