import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
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
  const stopAtProgress = 0.95;

  const animationName = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.enemyNPCData[id].currentAnimationName,
  );

  useEffect(() => {
    const action = actions[animationName];

    if (action !== null) {
      action.play();

      //   if (animationName === "holding-right-shoot") {
      //     action.timeScale = 0.5;
      //   } else {
      //     action.timeScale = 1;
      //   }

      if (animationName === "attack-melee-right") {
        action.timeScale = 0.5;
      } else {
        action.timeScale = 1;
      }

      action?.reset().fadeIn(0.5).play();
    }
    return () => {
      action?.fadeOut(0.5);
    };
  }, [animationName]);

  useFrame(() => {
    const action = actions[animationName];
    if (!action) return;

    if (animationName !== "holding-right-shoot") return;

    const duration = action.getClip().duration;
    const progress = action.time / duration;

    if (progress >= stopAtProgress) {
      // Останавливаем анимацию
      action.paused = true;
      action.time = duration * stopAtProgress;
      return;
    }

    // Плавное замедление перед остановкой
    const distanceToStop = stopAtProgress - progress;
    const slowdownZone = 0.3; // замедление в последних 30%

    if (distanceToStop < slowdownZone) {
      const slowdownFactor = distanceToStop / slowdownZone;
      action.timeScale = Math.max(0.05, slowdownFactor);
    } else {
      action.timeScale = 1;
    }
  });

  return <></>;
};

export default AncientOrcAnimationController;
