import { useGLTF } from "@react-three/drei";
import React from "react";

const Hamburger = (props: any) => {
  const { nodes, materials }: any = useGLTF("./models/hamburger-draco.glb");

  return (
    <>
      <group {...props} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.cheese.geometry}
          material={materials.CheeseMaterial}
          position={[0, 3.04, 0]}
        ></mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.meat.geometry}
          material={materials.SteakMaterial}
          position={[0, 2.82, 0]}
        ></mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.bottomBun.geometry}
          material={materials.BunMaterial}
        ></mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.topBun.geometry}
          material={materials.BunMaterial}
          position={[0, 1.77, 0]}
        ></mesh>
      </group>
    </>
  );
};

useGLTF.preload("./models/hamburger-draco.glb");

export default Hamburger;
