import { AppDispatch } from "@/app/store";
import { CoopGamesActions, ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import React, { MouseEvent, TouchEvent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const InventoryAndEquipmentInteractMeny = () => {
  const InventoryEquipmentInteractMenyRef = useRef(null) as any;
  const imgResources = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.imgResources);
  const showInteractWithInventoryAndEquipmentElStatus = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.showInteractWithInventoryAndEquipmentElStatus
  );

  const userSelectedEquipmentElID = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.userSelectedEquipmentElID
  );

  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);

  const dispatch = useDispatch<AppDispatch>();

  const clickCloseMenuHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;
    dispatch(
      CoopGamesActions.showInteractWithInventoryElStatus({
        showStatus: false,
        interactTo: "inventory",
        XCoord: e.currentTarget.offsetLeft,
        YCoord: e.currentTarget.offsetTop,
      })
    );
  };
  const touchCloseMenuHandler = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;
    dispatch(
      CoopGamesActions.showInteractWithInventoryElStatus({
        showStatus: false,
        interactTo: "inventory",
        XCoord: e.currentTarget.offsetLeft,
        YCoord: e.currentTarget.offsetTop,
      })
    );
  };

  const clickEquipObjectHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;
    console.log(userSelectedEquipmentElID);
    socket?.emit("clientEquipObject", userSelectedEquipmentElID);
    // dispatch(CoopGamesActions.showInteractWithInventoryElStatus(false));
    dispatch(
      CoopGamesActions.showInteractWithInventoryElStatus({
        showStatus: false,
        interactTo: "inventory",
        XCoord: e.currentTarget.offsetLeft,
        YCoord: e.currentTarget.offsetTop,
      })
    );
  };

  const touchEquipObjectHandler = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;
    socket?.emit("clientEquipObject", userSelectedEquipmentElID);
    // dispatch(CoopGamesActions.showInteractWithInventoryElStatus(false));
    dispatch(
      CoopGamesActions.showInteractWithInventoryElStatus({
        showStatus: false,
        interactTo: "inventory",
        XCoord: e.currentTarget.offsetLeft,
        YCoord: e.currentTarget.offsetTop,
      })
    );
  };

  const clickTakeOffEquipedObjHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;
    // socket?.emit("clientEquipObject", userSelectedEquipmentElID);
    // dispatch(CoopGamesActions.showInteractWithInventoryElStatus(false));
    dispatch(
      CoopGamesActions.showInteractWithInventoryElStatus({
        showStatus: false,
        interactTo: "inventory",
        XCoord: e.currentTarget.offsetLeft,
        YCoord: e.currentTarget.offsetTop,
      })
    );
  };

  const touchTakeOffEquipedObjHandler = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;
    // socket?.emit("clientEquipObject", userSelectedEquipmentElID);
    // dispatch(CoopGamesActions.showInteractWithInventoryElStatus(false));
    dispatch(
      CoopGamesActions.showInteractWithInventoryElStatus({
        showStatus: false,
        interactTo: "inventory",
        XCoord: e.currentTarget.offsetLeft,
        YCoord: e.currentTarget.offsetTop,
      })
    );
  };

  useEffect(() => {
    const InventoryEquipmentInteractMenyCtx =
      InventoryEquipmentInteractMenyRef.current.getContext("2d");

    InventoryEquipmentInteractMenyCtx.drawImage(
      imgResources.inventoryEquipmentInteract,
      22,
      3,
      80,
      100,
      0,
      0,
      80,
      100
    );

    if (showInteractWithInventoryAndEquipmentElStatus.interactTo === "inventory") {
      InventoryEquipmentInteractMenyCtx.drawImage(
        imgResources.inventoryEquipmentInteract,
        15,
        105,
        44,
        16,
        3,
        75,
        44,
        16
      );
      InventoryEquipmentInteractMenyCtx.drawImage(
        imgResources.inventoryEquipmentInteract,
        61,
        107,
        30,
        22,
        45,
        70,
        30,
        22
      );
    }
    if (showInteractWithInventoryAndEquipmentElStatus.interactTo === "equipment") {
      InventoryEquipmentInteractMenyCtx.drawImage(
        imgResources.inventoryEquipmentInteract,
        17,
        124,
        40,
        16,
        23,
        75,
        40,
        16
      );
      //   InventoryEquipmentInteractMenyCtx.drawImage(
      //     imgResources.inventoryEquipmentInteract,
      //     61,
      //     107,
      //     30,
      //     22,
      //     45,
      //     70,
      //     30,
      //     22
      //   );
    }
  }, [
    showInteractWithInventoryAndEquipmentElStatus.interactTo,
    showInteractWithInventoryAndEquipmentElStatus.showStatus,
  ]);

  return (
    <div>
      <div
        onClick={clickCloseMenuHandler}
        onTouchStart={touchCloseMenuHandler}
        className=" absolute"
        style={{
          top: `${showInteractWithInventoryAndEquipmentElStatus.YCoord + 30}px`,
          left: `${showInteractWithInventoryAndEquipmentElStatus.XCoord}px`,
        }}
      >
        <div className=" absolute h-5 w-5 top-0 right-0  cursor-pointer "></div>
        {showInteractWithInventoryAndEquipmentElStatus.interactTo === "inventory" && (
          <div>
            <div
              onClick={clickEquipObjectHandler}
              onTouchStart={touchEquipObjectHandler}
              style={{ height: `16px`, width: `44px`, bottom: `8px`, left: `3px` }}
              className=" absolute cursor-pointer "
            ></div>
            <div
              style={{ height: `22px`, width: `30px`, bottom: `8px`, right: `3px` }}
              className=" absolute cursor-pointer "
            ></div>
          </div>
        )}
        {showInteractWithInventoryAndEquipmentElStatus.interactTo === "equipment" && (
          <div>
            <div
              onClick={clickTakeOffEquipedObjHandler}
              onTouchStart={touchTakeOffEquipedObjHandler}
              style={{ height: `16px`, width: `40px`, bottom: `8px`, left: `23px` }}
              className=" absolute cursor-pointer "
            ></div>
          </div>
        )}
        <canvas ref={InventoryEquipmentInteractMenyRef} width={80} height={100}></canvas>
      </div>
    </div>
  );
};

export default InventoryAndEquipmentInteractMeny;
