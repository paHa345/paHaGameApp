import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";
import GameMenu from "../GameMenu";

const StartGameMenuMain = () => {
  const cameraPoint = useRef<THREE.Mesh>(null);

  const gamePauseStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.gamePauseStatus,
  );
  return (
    <>
      <mesh ref={cameraPoint}>
        <mesh position={[0, 8, 0]} rotation-x={-Math.PI / 2}>
          {gamePauseStatus && <GameMenu></GameMenu>}
        </mesh>
      </mesh>
    </>
  );
};

export default StartGameMenuMain;
