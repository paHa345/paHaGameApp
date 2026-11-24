import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import React from "react";
import { useSelector } from "react-redux";
import styles from "./LevelUpIcon.module.css";

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
        <div
          className={` levelUpIcon rounded-full ${styles.gradientBorder}  absolute overflow-hidden  h-[40px] w-[40px]  xl:h-[60px] xl:w-[60px]  top-[5%] left-[10%]`}
        >
          <img
            className={` h-[1000%] absolute max-w-none bottom-[-63%] left-[-715%]  xl:h-[1000%]  xl:bottom-[-63%] xl:left-[-715%]  `}
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
