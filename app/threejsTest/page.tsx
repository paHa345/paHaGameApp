"use client";
import React from "react";
import WebGLTestMain from "../components/RoomsListSection/WebGLTestMain";
import ReactThreeFiberMain from "../components/RoomsListSection/ReactThreeFiber/ReactThreeFiberMain";
import { useGLTF } from "@react-three/drei";

const page = () => {
  useGLTF.preload([
    "./models/characters/2/character-o.glb",
    "./models/MiniForest/tree-high.glb",
    "./models/MiniForest/patch-grass.glb",
    "./models/MiniForest/rocks-high.glb",
    "./models/characters/2/character-a.glb",
    "./models/SurvivalKit/tree-log.glb",
    "./models/SurvivalKit/tool-axe-upgraded.glb",
  ]);
  return (
    <>
      {/* <WebGLTestMain></WebGLTestMain> */}
      <ReactThreeFiberMain></ReactThreeFiberMain>
    </>
  );
};

export default page;
