import { useGLTF } from "@react-three/drei";
import { createPortal, useThree } from "@react-three/fiber";
import { CuboidCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useDispatch } from "react-redux";
import { ReactThreeFiberGameActions } from "@/app/store/ReactThreeFiberGameSlice";
import { AppDispatch } from "@/app/store";
import AncientOrcController from "./AncientOrcController";
import AncientOrcAnimationController from "./AncientOrcAnimationController";
import CalculateAttackImpactHandler from "./CalculateAttackImpactHandler";
import DynamicNPCHealthBar from "./DynamicNPCHealthBar";
import RightHandWeapon from "./RightHandWeapon";
import { useGraph } from "@react-three/fiber";

interface IAncientOrcProps {
  position: {
    x: number;
    y: number;
    z: number;
  };
  id: string;
  rotationTimer: number;
}

const AncientOrc = ({ position, id, rotationTimer }: IAncientOrcProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentTarget = useRef<RapierRigidBody>(null);

  const { scene, animations, nodes } = useGLTF("./models/characters/2/character-o.glb", true);
  for (const name in nodes) {
    nodes[name].castShadow = true;
  }
  const cloneModel = useMemo(() => scene.clone(), [scene]);

  const { nodes: clonedNodes } = useGraph(cloneModel);

  const meshRef = useRef<THREE.Group>(null);

  useEffect(() => {
    dispatch(
      ReactThreeFiberGameActions.setEnemyBodyRef({
        id: id,
        enemyBodyRef: currentTarget.current,
      }),
    );
  }, []);

  return (
    <>
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

          {createPortal(<RightHandWeapon></RightHandWeapon>, clonedNodes["arm-right"])}
          <CuboidCollider mass={2} position={[0, 0.7, 0]} args={[0.4, 0.7, 0.3]} />
          <DynamicNPCHealthBar id={id}></DynamicNPCHealthBar>
        </RigidBody>
      </group>
      <AncientOrcController
        id={id}
        rotationTimer={rotationTimer}
        currentTarget={currentTarget}
      ></AncientOrcController>
      <AncientOrcAnimationController
        animations={animations}
        cloneModel={cloneModel}
        id={id}
      ></AncientOrcAnimationController>
      <CalculateAttackImpactHandler
        id={id}
        currentTarget={currentTarget}
      ></CalculateAttackImpactHandler>
    </>
  );
};

export default AncientOrc;
