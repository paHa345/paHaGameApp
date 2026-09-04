import { useFBX, useTexture } from "@react-three/drei";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const LeftHandShield = () => {
  const model = useFBX("./models/Shields/shield_20.fbx");
  const [colorMap] = useTexture(["./models/Shields/Texture_MAp_shields.png"]);
  const meshRef = useRef<THREE.Mesh>(null);
  console.log(model);
  const mesh = model.children[0].clone() as THREE.Mesh;

  useEffect(() => {
    if (!model || !model.children[0]) return;

    // Очищаем старую геометрию
    if (meshRef.current) {
      meshRef.current.geometry.dispose();
    }

    const mesh = model.children[0].clone() as THREE.Mesh;
    mesh.geometry = mesh.geometry.clone();
    mesh.geometry.applyMatrix4(model.children[0].matrixWorld);
    mesh.matrix.identity();

    meshRef.current = mesh;
  }, [model]);

  //   const clonedShield = useMemo(() => {
  //     // Применяем матрицу трансформации к геометрии
  //     mesh.geometry.applyMatrix4(model.children[0].matrixWorld);
  //     return mesh;
  //   }, [model]);
  useEffect(() => {
    // Применяем матрицу трансформации к геометрии
    mesh.geometry.applyMatrix4(model.children[0].matrixWorld);
  }, [model]);

  const material = new THREE.MeshStandardMaterial({
    map: colorMap,
  });

  return (
    <>
      <primitive
        material={material}
        object={mesh}
        scale={1.6}
        position={[0.48, -1.1, 0]}
        rotation-x={-Math.PI / 2}
        // rotation-y={Math.PI}
        rotation-z={Math.PI / 2 + 0.25}
        dispose={null}
      ></primitive>
    </>
  );
};

export default LeftHandShield;
