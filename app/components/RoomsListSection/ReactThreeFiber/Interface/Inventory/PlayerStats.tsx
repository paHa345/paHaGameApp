import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import React from "react";
import { useSelector } from "react-redux";
import { faWandSparkles, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PlayerStats = () => {
  const playerStat = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerStat,
  );
  return (
    <div className=" absolute top-[20%] left-[8%] text-slate-200 text-sm lg:text-xl">
      <div className=" flex flex-col gap-1 ">
        <div className=" flex flex-row gap-1">
          <FontAwesomeIcon className="" icon={faWandSparkles} />
          <p>{playerStat.baseDamage + playerStat.extraDamage}</p>
        </div>
        <div className=" flex flex-row gap-1">
          <FontAwesomeIcon className="" icon={faShieldHalved} />
          <p>{playerStat.baseDefence + playerStat.extraDefence}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
