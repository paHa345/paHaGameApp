import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import React from "react";
import { useSelector } from "react-redux";

const PlayerExperienceBar = () => {
  const playerCurrentXP = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.playerStat.currentExperience,
  );
  const playerMaxLevelXP = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.playerStat.maxLevelExperience,
  );
  const playerMinLevelXP = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.playerStat.minLevelExperience,
  );
  console.log(((playerCurrentXP - playerMinLevelXP) / (playerMaxLevelXP - playerMinLevelXP)) * 100);
  console.log(playerMaxLevelXP);
  console.log(playerMinLevelXP);

  return (
    <div className=" absolute left-[43%] top-[18.8%] h-[3px] w-[56%]">
      <div className={` z-0 relative h-full w-full  bg-slate-100`}></div>
      <div
        style={{
          width: `${((playerCurrentXP - playerMinLevelXP) / (playerMaxLevelXP - playerMinLevelXP)) * 100}%`,
        }}
        className={` absolute h-full top-[0px] bg-yellow-600`}
      ></div>
    </div>
  );
};

export default PlayerExperienceBar;
