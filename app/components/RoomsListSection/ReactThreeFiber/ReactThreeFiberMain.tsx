"use client";

import React from "react";
import { CameraProps, Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Leva, useControls } from "leva";
import { PerfMonitor } from "r3f-monitor";
import Experience from "./Experience";

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
      <div
        onKeyDown={() => {
          console.log("KeyDownEvent");
        }}
        className=" pt-5 h-full w-full absolute"
      >
        <Leva collapsed></Leva>
        <Canvas
          className=" touch-none"
          // onPointerMissed={() => {
          //   console.log("You missed");
          // }}
          shadows
          flat
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [-4, 3, 6],
          }}
        >
          <Experience></Experience>
          {performanceMonitoring && <PerfMonitor position="top-left" />}
        </Canvas>
      </div>
    </>
  );
};

export default ReactThreeFiberMain;
