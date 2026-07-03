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
import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier";
import { useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";
import GameMenu from "./GameMenu";

const Player = () => {
  const body = useRef<RapierRigidBody>(null);
  const cameraPoint = useRef<THREE.Mesh>(null);
  const userMain = useRef<THREE.Mesh>(null);
  const { rapier, world } = useRapier();

  const { gl, pointer } = useThree();

  const player = useGLTF("./models/characters/2/character-a.glb");
  //   const player = useFBX("./models/characters/1/Model/characterMedium.fbx");

  const playerTexture = useTexture("./models/characters/2/texture-a.png");
  playerTexture.flipY = false;

  const cameraPosition = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.cameraPosition,
  );
  const gamePauseStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.gamePauseStatus,
  );

  const currentAnimationName = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.animationsName,
  );

  const canvas = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.canvasRef,
  );

  const mouseCoords = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.mouseCoords,
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

  useEffect(() => {
    const subscribeMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement && document) {
        const mouseVector = {
          x: (e.movementX / gl.domElement.height) * 2,
          y: (e.movementY / gl.domElement.width) * 2,
        };
        dispatch(ReactThreeFiberGameActions.setMouseCoords(mouseVector));
      }
    };
    document.addEventListener("mousemove", subscribeMouseMove);

    return () => {
      document.removeEventListener("mousemove", subscribeMouseMove);
    };
  }, []);

  //   useEffect(() => {
  //     body.current?.setAdditionalMass(500, true);
  //   }, []);

  /**
   * Show/hide menu, lock pointer
   */

  useEffect(() => {
    if (!gamePauseStatus) {
      gl.domElement.requestPointerLock({
        unadjustedMovement: true,
      });
    }
    // else{
    //         threeState.gl.domElement.

    // }
  }, [gamePauseStatus]);

  //   const startGameButtonHandler = () => {
  //     console.log("Start game");
  //     threeState.gl.domElement.requestPointerLock();
  //   };

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

    const unsunscribleEscapeButton = subscribeKeys(
      (state) => {
        return state.escape;
      },
      (value) => {
        if (value) {
          console.log("Menu");
          dispatch(ReactThreeFiberGameActions.setGamePauseStatus());
        }
      },
    );

    const unsubscribeAny = subscribeKeys(() => {
      dispatch(ReactThreeFiberGameActions.start());
    });

    return () => {
      unsubscribeJump();
      unsunscribleEscapeButton();
      unsubscribeAny();
    };
  }, []);

  useFrame((state, delta) => {
    if (gamePauseStatus) return;
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
     * Поворот камеры по движению мыши
     */

    // получаем координаты указателя мыши
    // console.log(state.pointer);

    /**
     * Поворот RigidBody игрока в ту сторону, куда направлена камера
     */

    // 1. Получаем позицию камеры
    const camPos = state.camera.position;

    // 2. Вычисляем вектор направления камеры
    //устанавливаем в direction координаты вектора камеры
    // direction.set(state.pointer.x * -1.9, 1, state.pointer.y * 2);
    direction.set(mouseCoords.x, 1, mouseCoords.y);

    // if (state.clock.elapsedTime - time > 2) {
    //   console.log(`Pointer: ${state.pointer.x}:${state.pointer.y}`);
    //   console.log(`MouseCoords: ${mouseCoords.x / 100}:${mouseCoords.y / 100}`);
    //   time = state.clock.getElapsedTime();
    // }

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

    // console.log(body.current.translation());
    cameraPoint.current?.position.copy(body.current.translation());

    // state.camera.position.x = state.pointer.x * -1.9;
    // state.camera.position.y = camPos.y;
    // state.camera.position.z = state.pointer.y * 2;

    // console.log(camPos.y);

    state.camera.position.x = mouseCoords.x;
    state.camera.position.y = camPos.y;
    state.camera.position.z = mouseCoords.y;

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
      <mesh ref={userMain}>
        <mesh ref={cameraPoint}>
          <PerspectiveCamera
            fov={75}
            // rotation={[0, Math.PI, 0]}
            makeDefault={true}
            position={cameraPosition}
          >
            <OrbitControls />
            {/* <PointerLockControls makeDefault={true}></PointerLockControls> */}
          </PerspectiveCamera>
          <mesh position={[0, 8, 0]} rotation-x={-Math.PI / 2}>
            {gamePauseStatus && <GameMenu></GameMenu>}
          </mesh>
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
      </mesh>
    </>
  );
};

export default Player;
