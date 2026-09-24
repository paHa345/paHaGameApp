import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { useGLTF } from "@react-three/drei";
import { InstancedRigidBodies, RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";
import BarrelPickedUpMoveHandler from "./BarrelPickedUpMoveHandler";

const BarrelsMain = () => {
  const barrelsArr = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.barrelsArr,
  );
  const instancedRapierBodies = React.useRef<RapierRigidBody[]>([]);

  const bodies = React.useRef<any>([]);
  const instancedMeshRef = useRef<any>(null);

  function Barrels() {
    const { nodes } = useGLTF("./models/PlatformerKit/barrel.glb", true);

    const barrelNode = nodes["barrel_1"] as THREE.Mesh;
    const geometry = barrelNode.geometry;
    const material = barrelNode.material;

    const positions: [number, number, number][] = [];

    barrelsArr.forEach((barrelData) => {
      positions.push([barrelData.position.x, barrelData.position.y, barrelData.position.z]);
    });

    const instances = barrelsArr.map((barrel, i) => {
      return {
        key: barrel.id,
        position: barrel.position,
        angularDamping: 0.5,
        linearDamping: 0.5,
        scale: 1.3,
        // "rotation-x": Math.random() / 16,
        // "rotation-y": Math.random() / 16,
        userData: { id: barrel.id, type: "barrel" },
      };
    });

    return (
      <>
        <InstancedRigidBodies
          type="dynamic"
          ref={instancedRapierBodies}
          instances={instances}
          colliders="hull"
        >
          <instancedMesh
            frustumCulled={false}
            ref={instancedMeshRef}
            args={[geometry, material, barrelsArr.length]}
          />
        </InstancedRigidBodies>
        <BarrelPickedUpMoveHandler
          instancedRapierBodies={instancedRapierBodies}
        ></BarrelPickedUpMoveHandler>
      </>
    );
  }

  return (
    <>
      <Barrels></Barrels>
    </>
  );
};

export default BarrelsMain;
