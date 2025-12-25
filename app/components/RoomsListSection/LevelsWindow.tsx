import { AppDispatch } from "@/app/store";
import { CoopGamesActions, ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import { th } from "framer-motion/client";
import React, { MouseEvent, TouchEvent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const LevelsWindow = () => {
  const UserLevelCanvasRef = useRef(null) as any;

  const showLevelsComponentStatus = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.showLevelsComponent
  );
  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);

  const gamersUserStat = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.statObj.gamers
  );
  const imgResources = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.imgResources);

  const dispatch = useDispatch<AppDispatch>();

  const showLevelsComponent = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(CoopGamesActions.setShowLevelsComponent(!showLevelsComponentStatus));
  };
  const touchShowLevelsComponent = (e: TouchEvent<HTMLDivElement>) => {
    dispatch(CoopGamesActions.setShowLevelsComponent(!showLevelsComponentStatus));
  };
  const clickLevelUpHandler = function (this: string, e: MouseEvent<HTMLDivElement>) {
    console.log(this);
    socket?.emit("clientLevelUpHandler", { userID: socket.id, upStat: this });
  };
  const touchLevelUpHandler = function (this: string, e: TouchEvent<HTMLDivElement>) {
    console.log(this);
  };

  useEffect(() => {
    if (!socket?.id) return;
    if (!gamersUserStat) return;
    if (gamersUserStat[socket?.id] === undefined) return;

    var levelWindowCtx = UserLevelCanvasRef.current.getContext("2d");

    if (imgResources.levelUserWindow) {
      levelWindowCtx.drawImage(imgResources.levelUserWindow, 5, 0, 117, 135, 0, 0, 120, 140);
      if (gamersUserStat[socket?.id].levelPoints > 0) {
        levelWindowCtx.font = "20px serif";
        levelWindowCtx.fillText(gamersUserStat[socket?.id].levelPoints, 93, 39);
        levelWindowCtx.drawImage(imgResources.levelUserWindow, 4, 140, 12, 12, 25, 50, 12, 12);
        levelWindowCtx.drawImage(imgResources.levelUserWindow, 4, 140, 12, 12, 25, 72, 12, 12);
        levelWindowCtx.drawImage(imgResources.levelUserWindow, 4, 140, 12, 12, 25, 94, 12, 12);
      }
      levelWindowCtx.font = "14px serif";

      levelWindowCtx.fillText(gamersUserStat[socket?.id].baseHP, 70, 62);
      levelWindowCtx.fillText(gamersUserStat[socket?.id].currentDamage, 70, 85);
      levelWindowCtx.fillText(gamersUserStat[socket?.id].currentArmour, 70, 107);
    }
  }, [socket?.id !== undefined ? gamersUserStat[socket?.id] : gamersUserStat]);

  return (
    <div className={`${showLevelsComponentStatus ? "z-[45]" : "z-0"} absolute top-20 left-32`}>
      <div
        onClick={clickLevelUpHandler.bind("HP")}
        onTouchStart={touchLevelUpHandler.bind("HP")}
        className={`absolute h-[16px] w-[16px] top-[48px] left-[23px]`}
      ></div>
      <div
        onClick={clickLevelUpHandler.bind("damage")}
        onTouchStart={touchLevelUpHandler.bind("damage")}
        className={`absolute h-[16px] w-[16px] top-[70px] left-[23px]`}
      ></div>
      <div
        onClick={clickLevelUpHandler.bind("armour")}
        onTouchStart={touchLevelUpHandler.bind("armour")}
        className={`absolute h-[16px] w-[16px] top-[92px] left-[23px]`}
      ></div>
      <div
        onClick={showLevelsComponent}
        onTouchStart={touchShowLevelsComponent}
        className={`absolute h-[16px] w-[16px] top-[0px] right-[0px]`}
      ></div>
      <canvas ref={UserLevelCanvasRef} width={120} height={140}></canvas>
    </div>
  );
};

export default LevelsWindow;
