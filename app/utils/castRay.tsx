import { vec3 } from "@react-three/rapier";
import * as THREE from "three";
import * as rapier from "@dimforge/rapier3d-compat"; // или '@rapier3d', зависит от версии

interface ICastRayFromUserPropps {
  playerPosition: {
    x: number;
    y: number;
    z: number;
  };
  playerRotation: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  moveUpRay: number;

  moveForwardRay: number;
}

export const castRayFromUser = ({
  playerPosition,
  playerRotation,
  moveUpRay,
  moveForwardRay,
}: ICastRayFromUserPropps) => {
  // Координаты игрока, центр масс
  const playerCenterBody = vec3({
    x: playerPosition.x,
    y: playerPosition.y,
    z: playerPosition.z,
  });

  // Поднимаем точку запуска луча на 0,5 метра вверх
  playerCenterBody.add(new THREE.Vector3(0, 1, 0).multiplyScalar(moveUpRay));

  // Получаем угол поворота игрока
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
  const newQuat = quat.clone().multiply(deltaQuat);
  // Получаем направление луча, который направлен прямо от модели игрока
  const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(newQuat);

  // Немного смещаем начальную точку луча, чтобы он не шёл из модели
  // а немного перед ней
  playerCenterBody.add(direction.clone().multiplyScalar(moveForwardRay));

  // Получаем луч, который идёт из вычисленной точки по заданному направлению вперёд
  const ray = new rapier.Ray(playerCenterBody, direction);
  return ray;
};
