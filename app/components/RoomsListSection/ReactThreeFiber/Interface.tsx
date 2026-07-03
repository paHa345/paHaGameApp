import React, { useEffect, useRef } from "react";
import localFont from "next/font/local";
import { useKeyboardControls } from "@react-three/drei";
import { useDispatch, useSelector } from "react-redux";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import { AppDispatch } from "@/app/store";
import { addEffect, useThree } from "@react-three/fiber";

const BebasNeue = localFont({
  src: "../../../../public/fonts/BebasNeue-Regular.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const Sol_Kol = localFont({
  src: "../../../../public/fonts/Sol_Kol.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const Shonen = localFont({
  src: "../../../../public/fonts/Shonen.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const Interface = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const threeState = useThree();

  const time = useRef<HTMLDivElement>(null);

  const startTime = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.startTime,
  );
  const endTime = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.endTime,
  );

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

  // const startGameButtonHandler = () => {
  //   threeState.gl.domElement.requestPointerLock();
  // };

  const restartButtonHandler = () => {
    dispatch(ReactThreeFiberGameActions.restart());
  };

  useEffect(() => {
    const unsubscibeEffect = addEffect(() => {
      let elapsedTime: number | string = 0;

      if (phase === "playing") {
        elapsedTime = Date.now() - startTime;
      } else if (phase === "ended") {
        elapsedTime = endTime - startTime;
      }

      elapsedTime /= 1000;
      elapsedTime = elapsedTime.toFixed(2);

      if (time.current) {
        time.current.textContent = elapsedTime;
      }
    });

    return () => {
      unsubscibeEffect();
    };
  }, [phase]);

  return (
    <div className={`${Shonen.className} fixed top-0 left-0 w-full h-full pointer-events-none`}>
      {/* Time */}
      {/* {phase === "playing" && ( */}
      <div className=" absolute flex justify-center items-center top-20 left-0 w-full">
        <div
          ref={time}
          className=" bg-opacity-20  w-2/3 text-slate-50 text-4xl bg-slate-300 pt-2 text-center "
        >
          0.00
        </div>
      </div>
      {/* )} */}

      {/* Restart */}
      {phase === "ended" && (
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
      )}

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
