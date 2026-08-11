import { useGLTF } from "@react-three/drei";
import React from "react";

const PreloadModelsComponent = () => {
  useGLTF.preload([
    "./models/characters/2/character-o.glb",
    "./models/MiniForest/tree-high.glb",
    "./models/MiniForest/patch-grass.glb",
    "./models/MiniForest/rocks-high.glb",
    "./models/characters/2/character-a.glb",
  ]);
  return <></>;
};

export default PreloadModelsComponent;
