import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import React from "react";
import { useSelector } from "react-redux";
import {
  faWandSparkles,
  faShieldHalved,
  faHeart,
  faSquarePlus,
  faSquareMinus,
  faWandMagic,
  faSquareCheck,
  faSquareXmark,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StatType } from "@/app/types";

const LevelUpMenuMain = () => {
  const showLevelUpMenuStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.showLevelUpMenu,
  );

  const levelPoints = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerStat.levelPoints,
  );

  const playerStat = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerStat,
  );

  return (
    <>
      {showLevelUpMenuStatus && (
        <div className=" w-[250px] h-[230px]  lg:w-[500px] lg:h-[412px] xl:w-[400px] xl:h-[400px] overflow-hidden absolute top-[240px] right-[348px] lg:top-[56px] lg:right-[505px] ">
          <div className="closeLevelUpMenu h-[24px] w-[24px] top-[0px] right-[72px] lg:h-[34px] lg:w-[34px] lg:top-[5px] lg:right-[135px] absolute"></div>
          <img
            className=" absolute top-[-18px] left-[-35px] lg:top-[-25px] lg:left-[-73px]"
            src="/RPGUI/SelectedItemMenu.png"
            alt="selectedInventoryItemMenu"
          />

          <div className=" absolute top-[6%] left-[6%] w-[55%] ">
            <div className=" flex flex-row justify-center gap-2 ">
              <p className=" text-center text-slate-100 text-xs lg:text-xl ">Очки опыта: </p>
              <p className=" text-center text-slate-100 text-xs lg:text-xl ">{levelPoints}</p>
            </div>
          </div>

          <div className=" absolute top-[20%] left-[6%] w-[65%] ">
            <div className=" flex flex-col gap-2 ">
              <div className=" flex flex-row items-center gap-1 text-center justify-center text-slate-100 text-xs lg:text-xl">
                {playerStat.temporalDamage > 0 && (
                  <FontAwesomeIcon
                    data-type={StatType.Damage}
                    data-action="decrease"
                    className=" fa-2xl setStatButton "
                    icon={faSquareMinus}
                  />
                )}
                <FontAwesomeIcon className="" icon={faWandSparkles} />
                <p>
                  {
                    playerStat.baseDamage + playerStat.temporalDamage
                    //    + playerStat.extraDamage
                  }
                </p>
                {playerStat.levelPoints > 0 && (
                  <FontAwesomeIcon
                    data-type={StatType.Damage}
                    data-action="increase"
                    className=" fa-2xl setStatButton "
                    icon={faSquarePlus}
                  />
                )}
              </div>

              <div className=" flex flex-row items-center gap-1 text-center justify-center text-slate-100 text-xs lg:text-xl">
                {playerStat.temporalDefence > 0 && (
                  <FontAwesomeIcon
                    data-type={StatType.Defence}
                    data-action="decrease"
                    className=" fa-2xl setStatButton  "
                    icon={faSquareMinus}
                  />
                )}
                <FontAwesomeIcon className="" icon={faShieldHalved} />
                <p>{playerStat.baseDefence + playerStat.temporalDefence}</p>
                {playerStat.levelPoints > 0 && (
                  <FontAwesomeIcon
                    data-type={StatType.Defence}
                    data-action="increase"
                    className=" fa-2xl setStatButton "
                    icon={faSquarePlus}
                  />
                )}
              </div>

              <div className=" flex flex-row items-center gap-1 text-center justify-center text-slate-100 text-xs lg:text-xl">
                {playerStat.temporalHP > 0 && (
                  <FontAwesomeIcon
                    data-type={StatType.HP}
                    data-action="decrease"
                    className=" fa-2xl setStatButton "
                    icon={faSquareMinus}
                  />
                )}
                <FontAwesomeIcon className="" icon={faShieldHalved} />
                <p>{playerStat.baseHP + playerStat.temporalHP}</p>
                {playerStat.levelPoints > 0 && (
                  <FontAwesomeIcon
                    data-type={StatType.HP}
                    data-action="increase"
                    className=" fa-2xl setStatButton "
                    icon={faSquarePlus}
                  />
                )}
              </div>
            </div>
            <div className=" absolute bottom-[-60%] left-[6%] w-[85%] ">
              <div className=" flex flex-row items-center gap-1 text-center justify-evenly ">
                <FontAwesomeIcon className=" fa-2xl text-green-400 " icon={faCheckCircle} />
                <FontAwesomeIcon className=" fa-2xl text-rose-400 " icon={faSquareXmark} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LevelUpMenuMain;
