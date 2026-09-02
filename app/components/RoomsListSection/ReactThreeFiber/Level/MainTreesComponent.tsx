import * as THREE from "three";

import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { RoundedBoxGeometry, useGLTF } from "@react-three/drei";
import Tree from "../Tree";
import { InstancedRigidBodies } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

const MainTreesComponent = () => {
  const treesArr = [
    {
      id: "tree1",
      position: new THREE.Vector3(5, 0.01, 5),
    },
    {
      id: "tree2",
      position: new THREE.Vector3(10, 0.01, 7),
    },
    {
      id: "tree3",
      position: new THREE.Vector3(22, 0.01, 22),
    },
    {
      id: "tree4",
      position: new THREE.Vector3(16, 0.01, 0),
    },
    {
      id: "tree5",
      position: new THREE.Vector3(22, 0.01, 10),
    },
    {
      id: "tree6",
      position: new THREE.Vector3(-22, 0.01, -44),
    },
  ];

  const instancedMeshRef = useRef<any>(null);

  //   function Trees() {
  //     const { scene, nodes } = useGLTF("./models/MiniForest/tree.glb", true);

  //     const treeNode = nodes["tree_1"] as THREE.Mesh;
  //     const geometry = treeNode.geometry;
  //     const material = treeNode.material;

  //     const positions: [number, number, number][] = [];

  //     treesArr.forEach((treeData) => {
  //       positions.push([treeData.position.x, treeData.position.y, treeData.position.z]);
  //     });

  //     const instances = positions.map((pos, i) => {
  //       return {
  //         key: treesArr[i].id,
  //         position: pos,
  //         angularDamping: 0.5,
  //         linearDamping: 0.5,
  //         scale: 1 + Math.random() * 0.8,
  //         "rotation-x": Math.random() / 16,
  //         "rotation-y": Math.random() / 16,
  //       };
  //     });

  //     const dummy = new THREE.Object3D();
  //     const matrices: any = positions.map((pos, i) => {
  //       dummy.position.set(pos[0], pos[1], pos[2]);

  //       dummy.updateMatrix();
  //       return dummy.matrix.clone();
  //     });
  //     return (
  //       <>
  //         <InstancedRigidBodies type="dynamic" instances={instances} colliders="hull">
  //           <instancedMesh ref={instancedMeshRef} args={[geometry, material, treesArr.length]} />
  //         </InstancedRigidBodies>
  //       </>
  //     );
  //   }

  function Trees() {
    const { nodes } = useGLTF("./models/MiniForest/tree.glb", true);
    const treeNode = nodes["tree_1"] as THREE.Mesh;
    if (!treeNode) return null;
    const geometry = treeNode.geometry.clone();
    const material = treeNode.material;

    const instancedMeshRef = React.useRef<THREE.InstancedMesh>(null);

    const positions: [number, number, number][] = [];

    // if (instancedMeshRef.current) {
    //   instancedMeshRef.current.frustumCulled = false;
    // }

    treesArr.forEach((treeData) => {
      positions.push([treeData.position.x, treeData.position.y, treeData.position.z]);
    });

    const instances = React.useMemo(() => {
      return treesArr.map((pos, i) => ({
        key: treesArr[i].id,
        position: pos.position,
        angularDamping: 0.5,
        linearDamping: 0.5,
        scale: 1 + Math.random() * 3,
        "rotation-x": Math.random() / 16,
        "rotation-y": Math.random() / 16,
      }));
    }, [treesArr]);

    return (
      <InstancedRigidBodies colliders="hull" type="fixed" instances={instances}>
        <instancedMesh
          //   frustumCulled={false}
          ref={instancedMeshRef}
          args={[geometry, material, treesArr.length]}
        />
      </InstancedRigidBodies>
    );
  }

  return (
    <>
      {/* <Crowd></Crowd> */}
      {/* <GenerateCubes></GenerateCubes> */}
      <Trees></Trees>

      {/* <Suspense fallback={null}>{trees} </Suspense> */}
    </>
  );
};

export default MainTreesComponent;
