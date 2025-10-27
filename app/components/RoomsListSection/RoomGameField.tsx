import { AppDispatch } from "@/app/store";
import { CoopGamesActions, ICoopGamesSlice, UserMoveDirections } from "@/app/store/CoopGamesSlice";
import { coopGameSpritesData } from "@/app/types";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RoomGameField = () => {
  const objectsCanvasRef = useRef(null) as any;
  const dispatch = useDispatch<AppDispatch>();
  const backgroundCanvasRef = useRef(null) as any;
  const UserStatCanvasRef = useRef(null) as any;
  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);

  const imgResources = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.imgResources);

  const attackDataObj = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.attackStatusObj
  );

  const statObj = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.statObj);
  const frameObj = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.frameObj);
  const gameData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.squareCoordinates);
  const gameFieldData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.gameFieldData);

  // let time: number;
  // function step(timestamp: number) {
  //   if (!time) {
  //     time = timestamp;
  //   }
  //   if (timestamp - time > 1000) {
  //     console.log(timestamp);
  //     time = timestamp;
  //   }
  //   requestAnimationFrame(step);
  // }

  // requestAnimationFrame(step);

  // useEffect(() => {
  //   let time: number;
  //   let timerID: any;

  //   function step(timestamp: number) {
  //     if (!time) {
  //       time = timestamp;
  //     }

  //     if (timestamp - time > 150) {
  //       time = timestamp;
  //       dispatch(CoopGamesActions.increaseFrameNumber());
  //     }
  //     timerID = requestAnimationFrame(step);
  //   }

  //   timerID = requestAnimationFrame(step);
  //   return () => cancelAnimationFrame(timerID);
  // }, []);

  useEffect(() => {
    if (gameData) {
      var ctx = objectsCanvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, 400, 400);
      for (let userData in gameData) {
        const imgCompareObj = {
          orc3AttackImage: imgResources.orcImgAttackImg,
          orc3WalkImage: imgResources.orcImgWalkImg,
          orc3GetDamageImage: imgResources.orcImgGetDamageImg,
          gamerAttackImage: imgResources.userImgAttack,
          gamerWalkImage: imgResources.userImgWalk,
          gamerGetDamageImage: imgResources.userImgWalk,
          NPCHPImg: imgResources.NPCHPImg,
        };
        if (
          gameData[userData].moveDirection === UserMoveDirections.stop ||
          gameData[userData].moveDirection === UserMoveDirections.up
        ) {
          ctx.drawImage(
            imgCompareObj[gameData[userData].imgName],
            frameObj.mainFrame === 0 ? 12 : frameObj.mainFrame * 64 + 12,
            coopGameSpritesData[gameData[userData].objectType].up,
            48,
            48,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            48,
            48
          );
        }
        if (gameData[userData].moveDirection === UserMoveDirections.left) {
          ctx.drawImage(
            imgCompareObj[gameData[userData].imgName],
            frameObj.mainFrame === 0 ? 12 : frameObj.mainFrame * 64 + 12,
            coopGameSpritesData[gameData[userData].objectType].left,
            48,
            48,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            48,
            48
          );
        }
        if (gameData[userData].moveDirection === UserMoveDirections.right) {
          ctx.drawImage(
            imgCompareObj[gameData[userData].imgName],
            frameObj.mainFrame === 0 ? 12 : frameObj.mainFrame * 64 + 12,
            coopGameSpritesData[gameData[userData].objectType].right,
            48,
            48,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            48,
            48
          );
        }
        if (gameData[userData].moveDirection === UserMoveDirections.down) {
          ctx.drawImage(
            imgCompareObj[gameData[userData].imgName],
            frameObj.mainFrame === 0 ? 12 : frameObj.mainFrame * 64 + 12,
            coopGameSpritesData[gameData[userData].objectType].down,
            48,
            48,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            48,
            48
          );
        }
        if (gameData[userData].type === "NPC") {
          ctx.drawImage(
            imgResources.NPCHPImg,
            5,
            5,
            50,
            50,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            16,
            16
          );
        }
      }
    }
  }, [gameData, frameObj, attackDataObj]);

  useEffect(() => {
    var ctx2 = backgroundCanvasRef.current.getContext("2d");
    // backgroundCanvasRef.current.requestFullscreen();

    if (imgResources.grassTextureImg) {
      ctx2.drawImage(imgResources.grassTextureImg, 0, 0, 300, 300);
    }

    for (const i in gameFieldData) {
      for (const j in gameFieldData[i]) {
        if (!Object.hasOwn(gameFieldData[i], j)) continue;

        if (gameFieldData[i][j].type === "stone") {
          ctx2.drawImage(imgResources.rockTextureImg, Number(j) * 8, Number(i) * 8, 8, 8);
        }

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
    ctxUserStata.clearRect(0, 0, 300, 50);

    ctxUserStata.globalAlpha = 0.1;
    ctxUserStata.fillStyle = "e3dae0";
    ctxUserStata.fillRect(0, 0, 300, 50);

    ctxUserStata.globalAlpha = 1;

    if (imgResources.userStatsIcon) {
      ctxUserStata.drawImage(imgResources.userStatsIcon, 10, 10, 90, 90, 10, 5, 20, 20);
      ctxUserStata.drawImage(imgResources.userStatsIcon, 150, 10, 90, 90, 58, 5, 20, 20);
      ctxUserStata.drawImage(imgResources.userStatsIcon, 300, 10, 90, 90, 30, 28, 20, 20);
      ctxUserStata.drawImage(imgResources.userStatsIcon, 450, 10, 90, 90, 120, 5, 40, 40);
    }
  }, [gameFieldData]);

  return (
    <div>
      <div className=" relative">
        <canvas id="canvas" width={300} height={350}></canvas>
        <canvas
          className=" absolute top-px z-20"
          id="canvas"
          width={300}
          height={300}
          ref={objectsCanvasRef}
        ></canvas>
        <canvas
          className=" absolute z-10 top-px"
          ref={backgroundCanvasRef}
          width={300}
          height={300}
        ></canvas>
        <canvas
          className=" absolute z-10 bottom-0"
          ref={UserStatCanvasRef}
          width={300}
          height={50}
        ></canvas>
        {socket?.id !== undefined && statObj.gamers[socket.id] && (
          <div className=" relative">
            <div className=" absolute z-10 bottom-8 left-9">
              <p className=" font-light text-center">
                {socket?.id !== undefined ? Number(statObj.gamers[socket.id].baseHP) : 10}
              </p>
            </div>
            <div className=" absolute z-10 bottom-8 left-24">
              <p className=" font-light text-center">
                {socket?.id !== undefined ? Number(statObj.gamers[socket.id].currentArmour) : 10}
              </p>
            </div>
            <div className=" absolute z-10 bottom-1 left-16 ">
              <p className=" font-light text-center">
                {socket?.id !== undefined ? Number(statObj.gamers[socket.id].currentDamage) : 10}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomGameField;
