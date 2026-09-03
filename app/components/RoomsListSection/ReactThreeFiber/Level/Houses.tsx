import { useFBX, useTexture } from "@react-three/drei";
import { InstancedRigidBodies } from "@react-three/rapier";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const Houses = () => {
  const housesArr = [
    {
      id: "House1",
      position: new THREE.Vector3(20, -0.01, -20),
    },
    {
      id: "House2",
      position: new THREE.Vector3(-20, -0.01, -30),
    },
  ];

  function Houses() {
    const model = useFBX("./models/Houses/house_15_1.fbx");
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
    const [colorMap] = useTexture(["./models/Houses/Textures/House_texture_atlas1.png"]);

    // Объединяем все геометрии в одну
    const mergedGeometry = useMemo(() => {
      if (!model) return null;

      const geometries: THREE.BufferGeometry[] = [];

      model.traverse((child: any) => {
        if (child.isMesh) {
          const geometry = child.geometry.clone();
          // Применяем трансформации к каждой геометрии
          geometry.applyMatrix4(child.matrixWorld);
          geometries.push(geometry);
        }
      });

      if (geometries.length === 0) return null;

      try {
        // Удаляем лишние атрибуты для совместимости
        const normalizedGeometries = geometries.map((geo) => {
          const keepAttributes = ["position", "normal", "uv"];
          Object.keys(geo.attributes).forEach((name) => {
            if (!keepAttributes.includes(name)) {
              geo.deleteAttribute(name);
            }
          });
          return geo;
        });

        const merged = mergeGeometries(normalizedGeometries);
        merged.computeVertexNormals();
        return merged;
      } catch (error) {
        console.error("Error merging geometries:", error);
        return geometries[0];
      }
    }, [model]);

    const material = useMemo(() => {
      return new THREE.MeshStandardMaterial({
        map: colorMap,
      });
    }, [colorMap]);

    const instances = useMemo(() => {
      return housesArr.map((houseData, i) => ({
        key: housesArr[i].id,
        position: houseData.position,
        angularDamping: 0.5,
        linearDamping: 0.5,
        scale: 1,
        "rotation-y": Math.random() * 4,
      }));
    }, [housesArr]);

    if (!model || !mergedGeometry) {
      return null;
    }

    return (
      <InstancedRigidBodies
        instances={instances}
        colliders="hull" // или "trimesh" для сложных форм
        type="fixed"
      >
        <instancedMesh
          ref={instancedMeshRef}
          args={[mergedGeometry, material, housesArr.length]}
          castShadow
          receiveShadow
        />
      </InstancedRigidBodies>
    );
  }

  return <Houses></Houses>;
};

export default Houses;
