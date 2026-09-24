import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { InstancedRigidBodies, RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const MainTreeLog = () => {
  const treeLogsArr = [
    {
      id: "treeLog1",
      position: new THREE.Vector3(12, 2, 12),
    },
    {
      id: "treeLog2",
      position: new THREE.Vector3(15, 1, 15),
    },
    {
      id: "treeLog3",
      position: new THREE.Vector3(16, 2, 16),
    },
    {
      id: "treeLog4",
      position: new THREE.Vector3(18, 1, 18),
    },
    {
      id: "treeLog5",
      position: new THREE.Vector3(18, 2, 20),
    },
    {
      id: "treeLog6",
      position: new THREE.Vector3(-42, 2, -44),
    },
  ];

  function TreeLogs() {
    const { scene, nodes } = useGLTF("./models/SurvivalKit/tree-log.glb", true);

    const treeNode = nodes["tree-log_1"] as THREE.Mesh;
    const geometry = treeNode.geometry;
    const material = treeNode.material;
    const instancedRapierBodies = React.useRef<RapierRigidBody[]>([]);

    const positions: [number, number, number][] = [];

    treeLogsArr.forEach((treeLogData) => {
      positions.push([treeLogData.position.x, treeLogData.position.y, treeLogData.position.z]);
    });

    const instances = treeLogsArr.map((log, i) => {
      return {
        key: log.id,
        position: log.position,
        angularDamping: 0.5,
        linearDamping: 0.5,
        scale: 0.8 + Math.random() * 2,
        "rotation-x": Math.random() / 16,
        "rotation-y": Math.random() / 16,
        userData: { id: log.id },
      };
    });

    const instancedMeshRef = useRef<any>(null);

    const bodies = React.useRef<any>([]);
    // const { world } = useRapier();

    // useEffect(() => {
    //   bodies.current = [];
    //   for (let i = 0; i < treeLogsArr.length; i++) {
    //     const x = (i % 5) * 4 - 4;
    //     const z = Math.floor(i / 5) * 4 - 4;
    //   }
    // }, []);

    // const dummy = useMemo(() => new THREE.Object3D(), []);
    // const matrices = new Float32Array(treeLogsArr.length * 16);
    // const matrix = useMemo(() => new THREE.Matrix4(), []);

    // useFrame((state, delta) => {
    //   if (!instancedMeshRef.current) return;
    //   if (!instancedRapierBodies.current) return;

    //   for (let i = 0; i < treeLogsArr.length; i++) {
    //     // const rigidBody = world.getRigidBody()
    //     const position = instancedRapierBodies.current[i].translation();
    //     const rotation = instancedRapierBodies.current[i].rotation();
    //     dummy.position.set(position.x, position.y, position.z);
    //     dummy.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

    //     dummy.updateMatrix();

    //     // Записываем 16 чисел подряд, начиная с позиции i * 16
    //     //   dummy.matrix.toArray(matrices, i * 16);

    //     instancedMeshRef.current.setMatrixAt(i, matrix.copy(dummy.matrix));
    //   }

    //   instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    // });

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
            args={[geometry, material, treeLogsArr.length]}
          />
        </InstancedRigidBodies>
      </>
    );
  }

  return (
    <>
      <TreeLogs></TreeLogs>
    </>
  );
};

export default MainTreeLog;
