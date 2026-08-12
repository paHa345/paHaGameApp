import * as THREE from "three";

import React, { Suspense, useMemo } from "react";
import { RoundedBoxGeometry, useGLTF } from "@react-three/drei";
import Tree from "./Tree";
import { InstancedRigidBodies } from "@react-three/rapier";

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

  function Trees() {
    const { scene, nodes } = useGLTF("./models/MiniForest/tree.glb", true);

    const treeNode = nodes["tree_1"] as THREE.Mesh;
    const geometry = treeNode.geometry;
    const material = treeNode.material;

    const positions: [number, number, number][] = [];

    treesArr.forEach((treeData) => {
      positions.push([treeData.position.x, treeData.position.y, treeData.position.z]);
    });

    const scales = Array.from({ length: treesArr.length }, () => {
      const scale = 0.8 + Math.random() * 2;
      return [scale, scale, scale] as [number, number, number];
    });

    const instances = positions.map((pos, i) => {
      return {
        key: treesArr[i].id,
        position: pos,
        angularDamping: 0.5,
        linearDamping: 0.5,
        scale: 1 + Math.random() * 4,
      };
    });

    const dummy = new THREE.Object3D();
    const matrices: any = positions.map((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);

      dummy.rotation.set(0, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      dummy.scale.set(scales[i][0], scales[i][1], scales[i][2]);
      dummy.updateMatrix();
      return dummy.matrix.clone();
    });

    return (
      <>
        <InstancedRigidBodies type="fixed" instances={instances} colliders="hull">
          <instancedMesh args={[geometry, material, treesArr.length]} instanceMatrix={matrices} />
        </InstancedRigidBodies>
      </>
    );
  }

  const GenerateCubes = () => {
    const COUNT = 20;

    const instances: any = [];

    for (let i = 0; i < COUNT; i++) {
      instances.push({
        key: "instance_" + i,
        position: [Math.random() * 0.5 * 8, 6 + i * 0.2, Math.random() * 0.5 * 8],
        rotation: [Math.random(), Math.random(), Math.random()],
      });
    }

    const dummy = new THREE.Object3D();
    const matrices = new Float32Array(COUNT * 16);

    for (let i = 0; i < COUNT; i++) {
      const pos = instances[i].position;
      dummy.position.set(pos[0], pos[1], pos[2]);
      // rotation можно задать, если нужно, но для начала хватит позиции
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);

      dummy.updateMatrix();
      dummy.matrix.toArray(matrices, i * 16); // пишем 16 чисел со смещением
    }

    return (
      <>
        <InstancedRigidBodies instances={instances}>
          <instancedMesh castShadow args={[undefined, undefined, COUNT]}>
            <boxGeometry />
            <meshStandardMaterial color={"tomato"} />
          </instancedMesh>
        </InstancedRigidBodies>
      </>
    );
  };

  //   function Crowd() {
  //     // 1. Загрузка модели (одна нода!)
  //     const { nodes } = useGLTF("./models/MiniForest/tree.glb", true);
  //     //   const template = Object.values(gltf.nodes).find(
  //     //     (n) => n.type === 'Mesh'
  //     //   ) as THREE.Mesh

  //     const treeNode = nodes["tree_1"] as THREE.Mesh;
  //     const geometry = treeNode.geometry;
  //     const material = treeNode.material;

  //     // 2. Генерация данных (позиции, масштабы)
  //     const positions = Array.from(
  //       { length: COUNT },
  //       (_, i) => [(i % 20) * 3 - 30, 0, Math.floor(i / 20) * 3 - 30] as [number, number, number],
  //     );

  //     const scales = Array.from({ length: COUNT }, () => {
  //       const s = 0.8 + Math.random() * 0.4;
  //       return [s, s, s] as [number, number, number];
  //     });

  //     const instances = positions.map((pos, i) => ({
  //       key: `zombie-${i}`,
  //       position: pos,
  //       angularDamping: 0.5,
  //       linearDamping: 0.5,
  //     }));

  //     // 3. ГЛАВНОЕ: Создаём ПЛОСКИЙ Float32Array длиной COUNT * 16
  //     const dummy = new THREE.Object3D();
  //     const matrices = new Float32Array(COUNT * 16); // <-- Это критически важно!

  //     for (let i = 0; i < COUNT; i++) {
  //       dummy.position.set(positions[i][0], positions[i][1], positions[i][2]);
  //       dummy.rotation.set(0, Math.random() * Math.PI * 2, 0); // Только Y, чтобы не падали
  //       dummy.scale.set(scales[i][0], scales[i][1], scales[i][2]);

  //       dummy.updateMatrix();

  //       // Записываем 16 чисел матрицы в общий буфер со смещением i*16
  //       dummy.matrix.toArray(matrices, i * 16);
  //     }

  //     return (
  //       <InstancedRigidBodies instances={instances} colliders="hull">
  //         <instancedMesh
  //           args={[geometry, material, COUNT]}
  //           instanceMatrix={matrices} // <-- Сюда должен прийти Float32Array
  //         />
  //       </InstancedRigidBodies>
  //     );
  //   }

  //   const trees = treesArr.map((treeData) => {
  //     return (
  //       <Tree
  //         key={treeData.id}
  //         id={treeData.id}
  //         position={treeData.position}
  //         scene={scene}
  //         nodes={nodes}
  //       ></Tree>
  //     );
  //   });
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
