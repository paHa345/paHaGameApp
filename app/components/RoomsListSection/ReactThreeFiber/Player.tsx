import { AppDispatch } from "@/app/store";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import { useAnimations, useGLTF, useKeyboardControls, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier";
import { useControls } from "leva";
import React, { memo, Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";
import GameMenu from "./GameMenu";
import UpdateMouseCoordsAndCameraPosition from "./UpdateMouseCoordsAndCameraPosition";
import PlayerAnimationsController from "./PlayerAnimationsController";

const Player = () => {
  // const Scratches005Color = useTexture("./textures/Moss002/Moss002Color.jpg");

  // Scratches005Color.repeat.set(24, 1);
  // Scratches005Color.wrapS = THREE.RepeatWrapping;
  // Scratches005Color.wrapT = THREE.RepeatWrapping;

  // Scratches005Color.needsUpdate = true;

  const targetPos = useRef(new THREE.Vector3());
  const desiredPos = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());

  const distance = useRef(1);

  const body = useRef<RapierRigidBody>(null);
  const cameraPoint = useRef<THREE.Mesh>(null);
  const userMain = useRef<THREE.Mesh>(null);
  const borderUserSphere = useRef<THREE.Mesh>(null);
  const playerModelRef = useRef<THREE.Mesh>(null);
  const { rapier, world } = useRapier();

  const { gl } = useThree();

  const player = useGLTF("./models/characters/2/character-a.glb", true);
  for (const name in player.nodes) {
    player.nodes[name].castShadow = true;
  }

  // const playerTexture = useTexture("./models/characters/2/texture-a.png");
  // playerTexture.flipY = false;

  const gamePauseStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.gamePauseStatus,
  );

  // const currentAnimationName = useSelector(
  //   (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.animationsName,
  // );

  // const animations = useAnimations(player.animations, player.scene);
  const dispatch = useDispatch<AppDispatch>();
  // const blockCounts = useSelector(
  //   (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.blocksCount,
  // );

  const phase = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.phase,
  );

  const [subscribeKeys, getKeys] = useKeyboardControls();

  useEffect(() => {
    dispatch(ReactThreeFiberGameActions.setPlayerBodyRef(body.current));
  }, [body]);

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

  console.log("asdasd");

  // useEffect(() => {
  //   const subscribeMouseMove = (e: MouseEvent) => {
  //     if (document.pointerLockElement && document) {
  //       const mouseVector = {
  //         x: (e.movementX / gl.domElement.height) * 2,
  //         y: (e.movementY / gl.domElement.width) * 2,
  //       };
  //       dispatch(ReactThreeFiberGameActions.setMouseCoords(mouseVector));
  //     }
  //   };
  //   document.addEventListener("mousemove", subscribeMouseMove);

  //   return () => {
  //     document.removeEventListener("mousemove", subscribeMouseMove);
  //   };
  // });

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

  // useEffect(() => {
  //   const action = animations.actions[currentAnimationName];

  //   if (animations.actions[currentAnimationName] !== null) {
  //     animations.actions[currentAnimationName].play();
  //     action?.reset().fadeIn(0.5).play();
  //   }
  //   return () => {
  //     action?.fadeOut(0.5);
  //   };
  // }, [currentAnimationName]);

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
          // dispatch(ReactThreeFiberGameActions.setJumpAnimation());
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

    // borderUserSphere.current?.position.set(
    //   state.camera.position.x,
    //   borderUserSphere.current.position.y,
    //   state.camera.position.z,
    // );
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

    // if (hit !== null && hit?.timeOfImpact > 0) {
    //   dispatch(ReactThreeFiberGameActions.setJumpAnimation());
    // }

    const moveDirectionVector = new THREE.Vector3(0, 0, 0);
    body.current.applyImpulse(moveDirectionVector, true);

    const impulseStrength = 1 * delta;
    // const torqueStrength = 0.2 * delta;

    // if (state.clock.getElapsedTime() - time > 3) {
    //   moveDirectionVector.set(state.camera.position.x, 0, state.camera.position.z).normalize();
    //   time = state.clock.getElapsedTime();
    // }

    if (!playerModelRef.current) return;
    if (!forward && !backward) {
      // dispatch(ReactThreeFiberGameActions.setRotatePlayerModel(0));
      playerModelRef.current.rotation.y = 0;
    }

    if (forward) {
      dispatch(ReactThreeFiberGameActions.setWalkAnimation());
      moveDirectionVector.set(
        origin.x - state.camera.position.x,
        0,
        origin.z - state.camera.position.z,
      );
    }

    if (rightward) {
      dispatch(ReactThreeFiberGameActions.setWalkAnimation());
      // dispatch(ReactThreeFiberGameActions.setRotatePlayerModel(-0.2));
      playerModelRef.current.rotation.y = -Math.PI / 8;

      moveDirectionVector.set(
        origin.x - state.camera.position.x,
        0,
        origin.z - state.camera.position.z,
      );

      moveDirectionVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(-90));
      //   impulse.x += impulseStrength;
      //   torque.z -= torqueStrength;
    }
    if (backward) {
      dispatch(ReactThreeFiberGameActions.setWalkAnimation());
      moveDirectionVector.set(
        origin.x - state.camera.position.x,
        0,
        origin.z - state.camera.position.z,
      );
      moveDirectionVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(180));

      //   .normalize();

      //   impulse.z += impulseStrength;
      //   torque.x += torqueStrength;
    }
    if (leftward) {
      dispatch(ReactThreeFiberGameActions.setWalkAnimation());
      // dispatch(ReactThreeFiberGameActions.setRotatePlayerModel(0.2));
      playerModelRef.current.rotation.y = Math.PI / 8;

      moveDirectionVector.set(
        origin.x - state.camera.position.x,
        0,
        origin.z - state.camera.position.z,
      );
      moveDirectionVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(90));
    }

    body.current.applyImpulse(
      new THREE.Vector3(moveDirectionVector.x / 12, 0, moveDirectionVector.z / 12),
      true,
    );

    /**
     * Поворот камеры по движению мыши в компоненте UpdateMouseCoordsAndCameraPosition
     */

    /**
     * Camera
     */

    const bodyPosition = body.current?.translation();

    /**
     * Phases
     */

    // if (bodyPosition.z < -(blockCounts * 4 + 2)) {
    //   dispatch(ReactThreeFiberGameActions.end());
    // }

    if (bodyPosition.y < -4) {
      dispatch(ReactThreeFiberGameActions.restart());
    }
  });

  return (
    <>
      <Suspense fallback={null}>
        <mesh ref={userMain}>
          {/* <mesh
          ref={borderUserSphere}
          position={[1, 1, 1]}
          rotation={[0, 0, 0]}
          scale={1.2}
        >
          <meshStandardMaterial
            side={2}
            // map={Scratches005Color}
            color={"#b7d5e6"}
            emissive={"#a5a1a1"}
            lightMapIntensity={100.5}
            // metalness={1}
            // roughness={0}
            envMapIntensity={1.8}
          ></meshStandardMaterial>
          <sphereGeometry
            args={[28, 28, 16, 0, Math.PI * 2, 1.5, 0.55]}
          ></sphereGeometry>
        </mesh> */}
          <mesh ref={cameraPoint}>
            <mesh position={[0, 8, 0]} rotation-x={-Math.PI / 2}>
              {gamePauseStatus && <GameMenu></GameMenu>}
            </mesh>
          </mesh>
          <RigidBody
            userData={{ type: "player", id: "player" }}
            ref={body}
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
            <CuboidCollider mass={1} position={[0, 0.6, 0]} args={[0.4, 0.6, 0.35]}>
              <group
              // rotation-y={rotationPlayerModel}
              >
                <primitive
                  ref={playerModelRef}
                  position={[0, -0.6, 0]}
                  object={player.scene}
                  scale={0.4}
                  castShadow
                  dispose={null}
                >
                  {/* <meshBasicMaterial map={playerTexture} /> */}
                </primitive>
              </group>
            </CuboidCollider>

            {/* <mesh castShadow>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial flatShading color={"mediumPurple"} />
        </mesh> */}
          </RigidBody>
        </mesh>
        <UpdateMouseCoordsAndCameraPosition
          cameraPoint={cameraPoint}
          dir={dir}
          playerBody={body}
          targetPos={targetPos}
          desiredPos={desiredPos}
        ></UpdateMouseCoordsAndCameraPosition>
        <PlayerAnimationsController player={player}></PlayerAnimationsController>
      </Suspense>
    </>
  );
};

export default memo(Player);
