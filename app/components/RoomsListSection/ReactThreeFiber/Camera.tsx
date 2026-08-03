import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import {
  OrbitControls,
  PerspectiveCamera,
  PointerLockControls,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { useSelector } from "react-redux";

const Camera = () => {
  const cameraPosition = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.cameraPosition,
  );
  const gamePauseStatus = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.gamePauseStatus,
  );

  return (
    <PerspectiveCamera
      fov={75}
      // rotation={[0, Math.PI, 0]}
      near={0.1}
      far={35}
      makeDefault={true}
      position={cameraPosition}
    >
      {gamePauseStatus && <OrbitControls />}

      {/* <PointerLockControls
        ref={controls}
        makeDefault={true}
      ></PointerLockControls> */}
    </PerspectiveCamera>
  );
};

export default Camera;
