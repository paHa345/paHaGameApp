import { useKeyboardControls } from "@react-three/drei";
import React from "react";

const MoveButtonElMain = () => {
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
    <div className=" absolute bottom-20 left-0 w-full ">
      <div className=" flex justify-center ">
        <div
          className={`bg-opacity-20  ${forward ? "bg-opacity-80" : ""} w-[20px] h-[24px] lg:w-10 lg:h-12 mx-1 my-1 bg-slate-400 border-solid border-2 border-slate-50 `}
        ></div>
      </div>
      <div className=" flex justify-center ">
        <div
          className={`bg-opacity-20  ${leftward ? "bg-opacity-80" : ""} w-[20px] h-[24px] lg:w-10 lg:h-12 mx-1 my-1 bg-slate-400 border-solid border-2 border-slate-50 `}
        ></div>
        <div
          className={`bg-opacity-20  ${backward ? "bg-opacity-80" : ""} w-[20px] h-[24px] lg:w-10 lg:h-12 mx-1 my-1 bg-slate-400 border-solid border-2 border-slate-50 `}
        ></div>
        <div
          className={`bg-opacity-20  ${rightward ? "bg-opacity-80" : ""} w-[20px] h-[24px] lg:w-10 lg:h-12 mx-1 my-1 bg-slate-400 border-solid border-2 border-slate-50 `}
        ></div>
      </div>
      <div className=" flex justify-center ">
        <div
          className={`bg-opacity-20  ${jump ? "bg-opacity-80" : ""} w-[72px] h-[24px] lg:w-36 lg:h-12 mx-1 my-1 bg-slate-400 border-solid border-2 border-slate-50 `}
        ></div>{" "}
      </div>
    </div>
  );
};

export default MoveButtonElMain;
