import { useTexture } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import React from "react";
import * as THREE from "three";

const Bounds = () => {
  const rock061Color = useTexture("./textures/Rock061/Rock061Color.jpg");
  const rock061Normal = useTexture("./textures/Rock061/Rock061NormalGL.jpg");
  const rock061Roughness = useTexture("./textures/Rock061/Rock061Roughness.jpg");
  const rock061Displacement = useTexture("./textures/Rock061/Rock061Displacement.jpg");
  const rock061AmbientOcclusion = useTexture("./textures/Rock061/Rock061Occlusion.jpg");

  rock061Color.repeat.set(24, 1);
  rock061Color.wrapS = THREE.RepeatWrapping;
  rock061Color.wrapT = THREE.RepeatWrapping;
  rock061Normal.repeat.set(24, 1);
  rock061Normal.wrapS = THREE.RepeatWrapping;
  rock061Normal.wrapT = THREE.RepeatWrapping;
  rock061Roughness.repeat.set(24, 1);
  rock061Roughness.wrapS = THREE.RepeatWrapping;
  rock061Roughness.wrapT = THREE.RepeatWrapping;
  rock061Displacement.repeat.set(24, 1);
  rock061Displacement.wrapS = THREE.RepeatWrapping;
  rock061Displacement.wrapT = THREE.RepeatWrapping;
  rock061AmbientOcclusion.repeat.set(24, 1);
  rock061AmbientOcclusion.wrapS = THREE.RepeatWrapping;
  rock061AmbientOcclusion.wrapT = THREE.RepeatWrapping;

  rock061Color.needsUpdate = true;
  rock061Normal.needsUpdate = true;
  rock061Roughness.needsUpdate = true;
  rock061Displacement.needsUpdate = true;
  rock061AmbientOcclusion.needsUpdate = true;

  return (
    <>
      <mesh position={[0, 0.75, -60]}>
        <boxGeometry args={[96, 4, 4]} />
        <meshStandardMaterial
          // color={"red"}
          map={rock061Color}
          normalMap={rock061Normal}
          roughnessMap={rock061Roughness}
          // displacementMap={rock061Displacement}
          aoMap={rock061AmbientOcclusion}
          // // roughness={grassRoughtness}
          // // displacementScale={grassDisplacementScale}
          // // metalness={grassMetalness}
          // // aoMapIntensity={grassAOMapIntensity}
          // // normalScale={[4, 4]}
        />
      </mesh>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <CuboidCollider
          args={[0.3, 1.5, 48]}
          position={[-48.15, 0.75, -10]}
          restitution={0.2}
          friction={0}
        />

        <CuboidCollider
          args={[0.3, 1.5, 48]}
          position={[48.15, 0.75, -10]}
          restitution={0.2}
          friction={0}
        />
        <CuboidCollider
          args={[48, 1.5, 0.3]}
          position={[0, 0.75, -58]}
          restitution={0.2}
          friction={0}
        />
        <CuboidCollider
          args={[48, 1.5, 0.3]}
          position={[0, 0.75, 38.25]}
          restitution={0.2}
          friction={0}
        />
        <CuboidCollider
          args={[48, 0.1, 48]}
          position={[0, -0.1, -10]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  );
};

export default Bounds;
