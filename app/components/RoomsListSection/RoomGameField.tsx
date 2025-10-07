import { AppDispatch } from "@/app/store";
import { CoopGamesActions, ICoopGamesSlice, UserMoveDirections } from "@/app/store/CoopGamesSlice";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RoomGameField = () => {
  const canvasRef = useRef(null) as any;
  const dispatch = useDispatch<AppDispatch>();
  const backgroundCanvasRef = useRef(null) as any;
  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);
  const userAttackObj = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.userAttackObj);

  const frameNumber = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.frameNumber);

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
    if (gameData) {
      var ctx = canvasRef.current.getContext("2d");
      for (let userData in gameData) {
        console.log(gameData[userData].moveDirection);
        if (gameData[userData].userRole === "steve") {
          ctx.clearRect(
            gameData[userData].square.prevCoord.topLeft.x,
            gameData[userData].square.prevCoord.topLeft.y,
            32,
            32
          );

          steveImg.src = "/Swordsman/Lvl1/Swordsman_lvl1_Walk_with_shadow.png";

          if (
            gameData[userData].moveDirection === UserMoveDirections.stop ||
            gameData[userData].moveDirection === UserMoveDirections.up
          ) {
            ctx.drawImage(
              steveImg,
              frameNumber === 0 ? 16 : frameNumber * 64 + 16,
              208,
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
              frameNumber === 0 ? 16 : frameNumber * 64 + 16,
              80,
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
              frameNumber === 0 ? 16 : frameNumber * 64 + 16,
              144,
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
              frameNumber === 0 ? 16 : frameNumber * 64 + 16,
              16,
              24,
              32,
              gameData[userData].square.currentCoord.topLeft.x,
              gameData[userData].square.currentCoord.topLeft.y,
              24,
              32
            );
          }

          // let time: number;
          // function step(timestamp: number) {
          //   if (!time) {
          //     time = timestamp;
          //   }
          //   if (timestamp - time > 300) {
          //     console.log(timestamp);
          //     time = timestamp;
          //   }
          //   requestAnimationFrame(step);
          // }

          // requestAnimationFrame(step);

          // swordImg.src = "/flameSword.png";

          // ctx.drawImage(
          //   swordImg,
          //   gameData[userData].square.currentCoord.topLeft.x + 8,
          //   gameData[userData].square.currentCoord.topLeft.y + 8,
          //   16,
          //   16
          // );
        } else {
          ctx.clearRect(
            gameData[userData].square.prevCoord.topLeft.x,
            gameData[userData].square.prevCoord.topLeft.y,
            16,
            16
          );
          creeperImg.src = "/creeper.jpg";

          ctx.drawImage(
            creeperImg,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            16,
            16
          );
        }
      }
    }
  }, [gameData, frameNumber]);

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

  useEffect(() => {
    console.log(userAttackObj);
    var ctx = canvasRef.current.getContext("2d");

    // тут срабатывает анимация удара меча

    // for (let i = -1 * 3.14; i <= 3.14; i += 0.5) {
    //   console.log(`${Math.cos(i) + 1}`);
    // }

    // let start: number;
    // function step(timestamp: number) {
    //   if (start === undefined) {
    //     start = timestamp;
    //   }

    //   const shift = (timestamp - start) * 0.1;

    //   console.log(Math.cos(Math.floor(shift - 50) / 50) - 0.5);
    //   // ctx.rotate((Math.cos(Math.floor(shift - 50) / 50) - 0.5) * 20);

    //   if (shift < 100) requestAnimationFrame(step);
    // }

    // requestAnimationFrame(step);
  }, [userAttackObj]);

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
