import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { div } from "framer-motion/client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const PointerMain = () => {
  const pointerCoords = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.pointerCoords,
  );

  const showInventory = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.showInventory,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (showInventory) {
        console.log(pointerCoords);
        console.log(window.innerWidth);
        console.log(window.innerHeight);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showInventory, pointerCoords]);

  return (
    <>
      {showInventory && (
        <div
          style={{ top: `${pointerCoords.y}px`, left: `${pointerCoords.x}px` }}
          className={` z-50 w-[32px] h-[45px] overflow-hidden absolute`}
        >
          <img className={` h-[100%] relative max-w-none`} src="/RPGUI/pointer.png" alt="" />
        </div>
      )}
    </>
  );
};

export default PointerMain;
