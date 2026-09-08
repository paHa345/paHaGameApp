import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { useFBX, useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";

const LeftHandShield = () => {
  const model = useGLTF("./models/Shields/shield_13.glb");
  const meshRef = useRef<THREE.Mesh>(null);
  const currentRotation = useRef(0);

  //   const mesh = model.children[0].clone() as THREE.Mesh;
  // useEffect(() => {
  //   if (!model || !model.children[0]) return;

  //   // Очищаем старую геометрию
  //   if (meshRef.current) {
  //     meshRef.current.geometry.dispose();
  //   }

  //   const mesh = model.children[0].clone() as THREE.Mesh;
  //   mesh.geometry = mesh.geometry.clone();
  //   mesh.geometry.applyMatrix4(model.children[0].matrixWorld);
  //   mesh.matrix.identity();

  //   meshRef.current = mesh;
  // }, [model]);

  // //   const clonedShield = useMemo(() => {
  // //     // Применяем матрицу трансформации к геометрии
  // //     mesh.geometry.applyMatrix4(model.children[0].matrixWorld);
  // //     return mesh;
  // //   }, [model]);
  // useEffect(() => {
  //   // Применяем матрицу трансформации к геометрии
  //   mesh.geometry.applyMatrix4(model.children[0].matrixWorld);
  // }, [model]);

  //   model.traverse((child: any) => {
  //     if (child.isMesh) {
  //       // Заменяем стандартный материал на более продвинутый
  //       const oldMat = child.material;
  //       child.material = new THREE.MeshStandardMaterial({
  //         map: colorMap,
  //         color: oldMat.color,
  //         roughness: 0.5,
  //         metalness: 0.1,
  //       });
  //       child.material.needsUpdate = true;
  //     }
  //   });

  //   const material = new THREE.MeshStandardMaterial({
  //     map: colorMap,
  //   });

  const blockStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerBlockStatus,
  );

  useFrame(() => {
    if (meshRef.current && blockStatus) {
      currentRotation.current -= (Math.PI * 2 - Math.PI / 3 + currentRotation.current) * 0.1;
      meshRef.current.rotation.x = currentRotation.current;
    }
    if (meshRef.current && !blockStatus) {
      currentRotation.current -= (currentRotation.current + Math.PI * 2) * 0.1;
      meshRef.current.rotation.x = currentRotation.current;
    }
  });

  return (
    <>
      <primitive
        ref={meshRef}
        scale={1}
        position={[
          `${blockStatus ? 0.2 : 0.48}`,
          `${blockStatus ? -1.05 : -1.2}`,
          `${blockStatus ? 0 : 0.2}`,
        ]}
        // rotation-x={`${blockStatus ? Math.PI / 4 : Math.PI * 2}`}
        rotation-y={Math.PI / 6}
        rotation-z={-Math.PI * 2}
        dispose={null}
        object={model.scene}
      ></primitive>
    </>
  );
};

export default LeftHandShield;
