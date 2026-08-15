import { Clone, Line, useAnimations, useGLTF } from "@react-three/drei";
import {
  createPortal,
  ObjectMap,
  useFrame,
  useGraph,
  useThree,
} from "@react-three/fiber";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
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
import AncientOrcController from "./AncientOrcController";
import AncientOrcAnimationController from "./AncientOrcAnimationController";

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

  const { scene, animations, nodes } = useGLTF(
    "./models/characters/2/character-o.glb",
    true,
  );
  for (const name in nodes) {
    nodes[name].castShadow = true;
  }
  const cloneModel = useMemo(() => scene.clone(), [scene]);

  const { nodes: clonedNodes, materials } = useGraph(cloneModel);

  const { scene: axeScene } = useGLTF(
    "./models/SurvivalKit/tool-axe-upgraded.glb",
    true,
  );

  const cloneAxe = useMemo(() => axeScene.clone(), [axeScene]);

  // const [lastSeenPlayerCoords, setLastSeenPlayerCoords] = useState<THREE.Vector3 | null>(null);

  // const { actions } = useAnimations(animations, cloneModel);

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

  // actions["walk"]?.play();
  //    actions['walk']?.reset().fadeIn(0.5).play();

  const meshRef = useRef<THREE.Group>(null);

  console.log("Orc redraw");

  //   useEffect(() => {
  //     dispatch(ReactThreeFiberGameActions.setZombieWalkStatus());
  //   });

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

          {createPortal(
            <primitive
              object={cloneAxe}
              scale={4}
              position={[0, -0.8, 0]}
              rotation-x={Math.PI / 2}
              dispose={null}
            >
              {" "}
            </primitive>,
            clonedNodes["arm-right"],
          )}
          <CuboidCollider
            mass={2}
            position={[0, 0.7, 0]}
            args={[0.4, 0.7, 0.3]}
          />
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
    </>
  );
};

export default AncientOrc;
