import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Player = () => {
  const body = useRef<RapierRigidBody>(null);
  const { rapier, world } = useRapier();

  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10));
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  const [subscribeKeys, getKeys] = useKeyboardControls();

  useEffect(() => {
    body.current?.setAdditionalMass(0.2, true);
  }, []);

  const jump = () => {
    if (!body.current) return;
    const origin = body.current.translation();
    origin.y -= 0.31;

    const direction = {
      x: 0,
      y: -1,
      z: 0,
    };

    const ray = new rapier.Ray(origin, direction);

    const hit = world.castRay(ray, 10, true);

    console.log(hit);
    if (hit === null) return;

    if (hit.timeOfImpact === undefined) return;

    if (hit.timeOfImpact < 0.15) {
      body.current?.applyImpulse(
        {
          x: 0,
          y: 1,
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
          jump();
        }
      },
    );
    return () => {
      unsubscribeJump();
    };
  }, []);

  useFrame((state, delta) => {
    if (!body.current) return;

    /**
     * Controls
     */
    const { forward, backward, leftward, rightward } = getKeys();
    const impulse = {
      x: 0,
      y: 0,
      z: 0,
    };
    const torque = {
      x: 0,
      y: 0,
      z: 0,
    };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }

    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    body.current?.applyImpulse(impulse, true);
    body.current?.applyTorqueImpulse(torque, true);

    /**
     * Camera
     */

    const bodyPosition = body.current?.translation();

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);
  });

  return (
    <RigidBody
      ref={body}
      position={[0, 1, 0]}
      colliders="ball"
      restitution={0.2}
      linearDamping={0.5}
      angularDamping={0.5}
      friction={1}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color={"mediumPurple"} />
      </mesh>
    </RigidBody>
  );
};

export default Player;
