import { AppDispatch } from "@/app/store";
import { CoopGamesActions, ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import React, { MouseEvent, TouchEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { faTrash, faShirt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { div } from "framer-motion/client";
import InventoryAndEquipmentInteractMeny from "./InventoryAndEquipmentInteractMeny";

const EquipmentWindow = () => {
  const UserEquipmentCanvasRef = useRef(null) as any;

  const [interactEquipmentElCoord, setInteractEquipmentElCoord] = useState({ top: 0, left: 0 });
  //   const [currentEquipmentElID, setCurrentEquipmentElID] = useState() as any;

  const userSelectedInventoryElID = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.userSelectedInventoryElID
  );

  const showInteractWithInventoryAndEquipmentElStatus = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.showInteractWithInventoryAndEquipmentElStatus
  );

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

  const selectedEquipmentObjType = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.selectedEquipmentObjType
  );

  const imgResources = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.imgResources);

  const dispatch = useDispatch<AppDispatch>();

  const showEquipmentComponent = (e: MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;
    // dispatch(CoopGamesActions.showInteractWithInventoryElStatus(false));
    dispatch(
      CoopGamesActions.showInteractWithInventoryElStatus({
        showStatus: false,
        interactTo: "inventory",
        XCoord: e.currentTarget.offsetLeft,
        YCoord: e.currentTarget.offsetTop,
      })
    );
    dispatch(CoopGamesActions.setShowEquipmentComponent(!showEquipmentComponentStatus));
    dispatch(CoopGamesActions.showInteractWithEquipmentElStatus(false));
  };

  const touchShowEquipmentComponent = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;
    // dispatch(CoopGamesActions.showInteractWithInventoryElStatus(false));
    dispatch(
      CoopGamesActions.showInteractWithInventoryElStatus({
        showStatus: false,
        interactTo: "inventory",
        XCoord: e.currentTarget.offsetLeft,
        YCoord: e.currentTarget.offsetTop,
      })
    );
    dispatch(CoopGamesActions.setShowEquipmentComponent(!showEquipmentComponentStatus));
    dispatch(CoopGamesActions.showInteractWithEquipmentElStatus(false));
  };

  const clickToInventoryElHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;
    if (e.currentTarget.dataset.inventoryobjtype === "other") return;
    // setCurrentEquipmentElID(e.currentTarget.dataset.inventoryobjid);
    dispatch(CoopGamesActions.setUserSelectedInventoryElID(e.currentTarget.dataset.inventoryobjid));

    console.log(userInventoryObj);

    if (userSelectedInventoryElID !== e.currentTarget.dataset.inventoryobjid) {
      dispatch(
        CoopGamesActions.showInteractWithInventoryElStatus({
          showStatus: true,
          interactTo: "inventory",
          XCoord: e.currentTarget.offsetLeft,
          YCoord: e.currentTarget.offsetTop,
        })
      );
    } else {
      dispatch(
        CoopGamesActions.showInteractWithInventoryElStatus({
          showStatus: !showInteractWithInventoryAndEquipmentElStatus.showStatus,
          interactTo: "inventory",
          XCoord: e.currentTarget.offsetLeft,
          YCoord: e.currentTarget.offsetTop,
        })
      );
    }
    console.log(e.currentTarget.offsetLeft);
    console.log(e.currentTarget.offsetTop);
    setInteractEquipmentElCoord({
      top: e.currentTarget.offsetTop,
      left: e.currentTarget.offsetLeft,
    });
  };

  const touchToInventoryElHandler = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;
    if (e.currentTarget.dataset.inventoryobjtype === "other") return;

    dispatch(CoopGamesActions.setUserSelectedInventoryElID(e.currentTarget.dataset.inventoryobjid));

    // setCurrentEquipmentElID(e.currentTarget.dataset.inventoryobjid);
    if (userSelectedInventoryElID !== e.currentTarget.dataset.inventoryobjid) {
      dispatch(
        CoopGamesActions.showInteractWithInventoryElStatus({
          showStatus: true,
          interactTo: "inventory",
          XCoord: e.currentTarget.offsetLeft,
          YCoord: e.currentTarget.offsetTop,
        })
      );
    } else {
      dispatch(
        CoopGamesActions.showInteractWithInventoryElStatus({
          showStatus: !showInteractWithInventoryAndEquipmentElStatus.showStatus,
          interactTo: "inventory",
          XCoord: e.currentTarget.offsetLeft,
          YCoord: e.currentTarget.offsetTop,
        })
      );
    }
    setInteractEquipmentElCoord({
      top: e.currentTarget.offsetTop,
      left: e.currentTarget.offsetLeft,
    });
  };

  //   const clickEquipObjectHandler = (e: MouseEvent<HTMLDivElement>) => {
  //     if (window.navigator.maxTouchPoints !== 0) return;
  //     console.log(userSelectedEquipmentElID);
  //     socket?.emit("clientEquipObject", userSelectedEquipmentElID);
  //     dispatch(CoopGamesActions.showInteractWithInventoryElStatus(false));
  //   };

  //   const touchEquipObjectHandler = (e: TouchEvent<HTMLDivElement>) => {
  //     if (window.navigator.maxTouchPoints === 0) return;
  //     socket?.emit("clientEquipObject", userSelectedEquipmentElID);
  //     dispatch(CoopGamesActions.showInteractWithInventoryElStatus(false));
  //   };

  const clickThrowOutInventionObjHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;
    console.log(userSelectedInventoryElID);
    // socket?.emit("clientEquipObject", currentEquipmentElID);
    // dispatch(CoopGamesActions.showInteractWithEquipmentElStatus(false));
  };
  const touchThrowOutInventionObjHandler = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;
    console.log(userSelectedInventoryElID);

    // socket?.emit("clientEquipObject", currentEquipmentElID);
    // dispatch(CoopGamesActions.showInteractWithEquipmentElStatus(false));
  };
  const clickShowInteractManuHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;
    if (!e.currentTarget.dataset.equipmentobjtype) return;

    dispatch(
      CoopGamesActions.setSelectedEquipmentObjType({
        objType: e.currentTarget.dataset.equipmentobjtype as
          | "helmet"
          | "weapon"
          | "shield"
          | "armour"
          | "boots"
          | "ring"
          | "amulet",
        timeStamp: Date.now(),
        XCoord: e.currentTarget.offsetLeft,
        YCoord: e.currentTarget.offsetTop,
      })
    );
  };
  const touchShowInteractManuHandler = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;
    if (!e.currentTarget.dataset.equipmentobjtype) return;
    dispatch(
      CoopGamesActions.setSelectedEquipmentObjType({
        objType: e.currentTarget.dataset.equipmentobjtype as
          | "helmet"
          | "weapon"
          | "shield"
          | "armour"
          | "boots"
          | "ring"
          | "amulet",
        timeStamp: Date.now(),
        XCoord: e.currentTarget.offsetLeft,
        YCoord: e.currentTarget.offsetTop,
      })
    );
  };

  const height = Math.floor(16 * 1.5);
  const inventoryCellsEl = userInventoryObj.map((equipmentEl, index) => {
    const topPosition = 20 * 1.5 + Math.floor(index / 4) * 20 * 1.5;
    const leftPosition = Math.floor((78 + (index % 4) * 13 * 1.5) * 1.5);
    return (
      <div
        onClick={clickToInventoryElHandler}
        onTouchStart={touchToInventoryElHandler}
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
    if (userEquipmentObj[selectedEquipmentObjType.objType].length <= 0) return;

    dispatch(
      CoopGamesActions.showInteractWithInventoryElStatus({
        showStatus: true,
        interactTo: "equipment",
        XCoord: selectedEquipmentObjType.XCoord,
        YCoord: selectedEquipmentObjType.YCoord,
      })
    );
  }, [selectedEquipmentObjType]);

  useEffect(() => {
    const el = userInventoryObj.filter((el) => {
      return el.id === userSelectedInventoryElID;
    });
    if (!el[0]) return;
    dispatch(
      CoopGamesActions.setUserSelectedInventoryEquipmentElData({
        damage: el[0].damage,
        armour: el[0].armour,
        HP: el[0].HP,
      })
    );
  }, [userSelectedInventoryElID]);

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
    // if (showInteractWithEquipmentElStatus) {
    //   equipmentWindowCtx.drawImage(
    //     imgResources.userActionButtons2,
    //     96,
    //     39,
    //     35,
    //     25,
    //     interactEquipmentElCoord.left,
    //     interactEquipmentElCoord.top + 30,
    //     35,
    //     25
    //   );
    // }
  }, [userInventoryObj, showInteractWithEquipmentElStatus, userEquipmentObj]);

  //   useEffect(() => {
  //     const equipmentWindowCtx = UserEquipmentCanvasRef.current.getContext("2d");

  //     if (userEquipmentObj.helmet.length > 0) {
  //       equipmentWindowCtx.drawImage(
  //         imgResources.equipment,
  //         userEquipmentObj.helmet[0].XSpriteCoord,
  //         userEquipmentObj.helmet[0].YSpriteCoord,
  //         userEquipmentObj.helmet[0].sourceXLength,
  //         userEquipmentObj.helmet[0].sourceYLength,
  //         `${26 * 1.5}`,
  //         `${16 * 1.5}`,
  //         16 * 1.5,
  //         16 * 1.5
  //       );
  //     }
  //     if (userEquipmentObj.weapon.length > 0) {
  //       equipmentWindowCtx.drawImage(
  //         imgResources.equipment,
  //         userEquipmentObj.weapon[0].XSpriteCoord,
  //         userEquipmentObj.weapon[0].YSpriteCoord,
  //         userEquipmentObj.weapon[0].sourceXLength,
  //         userEquipmentObj.weapon[0].sourceYLength,
  //         `${44 * 1.5}`,
  //         `${32 * 1.5}`,
  //         16 * 1.5,
  //         16 * 1.5
  //       );
  //     }
  //     if (userEquipmentObj.shield.length > 0) {
  //       equipmentWindowCtx.drawImage(
  //         imgResources.equipment,
  //         userEquipmentObj.shield[0].XSpriteCoord,
  //         userEquipmentObj.shield[0].YSpriteCoord,
  //         userEquipmentObj.shield[0].sourceXLength,
  //         userEquipmentObj.shield[0].sourceYLength,
  //         `${10 * 1.5}`,
  //         `${32 * 1.5}`,
  //         16 * 1.5,
  //         16 * 1.5
  //       );
  //     }
  //     if (userEquipmentObj.armour.length > 0) {
  //       equipmentWindowCtx.drawImage(
  //         imgResources.equipment,
  //         userEquipmentObj.armour[0].XSpriteCoord,
  //         userEquipmentObj.armour[0].YSpriteCoord,
  //         userEquipmentObj.armour[0].sourceXLength,
  //         userEquipmentObj.armour[0].sourceYLength,
  //         `${27 * 1.5}`,
  //         `${32 * 1.5}`,
  //         16 * 1.5,
  //         16 * 1.5
  //       );
  //     }
  //     if (userEquipmentObj.boots.length > 0) {
  //       equipmentWindowCtx.drawImage(
  //         imgResources.equipment,
  //         userEquipmentObj.boots[0].XSpriteCoord,
  //         userEquipmentObj.boots[0].YSpriteCoord,
  //         userEquipmentObj.boots[0].sourceXLength,
  //         userEquipmentObj.boots[0].sourceYLength,
  //         `${27 * 1.5}`,
  //         `${48 * 1.5}`,
  //         16 * 1.5,
  //         16 * 1.5
  //       );
  //     }
  //     if (userEquipmentObj.ring.length > 0) {
  //       equipmentWindowCtx.drawImage(
  //         imgResources.equipment,
  //         userEquipmentObj.ring[0].XSpriteCoord,
  //         userEquipmentObj.ring[0].YSpriteCoord,
  //         userEquipmentObj.ring[0].sourceXLength,
  //         userEquipmentObj.ring[0].sourceYLength,
  //         `${10 * 1.5}`,
  //         `${64 * 1.5}`,
  //         16 * 1.5,
  //         16 * 1.5
  //       );
  //     }
  //     if (userEquipmentObj.amulet.length > 0) {
  //       equipmentWindowCtx.drawImage(
  //         imgResources.equipment,
  //         userEquipmentObj.amulet[0].XSpriteCoord,
  //         userEquipmentObj.amulet[0].YSpriteCoord,
  //         userEquipmentObj.amulet[0].sourceXLength,
  //         userEquipmentObj.amulet[0].sourceYLength,
  //         `${44 * 1.5}`,
  //         `${64 * 1.5}`,
  //         16 * 1.5,
  //         16 * 1.5
  //       );
  //     }
  //   }, [userEquipmentObj]);

  //   useEffect(() => {
  //     const equipmentWindowCtx = UserEquipmentCanvasRef.current.getContext("2d");

  //     if (showInteractWithEquipmentElStatus) {
  //       equipmentWindowCtx.drawImage(
  //         imgResources.userActionButtons2,
  //         96,
  //         39,
  //         35,
  //         25,
  //         interactEquipmentElCoord.left,
  //         interactEquipmentElCoord.top + 30,
  //         35,
  //         25
  //       );
  //     }
  //   }, [showInteractWithEquipmentElStatus]);

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
          onClick={clickShowInteractManuHandler}
          onTouchStart={touchShowInteractManuHandler}
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
          onClick={clickShowInteractManuHandler}
          onTouchStart={touchShowInteractManuHandler}
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
          onClick={clickShowInteractManuHandler}
          onTouchStart={touchShowInteractManuHandler}
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
          onClick={clickShowInteractManuHandler}
          onTouchStart={touchShowInteractManuHandler}
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
          onClick={clickShowInteractManuHandler}
          onTouchStart={touchShowInteractManuHandler}
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
          onClick={clickShowInteractManuHandler}
          onTouchStart={touchShowInteractManuHandler}
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
          onClick={clickShowInteractManuHandler}
          onTouchStart={touchShowInteractManuHandler}
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

      {/* {showInteractWithEquipmentElStatus && (
        <div
          style={{
            top: `${interactEquipmentElCoord.top + 30}px`,
            left: `${interactEquipmentElCoord.left}px`,
          }}
          className="absolute cursor-pointer h-8 w-8"
        ></div>
      )} */}

      {/* {showInteractWithInventoryAndEquipmentElStatus && (
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
            <div
              onClick={clickThrowOutInventionObjHandler}
              onTouchStart={touchThrowOutInventionObjHandler}
            >
              <FontAwesomeIcon className=" buttonCoopInteractWithEquipment fa-fw" icon={faTrash} />
            </div>
          </div>
        </div>
      )} */}
      <canvas ref={UserEquipmentCanvasRef} width={252} height={165}></canvas>

      {showInteractWithInventoryAndEquipmentElStatus.showStatus && (
        <InventoryAndEquipmentInteractMeny></InventoryAndEquipmentInteractMeny>
      )}
    </div>
  );
};

export default EquipmentWindow;
