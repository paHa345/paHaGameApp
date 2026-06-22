"use client";

import React from "react";
import { CameraProps, Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Leva, useControls } from "leva";
import { PerfMonitor } from "r3f-monitor";
import Experience from "./Experience";
import { KeyboardControls } from "@react-three/drei";
import Interface from "./Interface";

const ReactThreeFiberMain = () => {
  const cameraSettings: CameraProps = {
    fov: 45,
    near: 0.1,
    far: 200,
    position: [4, 2, 6],
  };

  const { performanceMonitoring } = useControls({
    performanceMonitoring: true,
  });

  return (
    <>
      <div className=" pt-5 h-full w-full absolute">
        <Leva collapsed></Leva>
        <KeyboardControls
          map={[
            { name: "forward", keys: ["ArrowUp", "KeyW"] },
            { name: "backward", keys: ["ArrowDown", "KeyS"] },
            { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
            { name: "rightward", keys: ["ArrowRight", "KeyD"] },
            { name: "jump", keys: ["Space"] },
          ]}
        >
          <Canvas
            className=" touch-none"
            shadows
            flat
            // camera={{
            //   fov: 45,
            //   near: 0.1,
            //   far: 200,
            //   position: [-4, 3, 6],
            // }}
          >
            <Experience></Experience>
            {performanceMonitoring && <PerfMonitor position="top-left" />}
          </Canvas>
          <Interface></Interface>
        </KeyboardControls>
      </div>
    </>
  );
};

export default ReactThreeFiberMain;
