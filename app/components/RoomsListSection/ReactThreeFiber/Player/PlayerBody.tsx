import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { ObjectMap } from "@react-three/fiber";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  CoefficientCombineRule,
} from "@react-three/rapier";
import React from "react";
import { createPortal } from "@react-three/fiber";
import { useSelector } from "react-redux";
import * as THREE from "three";
import GameMenu from "../Interface/GameMenu";
import RightHandWeapon from "./RightHandWeapon";
import LeftHandShield from "./LeftHandShield";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

interface IPlayerBodyProps {
  userMain: React.RefObject<THREE.Mesh<
    THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>,
    THREE.Material | THREE.Material[],
    THREE.Object3DEventMap
  > | null>;
  cameraPoint: React.RefObject<THREE.Mesh<
    THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>,
    THREE.Material | THREE.Material[],
    THREE.Object3DEventMap
  > | null>;
  body: React.RefObject<RapierRigidBody | null>;
  playerModelRef: React.RefObject<THREE.Mesh<
    THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>,
    THREE.Material | THREE.Material[],
    THREE.Object3DEventMap
  > | null>;
  player: GLTF & ObjectMap;
}

const PlayerBody = ({ userMain, cameraPoint, body, playerModelRef, player }: IPlayerBodyProps) => {
  const gamePauseStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.gamePauseStatus,
  );
  return (
    <group ref={userMain}>
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
        restitution={0}
        linearDamping={0.1}
        angularDamping={0.5}
        friction={0}
        type="dynamic"
        enabledRotations={[false, true, false]}
      >
        <CuboidCollider
          friction={0}
          frictionCombineRule={CoefficientCombineRule.Min}
          mass={1}
          position={[0, 0.6, 0]}
          args={[0.4, 0.6, 0.35]}
        >
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

            {createPortal(<RightHandWeapon></RightHandWeapon>, player.nodes["arm-right"])}
            {createPortal(<LeftHandShield></LeftHandShield>, player.nodes["arm-left"])}
          </group>
        </CuboidCollider>
      </RigidBody>
    </group>
  );
};

export default PlayerBody;
