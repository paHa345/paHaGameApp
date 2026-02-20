import { AppDispatch } from "@/app/store";
import { CoopGamesActions, ICoopGamesSlice, UserMoveDirections } from "@/app/store/CoopGamesSlice";
import { coopGameSpritesData, ImageNames } from "@/app/types";
import { init, isTMA } from "@telegram-apps/sdk";
import { isPopupSupported } from "@telegram-apps/sdk-react";
import { div } from "framer-motion/client";
import React, { MouseEvent, TouchEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LevelsWindow from "./LevelsWindow";
import EquipmentWindow from "./EquipmentWindow";
import UserActionButtonsWindow from "./UserActionButtonsWindow";
import ObjectsWindow from "./ObjectsWindow";

const RoomGameField = () => {
  const dispatch = useDispatch<AppDispatch>();
  const backgroundCanvasRef = useRef(null) as any;
  const UserStatCanvasRef = useRef(null) as any;
  const NPCUnderAttackAreaCAnvasRef = useRef(null) as any;
  const treesCanvasRef = useRef(null) as any;
  const dropCanvasRef = useRef(null) as any;

  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);
  const gameData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.squareCoordinates);
  const basePosition = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.basePosition);

  const currentMapSize = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.currentMapSize
  );
  const imgResources = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.imgResources);

  const statObj = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.statObj);
  const frameObj = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.frameObj);
  // const gameData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.squareCoordinates);
  const gameFieldData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.gameFieldData);
  const dropObject = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.dropObject);

  // const basePosition = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.basePosition);
  const showLevelsComponentStatus = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.showLevelsComponent
  );

  const showEquipmentComponentStatus = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.showEquipmentComponent
  );

  const NPCUnderAttackChanksObj = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.NPCUnderAttackChanksObj
  );
  const imgCompareObj = {
    orc3AttackImage: imgResources.orcImgAttackImg,
    orc3WalkImage: imgResources.orcImgWalkImg,
    orc3GetDamageImage: imgResources.orcImgGetDamageImg,
    orc3DeathImage: imgResources.orcImgDeathImg,
    gamerAttackImage: imgResources.userImgAttack,
    gamerWalkImage: imgResources.userImgWalk,
    gamerGetDamageImage: imgResources.userImgGetDamageImg,
    NPCHPImg: imgResources.NPCHPImg,
    rocksAndStones: imgResources.rocksAndStones,
    prepareAttackArea: imgResources.prepareAttackArea,
    roadTile: imgResources.roadTile,
    trees: imgResources.trees,
    exterior: imgResources.exterior,
    characterPannel: imgResources.characterPannel,
    levelUserWindow: imgResources.levelUserWindow,
    equipment: imgResources.equipment,
    userActionButtons: imgResources.userActionButtons,
    inventoryEquipmentInteract: imgResources.inventoryEquipmentInteract,
  };

  useEffect(() => {
    let time: number;
    let timerID: any;

    function step(timestamp: number) {
      if (!time) {
        time = timestamp;
      }

      if (timestamp - time > 150) {
        time = timestamp;
        dispatch(CoopGamesActions.increaseFrameNumber());
      }
      timerID = requestAnimationFrame(step);
    }

    timerID = requestAnimationFrame(step);
    return () => cancelAnimationFrame(timerID);
  }, []);

  useEffect(() => {
    var treesCanvasContext = treesCanvasRef.current.getContext("2d");

    for (const i in gameFieldData) {
      for (const j in gameFieldData[i]) {
        if (!Object.hasOwn(gameFieldData[i], j)) continue;

        if (
          (gameFieldData[i][j].textureObj && gameFieldData[i][j].type === "tree") ||
          (gameFieldData[i][j].textureObj && gameFieldData[i][j].type === "scarecrow")
        ) {
          treesCanvasContext.drawImage(
            imgCompareObj[gameFieldData[i][j].textureObj.imageName],

            gameFieldData[i][j].textureObj.XSpriteCoord,
            gameFieldData[i][j].textureObj.YSpriteCoord,
            gameFieldData[i][j].textureObj.sourceX,
            gameFieldData[i][j].textureObj.sourceY,
            Number(j) * 8,
            Number(i) * 8,
            gameFieldData[i][j].textureObj.heigthChanks
              ? gameFieldData[i][j].textureObj.heigthChanks * 8
              : 32,
            gameFieldData[i][j].textureObj.widthChanks
              ? gameFieldData[i][j].textureObj.widthChanks * 8
              : 32
          );
        }
        if (gameFieldData[i][j].textureObj && gameFieldData[i][j].type === "playersHouse") {
          treesCanvasContext.drawImage(
            imgCompareObj[gameFieldData[i][j].textureObj.imageName],

            gameFieldData[i][j].textureObj.XSpriteCoord,
            gameFieldData[i][j].textureObj.YSpriteCoord,
            gameFieldData[i][j].textureObj.sourceX,
            gameFieldData[i][j].textureObj.sourceY,
            Number(j) * 8,
            Number(i) * 8,
            gameFieldData[i][j].textureObj.heigthChanks
              ? gameFieldData[i][j].textureObj.heigthChanks * 8
              : 32,
            gameFieldData[i][j].textureObj.widthChanks
              ? gameFieldData[i][j].textureObj.widthChanks * 8
              : 32
          );
        }
      }
    }
  }, [gameFieldData, currentMapSize]);

  useEffect(() => {
    var underAttackAreaCtx = NPCUnderAttackAreaCAnvasRef.current.getContext("2d");

    underAttackAreaCtx.clearRect(0, 0, currentMapSize * 8, currentMapSize * 8);

    for (const NPCID in NPCUnderAttackChanksObj) {
      underAttackAreaCtx.globalAlpha = 0.9;
      // underAttackAreaCtx.fillStyle = "red";
      underAttackAreaCtx.drawImage(
        imgResources.prepareAttackArea,
        250 * frameObj.mainFrame,
        0,
        250,
        300,
        NPCUnderAttackChanksObj[NPCID].underAttackArea.baseChankX * 8,
        NPCUnderAttackChanksObj[NPCID].underAttackArea.baseChankY * 8,
        NPCUnderAttackChanksObj[NPCID].underAttackArea.widthChanksNum * 8,
        NPCUnderAttackChanksObj[NPCID].underAttackArea.heightChanksNum * 8
      );
    }
  }, [NPCUnderAttackChanksObj, frameObj]);

  useEffect(() => {
    var ctx2 = backgroundCanvasRef.current.getContext("2d");
    // backgroundCanvasRef.current.requestFullscreen();

    if (imgResources.grassTextureImg) {
      const pattern = ctx2.createPattern(imgResources.grassTextureImg, "repeat");
      ctx2.fillStyle = pattern;
      ctx2.fillRect(0, 0, currentMapSize * 8, currentMapSize * 8);
    }

    for (const i in gameFieldData) {
      for (const j in gameFieldData[i]) {
        if (!Object.hasOwn(gameFieldData[i], j)) continue;

        if (gameFieldData[i][j].textureObj) {
          ctx2.drawImage(
            imgCompareObj[gameFieldData[i][j].textureObj.imageName],

            gameFieldData[i][j].textureObj.XSpriteCoord,
            gameFieldData[i][j].textureObj.YSpriteCoord,
            gameFieldData[i][j].textureObj.sourceX,
            gameFieldData[i][j].textureObj.sourceY,
            Number(j) * 8,
            Number(i) * 8,
            gameFieldData[i][j].textureObj.heigthChanks
              ? gameFieldData[i][j].textureObj.heigthChanks * 8
              : 32,
            gameFieldData[i][j].textureObj.widthChanks
              ? gameFieldData[i][j].textureObj.widthChanks * 8
              : 32
          );
        }

        // if (Number(i) === 16 && Number(j) === 10) {
        //   ctx2.fillStyle = "red";
        //   ctx2.fillRect(Number(j) * 8, Number(i) * 8, 8, 8);
        // }
        // if (Number(i) === 10 && Number(j) === 10) {
        //   ctx2.fillStyle = "red";
        //   ctx2.fillRect(Number(j) * 8, Number(i) * 8, 8, 8);
        // }
        // if (Number(i) === 10 && Number(j) === 14) {
        //   ctx2.fillStyle = "red";
        //   ctx2.fillRect(Number(j) * 8, Number(i) * 8, 8, 8);
        // }

        if (gameFieldData[i][j].objectDataChank.isObjectChank) {
          ctx2.globalAlpha = 0.4;
          ctx2.fillRect(Number(j) * 8, Number(i) * 8, 8, 8);

          ctx2.globalAlpha = 1;
        }

        if (gameFieldData[i][j].chankUnderAttack) {
          ctx2.globalAlpha = 0.4;
          ctx2.fillStyle = "red";
          ctx2.fillRect(Number(j) * 8, Number(i) * 8, 8, 8);

          ctx2.globalAlpha = 1;
        }
      }
    }

    var ctxUserStata = UserStatCanvasRef.current.getContext("2d");
    ctxUserStata.clearRect(0, 0, 200, 55);

    // ctxUserStata.globalAlpha = 0.5;
    // ctxUserStata.fillStyle = "white";
    // ctxUserStata.fillRect(0, 0, 200, 100);

    // ctxUserStata.globalAlpha = 1;

    if (imgResources.characterPannel) {
      ctxUserStata.drawImage(imgResources.characterPannel, 142, 3, 125, 29, 0, 0, 200, 47);

      // ctxUserStata.drawImage(imgResources.userStatsIcon, 10, 10, 90, 90, 10, 5, 30, 30);
      // ctxUserStata.drawImage(imgResources.userStatsIcon, 150, 10, 90, 90, 70, 5, 30, 30);
      // ctxUserStata.drawImage(imgResources.userStatsIcon, 300, 10, 90, 90, 50, 40, 30, 30);
      // ctxUserStata.drawImage(imgResources.userStatsIcon, 450, 10, 90, 90, 120, 5, 40, 40);
    }
  }, [gameFieldData, currentMapSize]);

  useEffect(() => {
    const questionStatusContainer = document.querySelector(".gameContainer");
    if (!gameData) return;
    if (!socket?.id) return;
    if (!gameData[socket.id]) return;

    questionStatusContainer?.scrollTo({
      left: gameData[socket.id].square.currentCoord.topLeft.x - 150,
      top: gameData[socket.id].square.currentCoord.topLeft.y - 150,
    });
  }, [gameData, basePosition]);

  useEffect(() => {
    if (!dropObject) return;
    // if (!gameData) return;

    if (!socket) return;
    if (!socket.id) return;
    if (!statObj.gamers[socket.id]) return;
    // if (!gameData[socket.id]) return;
    var ctxDropObject = dropCanvasRef.current.getContext("2d");
    ctxDropObject.clearRect(0, 0, currentMapSize * 8, currentMapSize * 8);

    for (let drop in dropObject) {
      dropObject[drop].forEach((dropObj) => {
        if (!dropObj) return;

        ctxDropObject.drawImage(
          imgCompareObj[dropObj.imageName],

          dropObj.XSpriteCoord,
          dropObj.YSpriteCoord,
          dropObj.sourceX,
          dropObj.sourceY,
          dropObj.YChank * 8,
          dropObj.XChank * 8,
          dropObj.heigthChanks ? dropObj.heigthChanks * 8 : 32,
          dropObj.widthChanks ? dropObj.widthChanks * 8 : 32
        );
      });
    }
  }, [dropObject]);

  useEffect(() => {
    // if (!gameData) return;
    // if (!gameData[socket.id]) return;

    if (!socket) return;
    if (!socket.id) return;
    if (!statObj.gamers[socket.id]) return;

    var ctxUserStata = UserStatCanvasRef.current.getContext("2d");
    ctxUserStata.clearRect(0, 0, 200, 100);

    if (imgResources.characterPannel) {
      ctxUserStata.drawImage(imgResources.characterPannel, 142, 3, 129, 35, 0, 0, 200, 55);
      ctxUserStata.drawImage(
        imgResources.characterPannel,
        70,
        207,
        60,
        5,
        45,
        5,
        `${statObj.gamers[socket.id].currentHP > 0 ? 180 * Number(statObj.gamers[socket.id].currentHP / statObj.gamers[socket.id].baseHP) : 0}`,
        5
      );
      ctxUserStata.drawImage(
        imgResources.characterPannel,
        70,
        202,
        60,
        5,
        25,
        44,
        `${(statObj.gamers[socket.id].currentLVLUserPoint / statObj.gamers[socket.id].currentLVLMaxPoint) * 150}`,
        5
      );

      ctxUserStata.font = "20px serif";
      ctxUserStata.fillText(statObj.gamers[socket.id].currentDamage, 78, 33);
      ctxUserStata.fillText(statObj.gamers[socket.id].currentArmour, 145, 33);
    }
  }, [socket?.id ? statObj.gamers[socket.id] : statObj]);

  const canvas = document.getElementById("gameCanvas") as HTMLElement;
  const button = document.getElementById("fullscreenBtn");

  button?.addEventListener("click", () => {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen().catch((err) => {
        console.error("Не удалось войти в полноэкранный режим:", err.message);
      });
    } else {
      console.warn("Fullscreen API не поддерживается");
    }
  });

  const showLevelsComponent = (e: MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;

    dispatch(CoopGamesActions.setShowLevelsComponent(!showLevelsComponentStatus));
  };
  const touchShowLevelsComponent = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;

    dispatch(CoopGamesActions.setShowLevelsComponent(!showLevelsComponentStatus));
  };
  const showEquipmentComponent = (e: MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;

    dispatch(CoopGamesActions.setShowEquipmentComponent(!showEquipmentComponentStatus));
  };
  const touchShowEquipmentComponent = (e: TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;

    dispatch(CoopGamesActions.setShowEquipmentComponent(!showEquipmentComponentStatus));
  };

  return (
    // <div>
    //   <canvas id="gameCanvas" width="800" height="600"></canvas>
    //   <button id="fullscreenBtn">Во весь экран</button>{" "}
    // </div>
    <div>
      <div className=" relative ">
        {/* {socket?.id !== undefined && statObj.gamers[socket.id] && (
          <div className=" relative">
            <div className=" absolute z-50 top-6 left-16  text-xl ">
              <p className=" text-center font-bold">
                {socket?.id !== undefined ? Number(statObj.gamers[socket.id].currentHP) : 10}
              </p>
            </div>
            <div className=" absolute z-50 top-6 left-32 text-xl">
              <p className=" font-bold text-center">
                {socket?.id !== undefined ? Number(statObj.gamers[socket.id].currentArmour) : 10}
              </p>
            </div>
            <div className=" absolute z-50 top-16 left-28 text-xl">
              <p className=" font-bold text-center">
                {socket?.id !== undefined ? Number(statObj.gamers[socket.id].currentDamage) : 10}
              </p>
            </div>
          </div>
        )} */}

        <canvas
          className=" w-[100vh] h-[100vw]"
          id="canvas"
          //  width={300} height={350}
        ></canvas>
        <div className=" gameContainer absolute top-px  w-[100vh] h-[100vw] overflow-hidden   ">
          <canvas
            className=" absolute z-30 top-px"
            ref={treesCanvasRef}
            width={currentMapSize * 8}
            height={currentMapSize * 8}
          ></canvas>
          <canvas
            className=" absolute z-[19] top-px"
            ref={dropCanvasRef}
            width={currentMapSize * 8}
            height={currentMapSize * 8}
          ></canvas>
          {/* <canvas
            className=" absolute top-px z-20"
            id="canvas"
            width={currentMapSize * 8}
            height={currentMapSize * 8}
            ref={objectsCanvasRef}
          ></canvas> */}
          <ObjectsWindow></ObjectsWindow>
          <canvas
            className=" absolute top-px z-20"
            id="canvas"
            width={currentMapSize * 8}
            height={currentMapSize * 8}
            ref={NPCUnderAttackAreaCAnvasRef}
          ></canvas>
          <canvas
            className=" absolute z-10 top-px"
            ref={backgroundCanvasRef}
            width={currentMapSize * 8}
            height={currentMapSize * 8}
          ></canvas>
        </div>
        <div
          onClick={showEquipmentComponent}
          onTouchStart={touchShowEquipmentComponent}
          className=" absolute z-[41] top-6 left-[77px] h-10 w-10 rounded-full"
        ></div>
        <div
          onClick={showLevelsComponent}
          onTouchStart={touchShowLevelsComponent}
          className=" absolute z-[41] top-16 left-[97px] h-4 w-36"
        ></div>
        <LevelsWindow></LevelsWindow>
        <EquipmentWindow></EquipmentWindow>
        <UserActionButtonsWindow></UserActionButtonsWindow>

        <canvas
          className=" absolute z-40 top-5 left-20"
          ref={UserStatCanvasRef}
          width={200}
          height={55}
        ></canvas>
      </div>
    </div>
  );
};

export default RoomGameField;
