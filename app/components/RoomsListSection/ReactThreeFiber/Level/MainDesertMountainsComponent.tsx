import { useFBX, useTexture } from "@react-three/drei";
import React from "react";
import * as THREE from "three";
import { InstancedRigidBodies } from "@react-three/rapier";

const MainDesertMountainsComponent = () => {
  const mountainsArr = [
    {
      id: "desertMountain1",
      position: new THREE.Vector3(40, 0.01, 45),
    },
    {
      id: "desertMountain2",
      position: new THREE.Vector3(20, 0.01, 45),
    },
    {
      id: "desertMountain3",
      position: new THREE.Vector3(0, 0.01, 45),
    },
    {
      id: "desertMountain4",
      position: new THREE.Vector3(-20, 0.01, 45),
    },
    {
      id: "desertMountain5",
      position: new THREE.Vector3(-40, 0.01, 45),
    },
  ];

  function DesertMountains() {
    const model = useFBX("./models/DesertMountain/Hill_desert_001.fbx");
    const [colorMap] = useTexture(["./models/DesertMountain/Textures/T_Mountains_desert.png"]);
    const mountainNode = model.children[0] as THREE.Mesh;
    //   const treeNode = nodes["tree_1"] as THREE.Mesh;
    if (!mountainNode) return null;
    const geometry = mountainNode.geometry.clone();
    const material = new THREE.MeshStandardMaterial({
      map: colorMap,
    });

    const instancedMeshRef = React.useRef<THREE.InstancedMesh>(null);
    const positions: [number, number, number][] = [];

    mountainsArr.forEach((mountainData) => {
      positions.push([mountainData.position.x, mountainData.position.y, mountainData.position.z]);
    });

    const instances = React.useMemo(() => {
      return mountainsArr.map((pos, i) => ({
        key: mountainsArr[i].id,
        position: pos.position,
        angularDamping: 0.5,
        linearDamping: 0.5,
        "scale-x": 0.011 + 0.003 * Math.random(),
        "scale-y": 0.01 + 0.003 * Math.random(),
        "scale-z": 0.006 + 0.003 * Math.random(),
        // "rotation-x": Math.random() / 16,
        "rotation-y": Math.random() * 4,
      }));
    }, [mountainsArr]);

    return (
      <InstancedRigidBodies colliders="hull" type="fixed" instances={instances}>
        <instancedMesh
          //   frustumCulled={false}
          ref={instancedMeshRef}
          args={[geometry, material, mountainsArr.length]}
        />
      </InstancedRigidBodies>
    );
  }

  return (
    <>
      <DesertMountains></DesertMountains>
    </>
  );
};

export default MainDesertMountainsComponent;
