import { AppDispatch } from "@/app/store";
import { CoopGamesActions, ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import React, { MouseEvent, TouchEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { faTrash, faShirt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EquipmentWindow = () => {
  const UserEquipmentCanvasRef = useRef(null) as any;

  const [interactEquipmentElCoord, setInteractEquipmentElCoord] = useState({ top: 0, left: 0 });
  const [currentEquipmentElID, setCurrentEquipmentElID] = useState() as any;

  const showInteractWithEquipmentElStatus = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.showInteractWithEquipmentElStatus
  );

  const showEquipmentComponentStatus = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.showEquipmentComponent
  );
  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);

  const userInventoryObj = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.userInventory
  );

  const userEquipmentObj = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.userEquipment
  );

  const imgResources = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.imgResources);

  const dispatch = useDispatch<AppDispatch>();

  const showEquipmentComponent = (e: MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;
    dispatch(CoopGamesActions.showInteractWithEquipmentElStatus(false));

    dispatch(CoopGamesActions.setShowEquipmentComponent(!showEquipmentComponentStatus));
  };
  const touchShowEquipmentComponent = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;
    dispatch(CoopGamesActions.showInteractWithEquipmentElStatus(false));

    dispatch(CoopGamesActions.setShowEquipmentComponent(!showEquipmentComponentStatus));
  };
  const clickToEquipmentElHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;
    if (e.currentTarget.dataset.inventoryobjtype === "other") return;
    setCurrentEquipmentElID(e.currentTarget.dataset.inventoryobjid);
    if (currentEquipmentElID !== e.currentTarget.dataset.inventoryobjid) {
      dispatch(CoopGamesActions.showInteractWithEquipmentElStatus(true));
    } else {
      dispatch(
        CoopGamesActions.showInteractWithEquipmentElStatus(!showInteractWithEquipmentElStatus)
      );
    }
    console.log(e.currentTarget.offsetLeft);
    console.log(e.currentTarget.offsetTop);
    setInteractEquipmentElCoord({
      top: e.currentTarget.offsetTop,
      left: e.currentTarget.offsetLeft,
    });
  };
  const touchToEquipmentElHandler = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;
    if (e.currentTarget.dataset.inventoryobjtype === "other") return;

    setCurrentEquipmentElID(e.currentTarget.dataset.inventoryobjid);

    if (currentEquipmentElID !== e.currentTarget.dataset.inventoryobjid) {
      dispatch(CoopGamesActions.showInteractWithEquipmentElStatus(true));
    } else {
      dispatch(
        CoopGamesActions.showInteractWithEquipmentElStatus(!showInteractWithEquipmentElStatus)
      );
    }
    setInteractEquipmentElCoord({
      top: e.currentTarget.offsetTop,
      left: e.currentTarget.offsetLeft,
    });
  };
  const clickEquipObjectHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;
    console.log(currentEquipmentElID);
    socket?.emit("clientEquipObject", currentEquipmentElID);
    dispatch(CoopGamesActions.showInteractWithEquipmentElStatus(false));
  };
  const touchEquipObjectHandler = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;
    socket?.emit("clientEquipObject", currentEquipmentElID);
    dispatch(CoopGamesActions.showInteractWithEquipmentElStatus(false));
  };

  const height = Math.floor(16 * 1.5);
  const inventoryCellsEl = userInventoryObj.map((equipmentEl, index) => {
    const topPosition = 20 * 1.5 + Math.floor(index / 4) * 20 * 1.5;
    const leftPosition = Math.floor((78 + (index % 4) * 13 * 1.5) * 1.5);
    return (
      <div
        onClick={clickToEquipmentElHandler}
        onTouchStart={touchToEquipmentElHandler}
        style={{
          top: `${topPosition}px`,
          left: `${leftPosition}px`,
          height: `${height}px`,
          width: `${height}px`,
        }}
        className={`cursor-pointer absolute`}
        key={equipmentEl.id}
        data-inventoryobjid={equipmentEl.id}
        data-inventoryobjtype={equipmentEl.type}
      ></div>
    );
  });

  useEffect(() => {
    if (!socket?.id) return;
    if (!userInventoryObj) return;
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

      userInventoryObj.forEach((equipmentEl, index) => {
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
  }, [userInventoryObj]);

  useEffect(() => {
    const equipmentWindowCtx = UserEquipmentCanvasRef.current.getContext("2d");

    if (userEquipmentObj.helmet.length > 0) {
      equipmentWindowCtx.drawImage(
        imgResources.equipment,
        userEquipmentObj.helmet[0].XSpriteCoord,
        userEquipmentObj.helmet[0].YSpriteCoord,
        userEquipmentObj.helmet[0].sourceXLength,
        userEquipmentObj.helmet[0].sourceYLength,
        `${26 * 1.5}`,
        `${16 * 1.5}`,
        16 * 1.5,
        16 * 1.5
      );
    }
    if (userEquipmentObj.weapon.length > 0) {
      equipmentWindowCtx.drawImage(
        imgResources.equipment,
        userEquipmentObj.weapon[0].XSpriteCoord,
        userEquipmentObj.weapon[0].YSpriteCoord,
        userEquipmentObj.weapon[0].sourceXLength,
        userEquipmentObj.weapon[0].sourceYLength,
        `${44 * 1.5}`,
        `${32 * 1.5}`,
        16 * 1.5,
        16 * 1.5
      );
    }
    if (userEquipmentObj.shield.length > 0) {
      equipmentWindowCtx.drawImage(
        imgResources.equipment,
        userEquipmentObj.shield[0].XSpriteCoord,
        userEquipmentObj.shield[0].YSpriteCoord,
        userEquipmentObj.shield[0].sourceXLength,
        userEquipmentObj.shield[0].sourceYLength,
        `${10 * 1.5}`,
        `${32 * 1.5}`,
        16 * 1.5,
        16 * 1.5
      );
    }
    if (userEquipmentObj.armour.length > 0) {
      equipmentWindowCtx.drawImage(
        imgResources.equipment,
        userEquipmentObj.armour[0].XSpriteCoord,
        userEquipmentObj.armour[0].YSpriteCoord,
        userEquipmentObj.armour[0].sourceXLength,
        userEquipmentObj.armour[0].sourceYLength,
        `${27 * 1.5}`,
        `${32 * 1.5}`,
        16 * 1.5,
        16 * 1.5
      );
    }
    if (userEquipmentObj.boots.length > 0) {
      equipmentWindowCtx.drawImage(
        imgResources.equipment,
        userEquipmentObj.boots[0].XSpriteCoord,
        userEquipmentObj.boots[0].YSpriteCoord,
        userEquipmentObj.boots[0].sourceXLength,
        userEquipmentObj.boots[0].sourceYLength,
        `${27 * 1.5}`,
        `${48 * 1.5}`,
        16 * 1.5,
        16 * 1.5
      );
    }
    if (userEquipmentObj.ring.length > 0) {
      equipmentWindowCtx.drawImage(
        imgResources.equipment,
        userEquipmentObj.ring[0].XSpriteCoord,
        userEquipmentObj.ring[0].YSpriteCoord,
        userEquipmentObj.ring[0].sourceXLength,
        userEquipmentObj.ring[0].sourceYLength,
        `${10 * 1.5}`,
        `${64 * 1.5}`,
        16 * 1.5,
        16 * 1.5
      );
    }
    if (userEquipmentObj.amulet.length > 0) {
      equipmentWindowCtx.drawImage(
        imgResources.equipment,
        userEquipmentObj.amulet[0].XSpriteCoord,
        userEquipmentObj.amulet[0].YSpriteCoord,
        userEquipmentObj.amulet[0].sourceXLength,
        userEquipmentObj.amulet[0].sourceYLength,
        `${44 * 1.5}`,
        `${64 * 1.5}`,
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
        className={` cursor-pointer absolute h-[28px] w-[28px] top-[0px] right-[0px]`}
      ></div>
      {inventoryCellsEl}

      <div>
        <div
          style={{
            top: `${16 * 1.5}px`,
            left: `${26 * 1.5}px`,
            height: `${15 * 1.5}px`,
            width: `${15 * 1.5}px`,
          }}
          className=" absolute cursor-pointer"
          data-equipmentobjtype={"helmet"}
        ></div>
        <div
          style={{
            top: `${32 * 1.5}px`,
            left: `${10 * 1.5}px`,
            height: `${15 * 1.5}px`,
            width: `${15 * 1.5}px`,
          }}
          className=" absolute cursor-pointer"
          data-equipmentobjtype={"shield"}
        ></div>
        <div
          style={{
            top: `${32 * 1.5}px`,
            left: `${27 * 1.5}px`,
            height: `${15 * 1.5}px`,
            width: `${15 * 1.5}px`,
          }}
          className=" absolute cursor-pointer"
          data-equipmentobjtype={"armour"}
        ></div>
        <div
          style={{
            top: `${32 * 1.5}px`,
            left: `${44 * 1.5}px`,
            height: `${15 * 1.5}px`,
            width: `${15 * 1.5}px`,
          }}
          className=" absolute cursor-pointer"
          data-equipmentobjtype={"weapon"}
        ></div>
        <div
          style={{
            top: `${48 * 1.5}px`,
            left: `${27 * 1.5}px`,
            height: `${15 * 1.5}px`,
            width: `${15 * 1.5}px`,
          }}
          className=" absolute cursor-pointer"
          data-equipmentobjtype={"boots"}
        ></div>
        <div
          style={{
            top: `${64 * 1.5}px`,
            left: `${10 * 1.5}px`,
            height: `${15 * 1.5}px`,
            width: `${15 * 1.5}px`,
          }}
          className=" absolute cursor-pointer"
          data-equipmentobjtype={"ring"}
        ></div>
        <div
          style={{
            top: `${64 * 1.5}px`,
            left: `${44 * 1.5}px`,
            height: `${15 * 1.5}px`,
            width: `${15 * 1.5}px`,
          }}
          className=" absolute cursor-pointer"
          data-equipmentobjtype={"amulet"}
        ></div>
      </div>

      {showInteractWithEquipmentElStatus && (
        <div
          style={{
            top: `${interactEquipmentElCoord.top + 30}px`,
            left: `${interactEquipmentElCoord.left}px`,
          }}
          className="absolute"
        >
          <div className="flex gap-2">
            <div onClick={clickEquipObjectHandler} onTouchStart={touchEquipObjectHandler}>
              <FontAwesomeIcon className=" buttonCoopInteractWithEquipment fa-fw" icon={faShirt} />
            </div>
            <div>
              <FontAwesomeIcon className=" buttonCoopInteractWithEquipment fa-fw" icon={faTrash} />
            </div>
          </div>
        </div>
      )}
      <canvas ref={UserEquipmentCanvasRef} width={252} height={165}></canvas>
    </div>
  );
};

export default EquipmentWindow;
