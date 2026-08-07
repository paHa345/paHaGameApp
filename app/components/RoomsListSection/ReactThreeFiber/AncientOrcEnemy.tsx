import { Clone, Line, useAnimations, useGLTF } from "@react-three/drei";
import { ObjectMap, useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { GLTF } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import { useDispatch, useSelector } from "react-redux";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import { AppDispatch } from "@/app/store";
import { Api } from "@react-three/postprocessing";
import { conditionPatternStatus } from "@/app/types";

interface IAncientOrcProps {
  position: {
    x: number;
    y: number;
    z: number;
  };
  //   zombieModel: THREE.Group<THREE.Object3DEventMap>;
  id: string;
  rotationTimer: number;
  //   animations: any
  //   model: any;
  modelAnimationState: string;
}

const AncientOrc = ({
  position,
  //   zombieModel,
  id,
  rotationTimer,
  //   animations,
  //   model,
  modelAnimationState,
}: IAncientOrcProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentTarget = useRef<RapierRigidBody>(null);
  const { world } = useRapier();

  const corners = useRef<THREE.Vector3[]>([]).current;

  const { scene, animations, nodes } = useGLTF("./models/characters/2/character-o.glb", true);
  for (const name in nodes) {
    nodes[name].castShadow = true;
  }

  const currentObjConditionPatternStatus = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.enemyNPCData[id].conditionPatternStatus,
  );

  const [lastSeenPlayerCoords, setLastSeenPlayerCoords] = useState<THREE.Vector3 | null>(null);

  const cloneModel = useMemo(() => scene.clone(), [scene]);

  // const clonedScene = useMemo(() => {
  //   const cloned = scene.clone();
  //   // Глубоко клонируем все зависимые объекты
  //   cloned.traverse((child: any) => {
  //     if (child.isMesh) {
  //       child.material = child.material.clone();
  //     }
  //   });
  //   return cloned;
  // }, [scene]);

  const { actions } = useAnimations(animations, cloneModel);

  actions["walk"]?.play();
  //    actions['walk']?.reset().fadeIn(0.5).play();

  let timer = rotationTimer;

  const playerBodyRef = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerBodyRef,
  );

  const currentQuat = new THREE.Quaternion();
  const startQuat = new THREE.Quaternion();
  const data = useThree();
  const [isRotating, setIsRotating] = useState(false);
  const tempQuat = useRef(new THREE.Quaternion()).current;

  const meshRef = useRef<THREE.Group>(null);

  console.log("Orc redraw");

  const lookDir = new THREE.Vector3();

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
      new THREE.Quaternion(currentOrcBody.x, currentOrcBody.y, currentOrcBody.z, currentOrcBody.w),
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
    setIsRotating(true);
    // 1. Получаем кватернион из Rapier-тела
    const rapierQuat = currentTarget.current.rotation();
    // 2. Конвертируем в Three.js Quaternion
    startQuat.set(rapierQuat.x, rapierQuat.y, rapierQuat.z, rapierQuat.w);
    const rotate90Y = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, Math.PI, 0, "XYZ"), // 90 градусов = PI/2 радиан
    );
    // 3. Создаем кватернион на который будем поворачивать
    tempQuat.multiplyQuaternions(startQuat, rotate90Y);
  }

  //   useEffect(() => {
  //     dispatch(ReactThreeFiberGameActions.setZombieWalkStatus());
  //   });

  useEffect(() => {
    const animateZombie = setInterval(() => {
      if (timer < data.clock.getElapsedTime()) {
        timer = data.clock.getElapsedTime() + rotationTimer;

        if (currentObjConditionPatternStatus === conditionPatternStatus.Peaceful) {
          console.log("Rotate");
          startRotation();
        }
      }
    }, 1000);

    return () => clearTimeout(animateZombie);
  });

  // let animationPointer = 0;
  // useEffect(() => {
  //   const chengeOrcAnimation = setInterval(() => {
  //     if (animationPointer === 0) {
  //       actions["idle"]?.reset().fadeOut(0.5);
  //       actions["walk"]?.reset().fadeIn(0.5).play();
  //       animationPointer = 1;
  //     } else {
  //       actions["walk"]?.reset().fadeOut(0.5);
  //       actions["idle"]?.reset().fadeIn(0.5).play();

  //       animationPointer = 0;
  //     }
  //   }, 2000);
  //   return () => clearTimeout(chengeOrcAnimation);
  // });

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
        currentObjConditionPatternStatus !== conditionPatternStatus.Agressive
      ) {
        dispatch(
          ReactThreeFiberGameActions.setCurrentEnemyConditionStatus({
            id: id,
            conditionPatternStatus: conditionPatternStatus.Agressive,
          }),
        );
      }
      if (
        !playerInOrcViewArea &&
        currentObjConditionPatternStatus !== conditionPatternStatus.Peaceful
      ) {
        dispatch(
          ReactThreeFiberGameActions.setCurrentEnemyConditionStatus({
            id: id,
            conditionPatternStatus: conditionPatternStatus.Peaceful,
          }),
        );
      }

      // if (playerInOrcViewArea) {
      //   console.log(`Orc ${id} see player`);
      //   setConditionPatternStatus("agressive");
      // } else {
      //   setConditionPatternStatus("peaceful");
      // }
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

    if (!currentTarget.current || !meshRef.current) return;

    if (currentObjConditionPatternStatus === conditionPatternStatus.Peaceful) {
      // if (tempQuat.angleTo(currentQuat) > 0.001) {

      /**
       * Поворот
       */

      const rapierQuat = currentTarget.current.rotation();
      currentQuat.set(rapierQuat.x, rapierQuat.y, rapierQuat.z, rapierQuat.w);
      currentQuat.slerp(tempQuat, delta);
      currentTarget.current.setRotation(currentQuat, true);

      /**
       * Движение в сторону направления взгляда
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

      currentTarget.current.applyImpulse(
        new THREE.Vector3(-lookDir.x * 0.17, 0, -lookDir.z * 0.17),
        true,
      );
      // }
    }
    if (currentObjConditionPatternStatus === conditionPatternStatus.Agressive) {
      rotateToPlayer();
    }
  });

  return (
    <>
      <Line points={points} color="red" linewidth={1} />

      <group ref={meshRef}>
        <RigidBody
          userData={{ type: "npc", id: id }}
          ref={currentTarget}
          type="dynamic"
          colliders={false}
          position={[position.x, position.y, position.z]}
          restitution={0.2}
          friction={0}
          enabledRotations={[false, true, false]}
        >
          {/* <CapsuleCollider
            mass={2}
            position={[0, 0, 0]}
            args={[0.3, 0.4]}
          ></CapsuleCollider> */}
          <primitive
            position={[0, 0, 0]}
            object={cloneModel}
            scale={0.5}
            castShadow
            dispose={null}
          ></primitive>
          <CuboidCollider mass={2} position={[0, 0.7, 0]} args={[0.4, 0.7, 0.3]} />
        </RigidBody>
      </group>
    </>
  );
};

export default AncientOrc;
