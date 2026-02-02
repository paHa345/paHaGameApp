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

  useEffect(() => {
    if (!socket?.id) return;
    if (!userEquipmentObj) return;
    // if (gamersUserStat[socket?.id] === undefined) return;

    var equipmentWindowCtx = UserEquipmentCanvasRef.current.getContext("2d");

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

      //   userEquipmentObj.forEach((equipmentEl)=>{

      //   })

      equipmentWindowCtx.drawImage(
        imgResources.equipment,
        57,
        64,
        114,
        107,
        `${78 * 1.5}`,
        `${20 * 1.5}`,
        16 * 1.5,
        16 * 1.5
      );
    }
  }, [userEquipmentObj]);

  return (
    <div className={`${showEquipmentComponentStatus ? "z-[45]" : "z-0"} absolute top-20 left-32`}>
      <div
        onClick={showEquipmentComponent}
        onTouchStart={touchShowEquipmentComponent}
        className={`absolute h-[28px] w-[28px] top-[0px] right-[0px]`}
      ></div>
      <canvas ref={UserEquipmentCanvasRef} width={252} height={165}></canvas>
    </div>
  );
};

export default EquipmentWindow;
