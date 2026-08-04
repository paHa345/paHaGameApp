import { AppDispatch } from "@/app/store";
import { ReactThreeFiberGameActions } from "@/app/store/ReactThreeFiberGameSlice";
import { PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

const Controls = () => {
  const controls = useRef(null);
  const dispatch = useDispatch<AppDispatch>();

  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement && document) {
        const mouseVector = {
          x: (e.movementX / canvas.height) * 2,
          y: (e.movementY / canvas.width) * 2,
        };
        dispatch(ReactThreeFiberGameActions.setMouseCoords(mouseVector));
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, [gl]);

  return <PointerLockControls ref={controls} />;
};

export default Controls;
