import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useRef } from "react";

const Player = () => {
  const body = useRef<RapierRigidBody>(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
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

    const impulseStrength = 1 * delta;
    const torqueStrength = 1 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
    }

    body.current?.applyImpulse(impulse, true);
    body.current?.applyTorqueImpulse(torque, true);
  });
  return (
    <RigidBody ref={body} position={[0, 1, 0]} colliders="ball" restitution={0.2} friction={1}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color={"mediumPurple"} />
      </mesh>
    </RigidBody>
  );
};

export default Player;
