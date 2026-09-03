"use client";
import React from "react";
import WebGLTestMain from "../components/RoomsListSection/WebGLTestMain";
import ReactThreeFiberMain from "../components/RoomsListSection/ReactThreeFiber/ReactThreeFiberMain";
import { useFBX, useGLTF } from "@react-three/drei";

const page = () => {
  const modelPaths = [
    "./models/DesertMountain/Hill_desert_001.fbx",
    "./models/DesertMountain/Plateau_desert_004.fbx",
    "./models/Houses/house_15_full.fbx",
    "./models/Houses/house_15_1.fbx",
  ];

  useGLTF.preload([
    "./models/characters/2/character-o.glb",
    "./models/MiniForest/tree-high.glb",
    "./models/MiniForest/patch-grass.glb",
    "./models/MiniForest/rocks-high.glb",
    "./models/characters/2/character-a.glb",
    "./models/SurvivalKit/tree-log.glb",
    "./models/SurvivalKit/tool-axe-upgraded.glb",
    "./models/PlatformerKit/block-grass-large-slope-narrow.glb",
    "./models/PlatformerKit/barrel.glb",
  ]),
    modelPaths.forEach((path) => useFBX.preload(path));

  return (
    <>
      {/* <WebGLTestMain></WebGLTestMain> */}
      <ReactThreeFiberMain></ReactThreeFiberMain>
    </>
  );
};

export default page;
