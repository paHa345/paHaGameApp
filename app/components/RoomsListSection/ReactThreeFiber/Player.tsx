import { AppDispatch } from "@/app/store";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import {
  FirstPersonControls,
  FlyControls,
  MapControls,
  OrbitControls,
  PerspectiveCamera,
  PointerLockControls,
  Sky,
  useAnimations,
  useFBX,
  useGLTF,
  useKeyboardControls,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier";
import { useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";

const Player = () => {
  const body = useRef<RapierRigidBody>(null);
  const cameraPoint = useRef<THREE.Mesh>(null);
  const userMain = useRef<THREE.Mesh>(null);
  const { rapier, world } = useRapier();

  const player = useGLTF("./models/characters/2/character-a.glb");
  //   const player = useFBX("./models/characters/1/Model/characterMedium.fbx");

  const playerTexture = useTexture("./models/characters/2/texture-a.png");
  playerTexture.flipY = false;

  const currentAnimationName = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.animationsName,
  );

  const animations = useAnimations(player.animations, player.scene);
  const rotationPlayerModel = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.rotatePlayerModel,
  );
  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(0, 0, 0));
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  // Rotate to camera helper vectors
  const direction = new THREE.Vector3();
  const targetQuaternion = new THREE.Quaternion();
  const lookAtVector = new THREE.Vector3(0, 0, -1);

  let time = 0;

  const dispatch = useDispatch<AppDispatch>();
  const blockCounts = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.blocksCount,
  );

  const phase = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.phase,
  );

  const [subscribeKeys, getKeys] = useKeyboardControls();

  const reset = () => {
    body.current?.setTranslation(
      {
        x: 0,
        y: 1,
        z: 0,
      },
      true,
    );
    body.current?.setLinvel(
      {
        x: 0,
        y: 0,
        z: 0,
      },
      true,
    );
    body.current?.setAngvel(
      {
        x: 0,
        y: 1,
        z: 0,
      },
      true,
    );
  };

  //   useEffect(() => {
  //     body.current?.setAdditionalMass(500, true);
  //   }, []);

  /**
   * Animations
   */

  const { playerAnimations } = useControls("playerAnimations", {
    playerAnimations: {
      options: animations.names,
    },
  });

  useEffect(() => {
    const action = animations.actions[currentAnimationName];

    if (animations.actions[currentAnimationName] !== null) {
      animations.actions[currentAnimationName].play();
      action?.reset().fadeIn(0.5).play();
    }
    return () => {
      action?.fadeOut(0.5);
    };
  }, [currentAnimationName]);

  useEffect(() => {
    if (phase === "ready") {
      reset();
    }
  }, [phase]);

  const jump = () => {
    if (!body.current) return;
    const origin = body.current.translation();
    origin.y -= 0.1;

    const direction = {
      x: 0,
      y: -1,
      z: 0,
    };

    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    if (hit === null) return;

    if (hit.timeOfImpact === undefined) return;

    if (hit.timeOfImpact < 0.15) {
      body.current?.applyImpulse(
        {
          x: 0,
          y: 3,
          z: 0,
        },
        true,
      );
    }
  };

  useEffect(() => {
    const unsubscribeJump = subscribeKeys(
      (state) => {
        return state.jump;
      },
      (value) => {
        if (value) {
          dispatch(ReactThreeFiberGameActions.setJumpAnimation());
          jump();
        }
      },
    );

    const unsubscribeAny = subscribeKeys(() => {
      dispatch(ReactThreeFiberGameActions.start());
    });

    return () => {
      unsubscribeJump();
      unsubscribeAny();
    };
  }, []);

  useFrame((state, delta) => {
    if (!body.current) return;

    const origin = body.current.translation();
    origin.y -= 0.1;

    const rayDirection = {
      x: 0,
      y: -1,
      z: 0,
    };

    const ray = new rapier.Ray(origin, rayDirection);
    const hit = world.castRay(ray, 10, true);

    /**
     * Controls
     */
    const { forward, backward, leftward, rightward } = getKeys();

    // set idle animation if player not move

    if (!forward && !backward && !leftward && !rightward && hit?.timeOfImpact === 0) {
      dispatch(ReactThreeFiberGameActions.setIdleAnimation());
    }

    if (hit !== null && hit?.timeOfImpact > 0) {
      dispatch(ReactThreeFiberGameActions.setJumpAnimation());
    }

    const impulse = {
      x: 0,
      y: 0,
      z: 0,
    };
    const moveDirectionVector = new THREE.Vector3(0, 0, 0);
    body.current.applyImpulse(moveDirectionVector, true);

    // const torque = {
    //   x: 0,
    //   y: 0,
    //   z: 0,
    // };

    const impulseStrength = 1 * delta;
    // const torqueStrength = 0.2 * delta;

    // if (state.clock.getElapsedTime() - time > 3) {
    //   moveDirectionVector.set(state.camera.position.x, 0, state.camera.position.z).normalize();
    //   time = state.clock.getElapsedTime();
    // }

    if (!forward && !backward && rotationPlayerModel !== 0) {
      dispatch(ReactThreeFiberGameActions.setRotatePlayerModel(0));
    }

    if (forward) {
      dispatch(ReactThreeFiberGameActions.setWalkAnimation());
      moveDirectionVector.set(-state.camera.position.x / 10, 0, -state.camera.position.z / 10);
      //   moveDirectionVector.normalize();
      // .normalize();

      //   moveDirectionVector.z -= impulseStrength;w
      //   moveDirectionVector.x -= impulseStrength;
      //   torque.x -= torqueStrength;
    }

    if (rightward) {
      dispatch(ReactThreeFiberGameActions.setWalkAnimation());
      dispatch(ReactThreeFiberGameActions.setRotatePlayerModel(-0.2));

      moveDirectionVector.set(-state.camera.position.x / 10, 0, -state.camera.position.z / 10);

      moveDirectionVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(-90));
      //   impulse.x += impulseStrength;
      //   torque.z -= torqueStrength;
    }
    if (backward) {
      dispatch(ReactThreeFiberGameActions.setWalkAnimation());
      moveDirectionVector.set(state.camera.position.x / 10, 0, state.camera.position.z / 10);
      //   .normalize();

      //   impulse.z += impulseStrength;
      //   torque.x += torqueStrength;
    }
    if (leftward) {
      dispatch(ReactThreeFiberGameActions.setWalkAnimation());
      dispatch(ReactThreeFiberGameActions.setRotatePlayerModel(0.2));

      moveDirectionVector.set(state.camera.position.x / 10, 0, state.camera.position.z / 10);
      moveDirectionVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(-90));

      //   impulse.x -= impulseStrength;
      //   torque.z += torqueStrength;
    }

    // body.current.setLinvel(impulse, true);

    // if (state.clock.elapsedTime - time > 2) {
    //   time = state.clock.elapsedTime;
    // }

    body.current.applyImpulse(moveDirectionVector, true);

    /**
     * Поворот RigidBody игрока в ту сторону, куда направлена камера
     */

    // 1. Получаем позицию камеры
    const camPos = state.camera.position;

    // 2. Вычисляем вектор направления камеры
    //устанавливаем в direction координаты вектора камеры
    direction.set(camPos.x, camPos.y, camPos.z);

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
    body.current.setRotation(targetQuaternion, true);

    cameraPoint.current?.position.copy(body.current.translation());

    if (!cameraPoint.current) return;
    state.camera.lookAt(cameraPoint.current.position);

    /**
     * Camera
     */

    const bodyPosition = body.current?.translation();

    // state.camera.position.setY(bodyPosition.z);

    // const cameraPosition = new THREE.Vector3();
    // cameraPosition.copy(bodyPosition);
    // cameraPosition.z += 2.25;
    // cameraPosition.y += 0.65;

    // const cameraTarget = new THREE.Vector3();
    // cameraTarget.copy(bodyPosition);
    // // cameraTarget.y += 0.25;

    // smoothedCameraPosition.lerp(state.camera.position, 5 * delta);
    // smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

    // state.camera.position.copy(smoothedCameraPosition);
    // state.camera.lookAt(smoothedCameraTarget);

    /**
     * Phases
     */

    if (bodyPosition.z < -(blockCounts * 4 + 2)) {
      dispatch(ReactThreeFiberGameActions.end());
    }

    if (bodyPosition.y < -4) {
      dispatch(ReactThreeFiberGameActions.restart());
    }
  });

  return (
    <>
      {/* <mesh ref={userMain}> */}
      <mesh ref={cameraPoint}>
        <PerspectiveCamera
          fov={75}
          // rotation={[0, Math.PI, 0]}
          makeDefault={true}
          position={[-2, 0, 0]}
        >
          <OrbitControls />
        </PerspectiveCamera>
      </mesh>
      <RigidBody
        ref={body}
        mass={5}
        position={[0, 0.75, 0]}
        // colliders="ball"
        colliders={false}
        restitution={0.2}
        linearDamping={0.5}
        angularDamping={0.5}
        friction={1}
        type="dynamic"
        enabledRotations={[false, true, false]}
      >
        <CuboidCollider position={[0, 0.6, 0]} args={[0.4, 0.6, 0.4]}>
          <group rotation-y={rotationPlayerModel}>
            <primitive position={[0, -0.6, 0]} object={player.scene} scale={0.4} castShadow>
              <meshBasicMaterial map={playerTexture} />
            </primitive>
          </group>
        </CuboidCollider>

        {/* <mesh castShadow>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial flatShading color={"mediumPurple"} />
        </mesh> */}
      </RigidBody>
      {/* </mesh> */}
    </>
  );
};

export default Player;
