import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";

interface IUpdateMouseCoordsAndCameraPosition {
  playerBody: React.RefObject<RapierRigidBody | null>;
  targetPos: React.RefObject<THREE.Vector3>;
  dir: React.RefObject<THREE.Vector3>;
  desiredPos: React.RefObject<THREE.Vector3>;
  cameraPoint: React.RefObject<THREE.Mesh<
    THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>,
    THREE.Material | THREE.Material[],
    THREE.Object3DEventMap
  > | null>;
}

const UpdateMouseCoordsAndCameraPosition = ({
  playerBody,
  targetPos,
  dir,
  desiredPos,
  cameraPoint,
}: IUpdateMouseCoordsAndCameraPosition) => {
  // Rotate to camera helper vectors
  const direction = new THREE.Vector3();
  const targetQuaternion = new THREE.Quaternion();
  const lookAtVector = new THREE.Vector3(0, 0, -1);
  const distance = useRef(1);

  const mouseCoords = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.mouseCoords,
  );

  const cameraRotationStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.cameraRotationStatus,
  );

  const gamePauseStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.gamePauseStatus,
  );

  useFrame((state) => {
    // console.log(mouseCoords);
    if (gamePauseStatus) {
      state.camera.position.set(0, 10, 0);
      return;
    }

    if (playerBody.current === null) return;
    /**
     * Поворот камеры по движению мыши
     */
    // 1. Получаем позицию камеры
    const translation = playerBody.current.translation();
    targetPos.current.set(translation.x, translation.y, translation.z);
    // 2. Вычисляем вектор направления камеры
    //устанавливаем в direction координаты вектора камеры
    // direction.set(state.pointer.x * -1.9, 1, state.pointer.y * 2);
    const coords = new THREE.Vector2(mouseCoords.x, mouseCoords.y);
    coords.normalize();
    const eulerAngles = new THREE.Euler(mouseCoords.x, 0, 0, "XYZ");
    const vector = new THREE.Vector3(1, 1, 1);
    const rotatedVector = vector.applyEuler(eulerAngles);
    rotatedVector.normalize();
    direction.set(rotatedVector.y, 2, rotatedVector.z);
    // Нормализуем, чтобы получить чистое направление
    if (direction.length() < 0.001) return;
    // устанавливаем значение y=0 для поворота игрока только влево-вправо
    direction.y = 0;
    direction.normalize();
    // 3. Создаем кватернион, который поворачивает стандартный вектор (0,0,-1)
    // в сторону нашего вектора direction
    targetQuaternion.setFromUnitVectors(lookAtVector, direction);
    // 4. Поворачиваем игрока в нужную сторону
    // Это сообщает физическому движку: "В этом кадре поверни тело именно так".
    playerBody.current.setRotation(targetQuaternion, true);
    dir.current.set(0, 2, -distance.current - 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), 0); // базовый offset
    const q = playerBody.current.rotation();
    const rotatQuat = new THREE.Quaternion(q.x, q.y, q.z, q.w);

    if (cameraRotationStatus) {
      rotatQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 3);
    }

    dir.current.applyQuaternion(rotatQuat);
    desiredPos.current.copy(targetPos.current).add(dir.current);
    state.camera.position.lerp(desiredPos.current, 0.15);
    // state.camera.position.set(desiredPos.current.x, desiredPos.current.y, desiredPos.current.z);
    // dispatch(ReactThreeFiberGameActions.setCameraPosition(desiredPos.current));
    if (!cameraPoint.current) return;
    state.camera.lookAt(
      new THREE.Vector3(targetPos.current.x, targetPos.current.y + 1.5, targetPos.current.z),
    );
    /**
     *
     */
    state.camera.updateMatrixWorld();
  });

  return (
    <>
      <mesh></mesh>
    </>
  );
};

export default UpdateMouseCoordsAndCameraPosition;
