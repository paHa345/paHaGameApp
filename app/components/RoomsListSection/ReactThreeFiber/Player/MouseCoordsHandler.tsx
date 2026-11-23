import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";

interface IMouseCoordsHandlerProps {
  yaw: React.RefObject<number>;
  pitch: React.RefObject<number>;
}

const MouseCoordsHandler = ({ yaw, pitch }: IMouseCoordsHandlerProps) => {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement && document) {
        const mouseVector = {
          x: (e.movementX / canvas.height) * 2,
          y: (e.movementY / canvas.width) * 2,
        };
        yaw.current = yaw.current - mouseVector.x;
        pitch.current = pitch.current + mouseVector.y;
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gl]);

  return <></>;
};

export default MouseCoordsHandler;
