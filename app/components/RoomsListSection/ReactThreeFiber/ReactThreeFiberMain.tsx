"use client";

import React, { useEffect, useRef } from "react";
import { CameraProps, Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Leva, useControls } from "leva";
import { PerfMonitor } from "r3f-monitor";
import Experience from "./Experience";
import { KeyboardControls, PointerLockControls, useKeyboardControls } from "@react-three/drei";
import Interface from "./Interface";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { ReactThreeFiberGameActions } from "@/app/store/ReactThreeFiberGameSlice";

const ReactThreeFiberMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // useEffect(() => {
  //   if (canvasRef !== null) {
  //     dispatch(ReactThreeFiberGameActions.setCanvasElement(canvasRef.current));
  //   }
  // }, []);

  const cameraSettings: CameraProps = {
    fov: 45,
    near: 0.1,
    far: 200,
    position: [4, 2, 6],
  };

  const { performanceMonitoring } = useControls({
    performanceMonitoring: true,
  });

  // useEffect(() => {
  //   document.addEventListener("mousemove", (e) => {
  //     if (document.pointerLockElement && document) {
  //       console.log(e.movementX);
  //       //   console.log(e.movementY);
  //     }
  //   });
  // });

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
            { name: "escape", keys: ["Escape"] },
          ]}
        >
          <Canvas
            ref={canvasRef}
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
