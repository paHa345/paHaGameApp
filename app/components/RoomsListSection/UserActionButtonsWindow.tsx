import { ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import React, { TouchEvent, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const UserActionButtonsWindow = () => {
  const UserActionButtonCanvasRef = useRef(null) as any;

  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);
  const actionButtonData = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.actionButtonData
  );
  const imgResources = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.imgResources);
  const currentRoomID = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.currentJoinedRoomID
  );

  const clickPickUpLootHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;

    console.log("Подобрать предметы");
    socket?.emit("clientPickUpLootHandler", currentRoomID);
  };
  const touchPickUpLootHandler = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;

    console.log("Подобрать предметы");
    socket?.emit("clientPickUpLootHandler", currentRoomID);
  };

  useEffect(() => {
    if (!socket?.id) return;
    if (!actionButtonData) return;

    const levelWindowCtx = UserActionButtonCanvasRef.current.getContext("2d");

    if (imgResources.userActionButtons) {
      levelWindowCtx.drawImage(imgResources.userActionButtons, 0, 0, 31, 31, 0, 0, 40, 40);
    }
  }, [actionButtonData]);

  return (
    <div
      onClick={clickPickUpLootHandler}
      onTouchStart={touchPickUpLootHandler}
      className={`cursor-pointer bg-orange-200 border-4 border-solid border-orange-900 rounded-full ${actionButtonData.showButtonStatus ? "z-[45]" : "z-0"} absolute bottom-44 left-32`}
    >
      <canvas className={`z-[44]`} ref={UserActionButtonCanvasRef} width={40} height={40}></canvas>
    </div>
  );
};

export default UserActionButtonsWindow;
