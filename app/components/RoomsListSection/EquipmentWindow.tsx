import { AppDispatch } from "@/app/store";
import { CoopGamesActions, ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import React, { MouseEvent, TouchEvent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const EquipmentWindow = () => {
  const UserEquipmentCanvasRef = useRef(null) as any;

  const showEquipmentComponentStatus = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.showEquipmentComponent
  );
  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);

  const userEquipmentObj = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.userInventory
  );

  const gamersUserStat = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.statObj.gamers
  );
  const imgResources = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.imgResources);

  const dispatch = useDispatch<AppDispatch>();

  const showEquipmentComponent = (e: MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;

    dispatch(CoopGamesActions.setShowEquipmentComponent(!showEquipmentComponentStatus));
  };
  const touchShowEquipmentComponent = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;

    dispatch(CoopGamesActions.setShowEquipmentComponent(!showEquipmentComponentStatus));
  };
  const clickToEquipmentElHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;
    console.log(e.currentTarget.dataset.equipmentobjid);
    console.log(e.currentTarget.dataset.equipmentobjtype);
  };
  const touchToEquipmentElHandler = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;
    console.log(e.currentTarget.dataset.equipmentobjid);
    console.log(e.currentTarget.dataset.equipmentobjtype);
  };

  const height = Math.floor(16 * 1.5);
  const equipment = userEquipmentObj.map((equipmentEl, index) => {
    const topPosition = 20 * 1.5 + Math.floor(index / 4) * 20 * 1.5;
    const leftPosition = Math.floor((78 + (index % 4) * 13 * 1.5) * 1.5);
    return (
      <div
        onClick={clickToEquipmentElHandler}
        onTouchStart={touchToEquipmentElHandler}
        style={{ top: `${topPosition}px`, left: `${leftPosition}px` }}
        className={`cursor-pointer absolute h-[${height}px] w-[${height}px]`}
        key={equipmentEl.id}
        data-equipmentobjid={equipmentEl.id}
        data-equipmentobjtype={equipmentEl.type}
      ></div>
    );
  });

  useEffect(() => {
    if (!socket?.id) return;
    if (!userEquipmentObj) return;
    // if (gamersUserStat[socket?.id] === undefined) return;

    const equipmentWindowCtx = UserEquipmentCanvasRef.current.getContext("2d");

    if (imgResources.equipmentUserWindow) {
      equipmentWindowCtx.drawImage(
        imgResources.equipmentUserWindow,
        5,
        0,
        168,
        110,
        0,
        0,
        252,
        165
      );

      userEquipmentObj.forEach((equipmentEl, index) => {
        equipmentWindowCtx.drawImage(
          imgResources.equipment,
          equipmentEl.XSpriteCoord,
          equipmentEl.YSpriteCoord,
          equipmentEl.sourceXLength,
          equipmentEl.sourceYLength,
          `${(78 + (index % 4) * 13 * 1.5) * 1.5}`,
          `${20 * 1.5 + Math.floor(index / 4) * 20 * 1.5}`,
          16 * 1.5,
          16 * 1.5
        );
      });
    }
  }, [userEquipmentObj]);

  return (
    <div className={`${showEquipmentComponentStatus ? "z-[45]" : "z-0"} absolute top-20 left-32`}>
      <div
        onClick={showEquipmentComponent}
        onTouchStart={touchShowEquipmentComponent}
        className={` cursor-pointer absolute h-[28px] w-[28px] top-[0px] right-[0px]`}
      ></div>
      {/* <div className={`absolute h-[${height}px] w-[${height}px] top-[30px] left-[145px]`}></div>
      <div className={`absolute h-[${height}px] w-[${height}px] top-[30px] left-[178px]`}></div>
      <div className={`absolute h-[${height}px] w-[${height}px] top-[30px] left-[210px]`}></div>
      <div
        className={`absolute h-[${height}px] w-[${height}px] top-[${20 * 1.5 + Math.floor(4 / 4) * 20 * 1.5}px] left-[114px]`}
      ></div> */}
      {equipment}
      <canvas ref={UserEquipmentCanvasRef} width={252} height={165}></canvas>
    </div>
  );
};

export default EquipmentWindow;
