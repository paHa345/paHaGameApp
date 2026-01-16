import { AppDispatch } from "@/app/store";
import { CoopGamesActions, ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
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
    if (window.navigator.maxTouchPoints !== 0) return;

    dispatch(CoopGamesActions.setShowLevelsComponent(!showLevelsComponentStatus));
  };
  const touchShowLevelsComponent = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;

    dispatch(CoopGamesActions.setShowLevelsComponent(!showLevelsComponentStatus));
  };
  const clickLevelUpHandler = function (this: string, e: MouseEvent<HTMLDivElement>) {
    if (window.navigator.maxTouchPoints !== 0) return;

    socket?.emit("clientLevelUpHandler", { userID: socket.id, upStat: this });
  };
  const touchLevelUpHandler = function (this: string, e: TouchEvent<HTMLDivElement>) {
    if (window.navigator.maxTouchPoints === 0) return;

    console.log(this);
    socket?.emit("clientLevelUpHandler", { userID: socket.id, upStat: this });
  };

  useEffect(() => {
    if (!socket?.id) return;
    if (!gamersUserStat) return;
    if (gamersUserStat[socket?.id] === undefined) return;

    var levelWindowCtx = UserLevelCanvasRef.current.getContext("2d");

    if (imgResources.levelUserWindow) {
      levelWindowCtx.drawImage(imgResources.levelUserWindow, 5, 0, 117, 135, 0, 0, 180, 210);
      if (gamersUserStat[socket?.id].levelPoints > 0) {
        levelWindowCtx.font = "20px serif";
        levelWindowCtx.fillText(gamersUserStat[socket?.id].levelPoints, 135, 57);
        levelWindowCtx.drawImage(imgResources.levelUserWindow, 4, 140, 12, 12, 35, 75, 18, 18);
        levelWindowCtx.drawImage(imgResources.levelUserWindow, 4, 140, 12, 12, 35, 107, 18, 18);
        levelWindowCtx.drawImage(imgResources.levelUserWindow, 4, 140, 12, 12, 35, 140, 18, 18);
      }
      levelWindowCtx.font = "14px serif";

      levelWindowCtx.fillText(gamersUserStat[socket?.id].baseHP, 100, 92);
      levelWindowCtx.fillText(gamersUserStat[socket?.id].currentDamage, 100, 125);
      levelWindowCtx.fillText(gamersUserStat[socket?.id].currentArmour, 100, 158);
    }
  }, [socket?.id !== undefined ? gamersUserStat[socket?.id] : gamersUserStat]);

  return (
    <div className={`${showLevelsComponentStatus ? "z-[45]" : "z-0"} absolute top-20 left-32`}>
      <div
        onClick={clickLevelUpHandler.bind("HP")}
        onTouchStart={touchLevelUpHandler.bind("HP")}
        className={`absolute h-[22px] w-[22px] top-[72px] left-[32px]`}
      ></div>
      <div
        onClick={clickLevelUpHandler.bind("damage")}
        onTouchStart={touchLevelUpHandler.bind("damage")}
        className={`absolute h-[22px] w-[22px] top-[105px] left-[32px]`}
      ></div>
      <div
        onClick={clickLevelUpHandler.bind("armour")}
        onTouchStart={touchLevelUpHandler.bind("armour")}
        className={`absolute h-[22px] w-[22px] top-[138px] left-[32px]`}
      ></div>
      <div
        onClick={showLevelsComponent}
        onTouchStart={touchShowLevelsComponent}
        className={`absolute h-[22px] w-[22px] top-[0px] right-[0px]`}
      ></div>
      <canvas ref={UserLevelCanvasRef} width={180} height={210}></canvas>
    </div>
  );
};

export default LevelsWindow;
