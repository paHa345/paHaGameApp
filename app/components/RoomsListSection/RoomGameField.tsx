import { AppDispatch } from "@/app/store";
import { CoopGamesActions, ICoopGamesSlice, UserMoveDirections } from "@/app/store/CoopGamesSlice";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RoomGameField = () => {
  const canvasRef = useRef(null) as any;
  const dispatch = useDispatch<AppDispatch>();
  const backgroundCanvasRef = useRef(null) as any;
  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);

  const attackDataObj = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.attackStatusObj
  );
  const frameObj = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.frameObj);

  const gameData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.squareCoordinates);

  const gameFieldData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.gameFieldData);
  const img = new Image();
  const steveImg = new Image();
  const creeperImg = new Image();
  const textureImg = new Image();
  const swordImg = new Image();

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

  useLayoutEffect(() => {
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
    console.log(attackDataObj);
    dispatch(CoopGamesActions.resetFrameNumber());
  }, [attackDataObj]);

  useEffect(() => {
    if (gameData) {
      var ctx = canvasRef.current.getContext("2d");
      for (let userData in gameData) {
        // if (gameData[userData].userRole === "steve") {
        ctx.clearRect(
          gameData[userData].square.prevCoord.topLeft.x,
          gameData[userData].square.prevCoord.topLeft.y,
          24,
          32
        );
        if (attackDataObj[userData]?.isActive) {
          steveImg.src = "/Swordsman/Lvl1/Swordsman_lvl1_Walk_Attack_with_shadow.png";
        } else {
          steveImg.src = "/Swordsman/Lvl1/Swordsman_lvl1_Walk_with_shadow.png";
        }

        if (
          gameData[userData].moveDirection === UserMoveDirections.stop ||
          gameData[userData].moveDirection === UserMoveDirections.up
        ) {
          ctx.drawImage(
            steveImg,
            frameObj.objects[userData].idFrame === 0
              ? 22
              : frameObj.objects[userData].idFrame * 64 + 22,
            210,
            24,
            32,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            24,
            32
          );
        }
        if (gameData[userData].moveDirection === UserMoveDirections.left) {
          ctx.drawImage(
            steveImg,
            frameObj.objects[userData].idFrame === 0
              ? 22
              : frameObj.objects[userData].idFrame * 64 + 22,
            82,
            24,
            32,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            24,
            32
          );
        }
        if (gameData[userData].moveDirection === UserMoveDirections.right) {
          ctx.drawImage(
            steveImg,
            frameObj.objects[userData].idFrame === 0
              ? 22
              : frameObj.objects[userData].idFrame * 64 + 22,
            146,
            24,
            32,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            24,
            32
          );
        }
        if (gameData[userData].moveDirection === UserMoveDirections.down) {
          ctx.drawImage(
            steveImg,
            frameObj.objects[userData].idFrame === 0
              ? 22
              : frameObj.objects[userData].idFrame * 64 + 22,
            18,
            24,
            32,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            24,
            32
          );
        }
        // } else {
        //   ctx.clearRect(
        //     gameData[userData].square.prevCoord.topLeft.x,
        //     gameData[userData].square.prevCoord.topLeft.y,
        //     24,
        //     32
        //   );

        //   steveImg.src = "/Orc/orc3_walk_with_shadow.png";

        //   if (
        //     gameData[userData].moveDirection === UserMoveDirections.stop ||
        //     gameData[userData].moveDirection === UserMoveDirections.up
        //   ) {
        //     ctx.drawImage(
        //       steveImg,
        //       frameNumber === 0 ? 16 : frameNumber * 64 + 16,
        //       208,
        //       24,
        //       32,
        //       gameData[userData].square.currentCoord.topLeft.x,
        //       gameData[userData].square.currentCoord.topLeft.y,
        //       24,
        //       32
        //     );
        //   }
        //   if (gameData[userData].moveDirection === UserMoveDirections.left) {
        //     ctx.drawImage(
        //       steveImg,
        //       frameNumber === 0 ? 16 : frameNumber * 64 + 16,
        //       80,
        //       24,
        //       32,
        //       gameData[userData].square.currentCoord.topLeft.x,
        //       gameData[userData].square.currentCoord.topLeft.y,
        //       24,
        //       32
        //     );
        //   }
        //   if (gameData[userData].moveDirection === UserMoveDirections.right) {
        //     ctx.drawImage(
        //       steveImg,
        //       frameNumber === 0 ? 16 : frameNumber * 64 + 16,
        //       144,
        //       24,
        //       32,
        //       gameData[userData].square.currentCoord.topLeft.x,
        //       gameData[userData].square.currentCoord.topLeft.y,
        //       24,
        //       32
        //     );
        //   }
        //   if (gameData[userData].moveDirection === UserMoveDirections.down) {
        //     ctx.drawImage(
        //       steveImg,
        //       frameNumber === 0 ? 16 : frameNumber * 64 + 16,
        //       16,
        //       24,
        //       32,
        //       gameData[userData].square.currentCoord.topLeft.x,
        //       gameData[userData].square.currentCoord.topLeft.y,
        //       24,
        //       32
        //     );
        //   }
        // }
      }
    }
  }, [gameData, frameObj, attackDataObj]);

  useEffect(() => {
    console.log("Render Game field");
    var ctx2 = backgroundCanvasRef.current.getContext("2d");
    img.src = "/grassImg.png";

    // img.onload = () => {
    //   const pattern = ctx2.createPattern(img, "repeat");
    //   ctx2.fillStyle = pattern;
    //   ctx2.fillRect(0, 0, 300, 300);
    // };
    ctx2.drawImage(img, 0, 0, 300, 300);

    textureImg.src = "/stone_v3.png";

    for (const i in gameFieldData) {
      for (const j in gameFieldData[i]) {
        if (!Object.hasOwn(gameFieldData[i], j)) continue;

        if (gameFieldData[i][j].type === "stone") {
          ctx2.drawImage(textureImg, Number(j) * 8, Number(i) * 8, 8, 8);
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
