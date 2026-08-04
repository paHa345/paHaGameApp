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

interface IZombieEnemyProps {
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

const ZombieEnemy = ({
  position,
  //   zombieModel,
  id,
  rotationTimer,
  //   animations,
  //   model,
  modelAnimationState,
}: IZombieEnemyProps) => {
  // console.log(`Redraw zombie ${id}`);
  const dispatch = useDispatch<AppDispatch>();
  const zombie1Ref = useRef<RapierRigidBody>(null);
  const { world } = useRapier();

  const corners = useRef<THREE.Vector3[]>([]).current;

  const { scene, animations, nodes } = useGLTF("./models/characters/2/character-o.glb", true);
  for (const name in nodes) {
    nodes[name].castShadow = true;
  }

  const cloneModel = useMemo(() => scene.clone(), [scene]);

  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    // Глубоко клонируем все зависимые объекты
    cloned.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone();
      }
    });
    return cloned;
  }, [scene]);

  const { actions } = useAnimations(animations, cloneModel);

  actions["walk"]?.play();
  //    actions['walk']?.reset().fadeIn(0.5).play();

  const timer = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.rotateZombiesTimer,
  );

  const zombieWalkStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.zombieWalkStatus,
  );

  const currentQuat = new THREE.Quaternion();
  const startQuat = new THREE.Quaternion();
  const data = useThree();
  const [isRotating, setIsRotating] = useState(false);
  const tempQuat = useRef(new THREE.Quaternion()).current;

  const meshRef = useRef<THREE.Group>(null);

  const currentAnimationName = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.animationsName,
  );

  const lookDir = new THREE.Vector3();

  function startRotation() {
    if (!zombie1Ref.current) return;
    setIsRotating(true);
    // 1. Получаем кватернион из Rapier-тела
    const rapierQuat = zombie1Ref.current.rotation();

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
      if (timer[id] + rotationTimer < data.clock.getElapsedTime()) {
        dispatch(
          ReactThreeFiberGameActions.setRotatesCurrentZombieTime({
            id: id,
            time: data.clock.getElapsedTime(),
          }),
        );

        startRotation();
      }
    }, 1000);

    return () => clearTimeout(animateZombie);
  }, [timer[id]]);

  useEffect(() => {
    const calculateViewArea = setInterval(() => {
      const center = new THREE.Vector3(
        zombie1Ref.current?.translation().x,
        zombie1Ref.current?.translation().y,
        zombie1Ref.current?.translation().z,
      );

      const quat = zombie1Ref.current?.rotation();
      if (!quat) return;

      const forwardPos = new THREE.Vector3(0, 0, 1);
      forwardPos.applyQuaternion(quat);
      const right = new THREE.Vector3(1, 0, 0);
      right.applyQuaternion(quat);

      const halfSize = 4 / 2;

      // Вычисляем 4 угла квадрата (плоскость перпендикулярна forward)
      corners[0] = center
        .clone()
        .add(forwardPos.clone().multiplyScalar(halfSize))
        .add(right.clone().multiplyScalar(-halfSize)); // левый ближний
      corners[1] = center
        .clone()
        .add(forwardPos.clone().multiplyScalar(halfSize))
        .add(right.clone().multiplyScalar(halfSize)); // правый ближний
      corners[2] = center
        .clone()
        .add(forwardPos.clone().multiplyScalar(halfSize * 4))
        .add(right.clone().multiplyScalar(halfSize)); // правый дальний (если нужно вытянуть)
      corners[3] = center
        .clone()
        .add(forwardPos.clone().multiplyScalar(halfSize * 4))
        .add(right.clone().multiplyScalar(-halfSize)); // левый дальний

      world.bodies.forEach((body) => {
        if (!body.userData) return;
        const userData = body?.userData as any;
        if (userData.type === "player") {
          const player = body.translation();
          if (
            player.x < corners[1].x &&
            player.x > corners[0].x &&
            player.z < corners[3].z &&
            player.z > corners[0].z
          ) {
            console.log(`Zombie ${id} see player`);
          }
        }
      });

      // world.forEachRigidBody((body) => {
      //   const id = body;
      //   const pos = body.translation();
      //   const rot = body.rotation();
      //   console.log(`Zombie`, { pos, rot });
      // });
    }, 1000);

    return () => clearTimeout(calculateViewArea);
  }, []);

  const points = [
    corners[0],
    corners[1],
    corners[2],
    corners[3],
    corners[0], // замыкаем контур
  ];

  useFrame((state, delta) => {
    // if (tempQuat.angleTo(currentQuat) > 0.001) {
    if (!zombie1Ref.current) return;

    if (!zombie1Ref.current || !meshRef.current) return;

    const rapierQuat = zombie1Ref.current.rotation();
    currentQuat.set(rapierQuat.x, rapierQuat.y, rapierQuat.z, rapierQuat.w);
    currentQuat.slerp(tempQuat, delta);
    zombie1Ref.current.setRotation(currentQuat, true);

    // if (!zombie1Ref.current) return;
    const rotationQuat = new THREE.Quaternion(
      zombie1Ref.current.rotation().x,
      zombie1Ref.current.rotation().y,
      zombie1Ref.current.rotation().z,
      zombie1Ref.current.rotation().w,
    );

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(rotationQuat); // повернём вектор вперёд на ориентацию тела
    lookDir.copy(forward).normalize();

    zombie1Ref.current.applyImpulse(
      new THREE.Vector3(-lookDir.x * 0.17, 0, -lookDir.z * 0.17),
      true,
    );
    // }
  });

  return (
    <>
      <Line points={points} color="red" linewidth={1} />

      <group ref={meshRef}>
        <RigidBody
          userData={{ type: "npc", id: id }}
          ref={zombie1Ref}
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

export default ZombieEnemy;
