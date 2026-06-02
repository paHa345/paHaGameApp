import React from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { useLoader } from "@react-three/fiber";

const Model = () => {
  const model = useLoader(GLTFLoader, "./models/FlightHelmet/glTF/FlightHelmet.gltf", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    loader.setDRACOLoader(dracoLoader);
  });
  console.log(model);
  return (
    <>
      <primitive object={model.scene} scale={5}></primitive>
    </>
  );
};

export default Model;
