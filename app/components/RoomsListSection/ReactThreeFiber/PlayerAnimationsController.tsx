import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { useAnimations } from "@react-three/drei";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

interface IPlayerAnimationsController {
  player: any;
}

const PlayerAnimationsController = ({ player }: IPlayerAnimationsController) => {
  const animations = useAnimations(player.animations, player.scene);

  const currentAnimationName = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.animationsName,
  );

  useEffect(() => {
    const action = animations.actions[currentAnimationName];

    if (animations.actions[currentAnimationName] !== null) {
      animations.actions[currentAnimationName].play();
      action?.reset().fadeIn(0.5).play();
    }
    return () => {
      action?.fadeOut(0.5);
    };
  }, [currentAnimationName]);

  return <></>;
};

export default PlayerAnimationsController;
