import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { DirectionalLight } from "three";

const Lights = () => {
  const light = useRef<DirectionalLight>(null);

  useFrame((state) => {
    if (!light.current) return;

    light.current.position.z = state.camera.position.z + 2 - 4;
    light.current.target.position.z = state.camera.position.z - 4;
    light.current.position.x = state.camera.position.x + 2 - 8;
    light.current.target.position.x = state.camera.position.x - 8;
    light.current.target.updateMatrixWorld();

    // console.log(light.current.target.position);
  });

  return (
    <>
      <directionalLight
        ref={light}
        castShadow
        position={[8, 8, 1]}
        intensity={4.5}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={14}
        shadow-camera-top={14}
        shadow-camera-right={14}
        shadow-camera-bottom={-14}
        shadow-camera-left={-14}
        shadow-bias={-0.001}
      />
      <ambientLight intensity={1.5} />
    </>
  );
};

export default Lights;
