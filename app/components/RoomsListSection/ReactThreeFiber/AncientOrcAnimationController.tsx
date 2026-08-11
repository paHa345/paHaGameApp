import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { useAnimations } from "@react-three/drei";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";

interface IAncientOrcAnimationController {
  animations: any;
  cloneModel: THREE.Group<THREE.Object3DEventMap>;
  id: string;
}
const AncientOrcAnimationController = ({
  animations,
  cloneModel,
  id,
}: IAncientOrcAnimationController) => {
  const { actions } = useAnimations(animations, cloneModel);

  const animationName = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.enemyNPCData[id].currentAnimationName,
  );

  console.log(animationName);

  //   actions[animationName]?.play();

  useEffect(() => {
    const action = actions[animationName];

    if (actions[animationName] !== null) {
      actions[animationName].play();
      action?.reset().fadeIn(0.5).play();
    }
    return () => {
      action?.fadeOut(0.5);
    };
  }, [animationName]);

  return <></>;
};

export default AncientOrcAnimationController;
