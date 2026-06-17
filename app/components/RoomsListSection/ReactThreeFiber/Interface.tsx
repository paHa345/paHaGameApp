import React from "react";
import localFont from "next/font/local";
import { useKeyboardControls } from "@react-three/drei";
import { useSelector } from "react-redux";
import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";

const BebasNeue = localFont({
  src: "../../../../public/fonts/BebasNeue-Regular.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const Interface = () => {
  const phase = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.phase,
  );

  const forward = useKeyboardControls((state) => {
    return state.forward;
  });
  const backward = useKeyboardControls((state) => {
    return state.backward;
  });
  const leftward = useKeyboardControls((state) => {
    return state.leftward;
  });
  const rightward = useKeyboardControls((state) => {
    return state.rightward;
  });
  const jump = useKeyboardControls((state) => {
    return state.jump;
  });

  return (
    <div className={`${BebasNeue.className} fixed top-0 left-0 w-full h-full pointer-events-none`}>
      {/* Time */}
      {phase === "playing" && (
        <div className=" absolute flex justify-center items-center top-20 left-0 w-full">
          <div className=" bg-opacity-20  w-2/3 text-slate-50 text-4xl bg-slate-300 pt-2 text-center ">
            0.00
          </div>
        </div>
      )}

      {/* Restart */}
      <div className=" z-50 cursor-wait  absolute flex justify-center items-center top-1/4  left-0 w-full">
        <div
          className=" left-0 w-2/3 text-slate-50 text-7xl
        bg-slate-300 bg-opacity-20 pt-3 text-center "
        >
          Restart
        </div>
      </div>

      {/* Controls */}

      <div className=" absolute bottom-20 left-0 w-full ">
        <div className=" flex justify-center ">
          <div
            className={`bg-opacity-20  ${forward ? "bg-opacity-80" : ""} w-10 h-12 mx-1 my-1 bg-slate-400 border-solid border-2 border-slate-50 `}
          ></div>
        </div>
        <div className=" flex justify-center ">
          <div
            className={`bg-opacity-20  ${leftward ? "bg-opacity-80" : ""} w-10 h-12 mx-1 my-1 bg-slate-400 border-solid border-2 border-slate-50 `}
          ></div>
          <div
            className={`bg-opacity-20  ${backward ? "bg-opacity-80" : ""} w-10 h-12 mx-1 my-1 bg-slate-400 border-solid border-2 border-slate-50 `}
          ></div>
          <div
            className={`bg-opacity-20  ${rightward ? "bg-opacity-80" : ""} w-10 h-12 mx-1 my-1 bg-slate-400 border-solid border-2 border-slate-50 `}
          ></div>
        </div>
        <div className=" flex justify-center ">
          <div
            className={`bg-opacity-20  ${jump ? "bg-opacity-80" : ""} w-36 h-12 mx-1 my-1 bg-slate-400 border-solid border-2 border-slate-50 `}
          ></div>{" "}
        </div>
      </div>
    </div>
  );
};

export default Interface;
