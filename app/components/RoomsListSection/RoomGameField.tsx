import { AppDispatch } from "@/app/store";
import { CoopGamesActions, ICoopGamesSlice, UserMoveDirections } from "@/app/store/CoopGamesSlice";
import { coopGameSpritesData } from "@/app/types";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RoomGameField = () => {
  const canvasRef = useRef(null) as any;
  const dispatch = useDispatch<AppDispatch>();
  const backgroundCanvasRef = useRef(null) as any;
  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);

  const imgResources = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.imgResources);

  const attackDataObj = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.attackStatusObj
  );
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
      var ctx = canvasRef.current.getContext("2d");
      for (let userData in gameData) {
        ctx.clearRect(
          gameData[userData].square.prevCoord.topLeft.x,
          gameData[userData].square.prevCoord.topLeft.y,
          24,
          40
        );

        const attackWalkImg = {
          attack:
            gameData[userData].type === "NPC"
              ? imgResources.orcImgAttackImg
              : imgResources.userImgAttack,
          walk:
            gameData[userData].type === "NPC"
              ? imgResources.orcImgWalkImg
              : imgResources.userImgWalk,
        };

        if (
          gameData[userData].moveDirection === UserMoveDirections.stop ||
          gameData[userData].moveDirection === UserMoveDirections.up
        ) {
          ctx.drawImage(
            attackDataObj[userData]?.isActive ? attackWalkImg.attack : attackWalkImg.walk,
            frameObj.mainFrame === 0 ? 22 : frameObj.mainFrame * 64 + 22,
            coopGameSpritesData[gameData[userData].objectType].up,
            24,
            40,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            24,
            40
          );
        }
        if (gameData[userData].moveDirection === UserMoveDirections.left) {
          ctx.drawImage(
            attackDataObj[userData]?.isActive ? attackWalkImg.attack : attackWalkImg.walk,
            frameObj.mainFrame === 0 ? 22 : frameObj.mainFrame * 64 + 22,
            coopGameSpritesData[gameData[userData].objectType].left,
            24,
            40,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            24,
            40
          );
        }
        if (gameData[userData].moveDirection === UserMoveDirections.right) {
          ctx.drawImage(
            attackDataObj[userData]?.isActive ? attackWalkImg.attack : attackWalkImg.walk,
            frameObj.mainFrame === 0 ? 22 : frameObj.mainFrame * 64 + 22,
            coopGameSpritesData[gameData[userData].objectType].right,
            24,
            40,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            24,
            40
          );
        }
        if (gameData[userData].moveDirection === UserMoveDirections.down) {
          ctx.drawImage(
            attackDataObj[userData]?.isActive ? attackWalkImg.attack : attackWalkImg.walk,
            frameObj.mainFrame === 0 ? 22 : frameObj.mainFrame * 64 + 22,
            coopGameSpritesData[gameData[userData].objectType].down,
            24,
            40,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            24,
            40
          );
        }
      }
    }
  }, [gameData, frameObj, attackDataObj]);

  useEffect(() => {
    var ctx2 = backgroundCanvasRef.current.getContext("2d");

    if (imgResources.grassTextureImg) {
      ctx2.drawImage(imgResources.grassTextureImg, 0, 0, 300, 300);
    }

    for (const i in gameFieldData) {
      for (const j in gameFieldData[i]) {
        if (!Object.hasOwn(gameFieldData[i], j)) continue;

        if (gameFieldData[i][j].type === "stone") {
          ctx2.drawImage(imgResources.rockTextureImg, Number(j) * 8, Number(i) * 8, 8, 8);
        }
      }
    }
  }, [gameFieldData]);

  return (
    <div className=" relative">
      <canvas id="canvas" width={300} height={300}></canvas>
      <canvas
        className=" absolute top-px z-20"
        id="canvas"
        width={300}
        height={300}
        ref={canvasRef}
      ></canvas>
      <canvas
        className=" absolute z-10 top-px"
        ref={backgroundCanvasRef}
        width={300}
        height={300}
      ></canvas>
    </div>
  );
};

export default RoomGameField;
