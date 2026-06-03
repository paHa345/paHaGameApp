import React from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { useLoader } from "@react-three/fiber";
import { Clone, useGLTF } from "@react-three/drei";

const Model = () => {
  const model = useGLTF("./models/burger.glb");

  //   useLoader(GLTFLoader, "./models/hamburger.glb", (loader) => {
  //     const dracoLoader = new DRACOLoader();
  //     dracoLoader.setDecoderPath("./draco/");
  //     loader.setDRACOLoader(dracoLoader);
  //   });
  console.log(model);
  return (
    <>
      <Clone object={model.scene} scale={0.35} position-x={-4}></Clone>
      <Clone object={model.scene} scale={0.35} position-x={0}></Clone>
      <Clone object={model.scene} scale={0.35} position-x={4}></Clone>
    </>
  );
};

useGLTF.preload("./models/burger.glb");

export default Model;
