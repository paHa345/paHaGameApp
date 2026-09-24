import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { useKeyboardControls } from "@react-three/drei";
import React from "react";
import { useSelector } from "react-redux";

const PickUpComponent = () => {
  const pickUpStatus = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.playerCanPickUpBarrelStatus.canPickUp,
  );
  const action = useKeyboardControls((state) => {
    return state.actionButton;
  });

  return (
    <div className=" absolute bottom-32 left-32 w-full ">
      {pickUpStatus && (
        <div className=" flex justify-center ">
          <div
            className={` flex text-center ${action ? "bg-opacity-80" : ""} bg-opacity-20  w-10 h-12 mx-1 my-1 bg-slate-400 border-solid border-2 border-slate-50 `}
          >
            <p className=" text-slate-50 text-3xl">E</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PickUpComponent;
