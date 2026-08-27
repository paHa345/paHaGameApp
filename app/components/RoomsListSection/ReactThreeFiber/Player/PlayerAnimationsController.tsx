import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { useAnimations, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";

interface IPlayerAnimationsController {
  player: any;
}

const PlayerAnimationsController = ({ player }: IPlayerAnimationsController) => {
  const animations = useAnimations(player.animations, player.scene);

  const currentAnimationName = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.animationsName,
  );

  // console.log(animations);
  const initialized = useRef(false);

  useEffect(() => {
    const action = animations.actions[currentAnimationName];

    if (action !== null) {
      action.fadeOut(0.1).play();
      action.stop();
      if (currentAnimationName === "attack-melee-right") {
        action.timeScale = 0.5;
      } else {
        action.timeScale = 1;
      }
      action?.reset().fadeIn(0.1).play();
    }
    return () => {
      action?.fadeOut(0.1);
    };
  }, [currentAnimationName]);

  return <></>;
};

export default PlayerAnimationsController;
