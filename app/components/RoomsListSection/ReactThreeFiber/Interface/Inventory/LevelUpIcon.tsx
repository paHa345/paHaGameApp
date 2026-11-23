import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import React from "react";
import { useSelector } from "react-redux";

const LevelUpIcon = () => {
  const currentLevel = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerStat.level,
  );

  const levelPoints = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerStat.levelPoints,
  );

  return (
    <>
      {levelPoints > 0 && (
        <div className=" absolute overflow-hidden  h-[50px] w-[50px] top-[5%] left-[10%]">
          <img
            className={` h-[700%] relative max-w-none top-[-286px] left-[-240px]  xl:h-[600%]  xl:top-[-444px] xl:left-[-58px]  `}
            src="/RPGUI/InventoryMainMenu_002.png"
            alt=""
          />
          {/* <p className={` absolute top-[25%] left-[40%] `}>{currentLevel}</p> */}
        </div>
      )}
    </>
  );
};

export default LevelUpIcon;
