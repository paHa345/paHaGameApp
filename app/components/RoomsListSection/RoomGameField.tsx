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
  useEffect(() => {
    var ctx = canvasRef.current.getContext("2d");
    if (gameData) {
      for (let userData in gameData) {
        if (gameData[userData].userRole === "steve") {
          ctx.clearRect(
            gameData[userData].square.prevCoord.topLeft.x,
            gameData[userData].square.prevCoord.topLeft.y,
            20,
            20
          );

          steveImg.src = "/steveIcon.png";

          ctx.drawImage(
            steveImg,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            20,
            20
          );
        } else {
          ctx.clearRect(
            gameData[userData].square.prevCoord.topLeft.x,
            gameData[userData].square.prevCoord.topLeft.y,
            20,
            20
          );
          creeperImg.src = "/creeper.jpg";

          ctx.drawImage(
            creeperImg,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            20,
            20
          );
        }
      }
    }
  }, [gameData]);

  useEffect(() => {
    console.log("Render Game field");
    var ctx2 = backgroundCanvasRef.current.getContext("2d");
    img.src = "/grassImg.png";

    img.onload = () => {
      const pattern = ctx2.createPattern(img, "repeat");
      ctx2.fillStyle = pattern;
      ctx2.fillRect(0, 0, 300, 300);
    };
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
