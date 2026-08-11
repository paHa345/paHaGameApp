import * as THREE from "three";

import React, { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import Tree from "./Tree";

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
  ];

  const { scene, nodes } = useGLTF("./models/MiniForest/tree.glb", true);

  const trees = treesArr.map((treeData) => {
    return (
      <Tree
        key={treeData.id}
        id={treeData.id}
        position={treeData.position}
        scene={scene}
        nodes={nodes}
      ></Tree>
    );
  });
  return (
    <>
      <Suspense fallback={null}>{trees} </Suspense>
    </>
  );
};

export default MainTreesComponent;
