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

  const userSelectedInventoryEquipmentElData = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.userSelectedInventoryEquipmentElData
  );
  const userSelectedInventoryElID = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.userSelectedInventoryElID
  );

  const userEquipmentObj = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.userEquipment
  );
  const userSelectedEquipmentObjType = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.selectedEquipmentObjType
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
    console.log(userSelectedInventoryElID);
    socket?.emit("clientEquipObject", userSelectedInventoryElID);
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
    socket?.emit("clientEquipObject", userSelectedInventoryElID);
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

    console.log("Take off equipment");

    socket?.emit("clientTakeOffEquipmentObject", {
      equipmentObjectType: userSelectedEquipmentObjType.objType,
      equipmentObjectID: userEquipmentObj[userSelectedEquipmentObjType.objType][0].id,
    });

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
    console.log("Take off equipment");

    // socket?.emit("clientEquipObject", userSelectedEquipmentElID);
    // dispatch(CoopGamesActions.showInteractWithInventoryElStatus(false));

    socket?.emit("clientTakeOffEquipmentObject", {
      equipmentObjectType: userSelectedEquipmentObjType.objType,
      equipmentObjectID: userEquipmentObj[userSelectedEquipmentObjType.objType][0].id,
    });
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

    // if (userSelectedInventoryEquipmentElData.damage > 0) {
    InventoryEquipmentInteractMenyCtx.drawImage(
      imgResources.inventoryEquipmentInteract,
      56,
      140,
      20,
      20,
      5,
      27,
      20,
      20
    );
    // }
    // if (userSelectedInventoryEquipmentElData.armour > 0) {
    InventoryEquipmentInteractMenyCtx.drawImage(
      imgResources.inventoryEquipmentInteract,
      21,
      142,
      17,
      20,
      30,
      27,
      17,
      20
    );
    // }
    // if (userSelectedInventoryEquipmentElData.HP > 0) {
    InventoryEquipmentInteractMenyCtx.drawImage(
      imgResources.inventoryEquipmentInteract,
      37,
      142,
      19,
      20,
      55,
      27,
      19,
      20
    );
    // }
  }, [
    showInteractWithInventoryAndEquipmentElStatus.interactTo,
    showInteractWithInventoryAndEquipmentElStatus.showStatus,
    userSelectedInventoryEquipmentElData,
  ]);

  //   useEffect(() => {
  //     const InventoryEquipmentInteractMenyCtx =
  //       InventoryEquipmentInteractMenyRef.current.getContext("2d");

  //     InventoryEquipmentInteractMenyCtx.clearRect(0, 0, 30, 30);

  //     if (userSelectedInventoryEquipmentElData.damage > 0) {
  //       InventoryEquipmentInteractMenyCtx.drawImage(
  //         imgResources.inventoryEquipmentInteract,
  //         56,
  //         140,
  //         30,
  //         30,
  //         5,
  //         5,
  //         30,
  //         30
  //       );
  //     }
  //   }, [userSelectedInventoryEquipmentElData]);

  return (
    <div>
      <div
        className=" absolute"
        style={{
          top: `${showInteractWithInventoryAndEquipmentElStatus.YCoord + 30}px`,
          left: `${showInteractWithInventoryAndEquipmentElStatus.XCoord}px`,
        }}
      >
        <div className=" absolute top-[44px] left-1">
          {userSelectedInventoryEquipmentElData.damage > 0 ? (
            <div className=" absolute flex text-xs ">
              {" "}
              <div>+</div> <div>{userSelectedInventoryEquipmentElData.damage}</div>
            </div>
          ) : (
            <div className=" absolute flex text-sm left-[9px] ">-</div>
          )}
          {userSelectedInventoryEquipmentElData.armour > 0 ? (
            <div className=" absolute text-xs  flex left-[25px] ">
              {" "}
              <div>+</div> {userSelectedInventoryEquipmentElData.armour}
            </div>
          ) : (
            <div className=" absolute flex text-sm top-0 left-[34px] ">-</div>
          )}
          {userSelectedInventoryEquipmentElData.HP > 0 ? (
            <div className=" absolute text-xs  flex left-[50px] ">
              {" "}
              <div>+</div> {userSelectedInventoryEquipmentElData.HP}
            </div>
          ) : (
            <div className=" absolute flex text-xs top-0 left-[59px] ">-</div>
          )}
        </div>
        <div
          onClick={clickCloseMenuHandler}
          onTouchStart={touchCloseMenuHandler}
          className=" absolute h-5 w-5 top-0 right-0  cursor-pointer "
        ></div>
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
