import { useTexture } from "@react-three/drei";
import { useControls } from "leva";
import React from "react";
import * as THREE from "three";

const Grass = () => {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

  const { grassRoughtness, grassMetalness, grassAOMapIntensity, grassDisplacementScale } =
    useControls("Grass", {
      grassRoughtness: { value: 0.85, min: 0.1, max: 1 },
      grassMetalness: { value: 0.1, min: 0.1, max: 1 },
      grassAOMapIntensity: { value: 0.5, min: 0.1, max: 1 },
      grassDisplacementScale: { value: 0, min: 0.01, max: 1 },
    });
  const grass001Color = useTexture("./textures/Grass001/Grass001_1K-JPG_Color.jpg");
  const grass001Normal = useTexture("./textures/Grass001/Grass001_1K-JPG_NormalGL.jpg");
  const grass001Roughness = useTexture("./textures/Grass001/Grass001_1K-JPG_Roughness.jpg");
  const grass001Displacement = useTexture("./textures/Grass001/Grass001_1K-JPG_Displacement.jpg");
  const grass001AmbientOcclusion = useTexture(
    "./textures/Grass001/Grass001_1K-JPG_AmbientOcclusion.jpg",
  );

  grass001Color.repeat.set(16, 16);
  grass001Color.wrapS = THREE.RepeatWrapping;
  grass001Color.wrapT = THREE.RepeatWrapping;
  grass001Normal.repeat.set(16, 16);
  grass001Normal.wrapS = THREE.RepeatWrapping;
  grass001Normal.wrapT = THREE.RepeatWrapping;
  grass001Roughness.repeat.set(16, 16);
  grass001Roughness.wrapS = THREE.RepeatWrapping;
  grass001Roughness.wrapT = THREE.RepeatWrapping;
  grass001Displacement.repeat.set(16, 16);
  grass001Displacement.wrapS = THREE.RepeatWrapping;
  grass001Displacement.wrapT = THREE.RepeatWrapping;
  grass001AmbientOcclusion.repeat.set(16, 16);
  grass001AmbientOcclusion.wrapS = THREE.RepeatWrapping;
  grass001AmbientOcclusion.wrapT = THREE.RepeatWrapping;

  grass001Color.needsUpdate = true;
  grass001Normal.needsUpdate = true;
  grass001Roughness.needsUpdate = true;
  grass001Displacement.needsUpdate = true;
  grass001AmbientOcclusion.needsUpdate = true;
  return (
    <>
      <mesh
        position={[0, -0.1, -10]}
        geometry={boxGeometry}
        scale={[96, 0.2, 96]}
        // material={grassTexture}
        receiveShadow
      >
        {/* <boxGeometry args={[4, 0.2, 4]} /> */}
        <meshStandardMaterial
          map={grass001Color}
          normalMap={grass001Normal}
          roughnessMap={grass001Roughness}
          displacementMap={grass001Displacement}
          aoMap={grass001AmbientOcclusion}
          roughness={grassRoughtness}
          displacementScale={grassDisplacementScale}
          metalness={grassMetalness}
          aoMapIntensity={grassAOMapIntensity}
          // normalScale={[4, 4]}
        />
      </mesh>
    </>
  );
};

export default Grass;
