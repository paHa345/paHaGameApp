import React, { useEffect, useRef } from "react";
import localFont from "next/font/local";
import { useKeyboardControls, useTexture } from "@react-three/drei";
import { useDispatch, useSelector } from "react-redux";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import { AppDispatch } from "@/app/store";
import { addEffect, useThree } from "@react-three/fiber";
import PickUpComponent from "./PickUpComponent";
import ThrowObjectComponent from "./ThrowObjectComponent";
import InventoryMain from "./Inventory/InventoryMain";
import PointerMain from "./InterfacePointer/PointerMain";
import MoveButtonElMain from "./MoveButtonEl/MoveButtonElMain";

const BebasNeue = localFont({
  src: "../../../../../public/fonts/BebasNeue-Regular.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const Sol_Kol = localFont({
  src: "../../../../../public/fonts/Sol_Kol.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const Shonen = localFont({
  src: "../../../../../public/fonts/Shonen.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const Interface = () => {
  const dispatch = useDispatch<AppDispatch>();
  useTexture.preload("/RPGUI/InventoryMainMenu_001.png");
  // const threeState = useThree();

  // const time = useRef<HTMLDivElement>(null);

  // const startTime = useSelector(
  //   (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.startTime,
  // );
  // const endTime = useSelector(
  //   (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.endTime,
  // );

  // const phase = useSelector(
  //   (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.phase,
  // );

  // const startGameButtonHandler = () => {
  //   threeState.gl.domElement.requestPointerLock();
  // };

  const restartButtonHandler = () => {
    dispatch(ReactThreeFiberGameActions.restart());
  };

  // useEffect(() => {
  //   const unsubscibeEffect = addEffect(() => {
  //     let elapsedTime: number | string = 0;

  //     if (phase === "playing") {
  //       elapsedTime = Date.now() - startTime;
  //     } else if (phase === "ended") {
  //       elapsedTime = endTime - startTime;
  //     }

  //     elapsedTime /= 1000;
  //     elapsedTime = elapsedTime.toFixed(2);

  //     if (time.current) {
  //       time.current.textContent = elapsedTime;
  //     }
  //   });

  //   return () => {
  //     unsubscibeEffect();
  //   };
  // }, [phase]);

  return (
    <div className={`${Shonen.className} fixed top-0 left-0 w-full h-full pointer-events-none`}>
      {/* Time */}
      {/* {phase === "playing" && ( */}
      {/* <div className=" absolute flex justify-center items-center top-20 left-0 w-full">
        <div
          ref={time}
          className=" bg-opacity-20  w-2/3 text-slate-50 text-4xl bg-slate-300 pt-2 text-center "
        >
          0.00
        </div>
      </div> */}
      {/* )} */}

      {/* Restart */}
      {/* {phase === "ended" && (
        <div
          onClick={restartButtonHandler}
          className=" pointer-events-auto cursor-pointer  absolute flex justify-center items-center top-1/4  left-0 w-full"
        >
          <div
            className=" left-0 w-2/3 text-slate-50 text-7xl
        bg-slate-300 bg-opacity-20 pt-3 text-center "
          >
            Заново
          </div>
        </div>
      )} */}

      {/* Inventory Menu */}

      <InventoryMain></InventoryMain>

      {/* Pointer */}
      <PointerMain></PointerMain>

      {/* Move buttons */}
      <MoveButtonElMain></MoveButtonElMain>

      {/* Controls */}
      <PickUpComponent></PickUpComponent>
      <ThrowObjectComponent></ThrowObjectComponent>
    </div>
  );
};

export default Interface;
