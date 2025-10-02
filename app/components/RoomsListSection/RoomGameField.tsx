import { ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const RoomGameField = () => {
  const canvasRef = useRef(null) as any;
  const backgroundCanvasRef = useRef(null) as any;
  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);

  const gameData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.squareCoordinates);

  const gameFieldData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.gameFieldData);
  const img = new Image();
  const steveImg = new Image();
  const creeperImg = new Image();
  const textureImg = new Image();
  const swordImg = new Image();

  useEffect(() => {
    var ctx = canvasRef.current.getContext("2d");
    if (gameData) {
      for (let userData in gameData) {
        if (gameData[userData].userRole === "steve") {
          ctx.clearRect(
            gameData[userData].square.prevCoord.topLeft.x,
            gameData[userData].square.prevCoord.topLeft.y,
            24,
            24
          );

          steveImg.src = "/steveIcon.png";

          ctx.drawImage(
            steveImg,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            16,
            16
          );
          swordImg.src = "/flameSword.png";

          ctx.drawImage(
            swordImg,
            gameData[userData].square.currentCoord.topLeft.x + 8,
            gameData[userData].square.currentCoord.topLeft.y + 8,
            16,
            16
          );
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
  }, [gameData]);

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
