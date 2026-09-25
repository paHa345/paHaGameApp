import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { useKeyboardControls } from "@react-three/drei";
import React from "react";
import { useSelector } from "react-redux";

const ThrowObjectComponent = () => {
  const pickedUpBarrelID = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerPickedUpBarrel.id,
  );
  const throwObject = useKeyboardControls((state) => {
    return state.throwObjectButton;
  });

  return (
    <div className=" absolute bottom-48 left-32 w-full ">
      {pickedUpBarrelID && (
        <div className=" flex justify-center ">
          <div
            className={` flex text-center ${throwObject ? "bg-opacity-80" : ""} bg-opacity-20  w-10 h-12 mx-1 my-1 bg-slate-400 border-solid border-2 border-slate-50 `}
          >
            <p className=" text-slate-50 text-3xl">F</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThrowObjectComponent;
