import { Clone, useAnimations, useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import React, { useEffect } from "react";

const Fox = () => {
  const fox = useGLTF("./models/Fox/glTF/Fox.gltf");

  const animations = useAnimations(fox.animations, fox.scene);

  const { foxAnimation } = useControls("foxAnimation", {
    foxAnimation: {
      options: animations.names,
    },
  });

  useEffect(() => {
    const action = animations.actions[foxAnimation];
    action?.reset().fadeIn(0.5).play();

    return () => {
      action?.fadeOut(0.5);
    };

    // setTimeout(() => {
    //   if (animations.actions.Walk === null || animations.actions.Run === null) return;
    //   animations.actions.Walk.play();
    //   animations.actions.Walk.crossFadeFrom(animations.actions.Run, 1);
    // }, 2000);
  }, [foxAnimation]);

  return (
    <>
      <primitive scale={0.02} object={fox.scene} position={[-2.5, 0, 2.5]}></primitive>
    </>
  );
};

export default Fox;
