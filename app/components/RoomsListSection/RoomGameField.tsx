import { ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const RoomGameField = () => {
  const canvasRef = useRef(null) as any;
  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);

  const gameData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.squareCoordinates);

  const gameFieldData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.gameFieldData);

  useEffect(() => {
    var ctx = canvasRef.current.getContext("2d");
    if (gameData) {
      for (let userData in gameData) {
        if (gameData[userData].userRole === "steve") {
          // ctx.fillStyle = "#9f8b5b";

          // ctx.fillRect(
          //   gameData[userData].square.prevCoord.topLeft.x,
          //   gameData[userData].square.prevCoord.topLeft.y,
          //   20,
          //   20
          // );

          // var ctx = canvasRef.current.getContext("2d");

          ctx.fillStyle = "#bdecb6";

          ctx.fillRect(0, 0, 300, 300);
          for (const i in gameFieldData) {
            if (!Object.hasOwn(gameFieldData, i)) continue;

            for (const j in gameFieldData[i]) {
              if (!Object.hasOwn(gameFieldData[i], j)) continue;
              ctx.fillStyle = "#56c945";
              ctx.fillRect(8 * Number(i) + 4, 8 * Number(j), 2, 2);
              ctx.fillRect(8 * Number(i), 8 * Number(j) + 4, 4, 2);
              ctx.fillRect(8 * Number(i) + 6, 8 * Number(j) + 2, 2, 2);
              ctx.fillRect(8 * Number(i) + 6, 8 * Number(j) + 6, 2, 2);

              ctx.fillStyle = "#25631c";
              ctx.fillRect(8 * Number(i), 8 * Number(j), 2, 4);
              ctx.fillRect(8 * Number(i) + 4, 8 * Number(j) + 2, 4, 2);
              ctx.fillRect(8 * Number(i) + 4, 8 * Number(j) + 4, 2, 2);
              ctx.fillRect(8 * Number(i), 8 * Number(j) + 6, 2, 2);
            }
          }

          ctx.fillStyle = "#dec6ab";

          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            20,
            20
          );

          ctx.fillStyle = "#6e0808";

          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            20,
            4
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y + 4,
            2,
            2
          );

          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x + 18,
            gameData[userData].square.currentCoord.topLeft.y + 4,
            2,
            2
          );

          ctx.clearRect(
            gameData[userData].square.currentCoord.topLeft.x + 2,
            gameData[userData].square.currentCoord.topLeft.y + 9,

            6,
            3
          );
          ctx.clearRect(
            gameData[userData].square.currentCoord.topLeft.x + 13,
            gameData[userData].square.currentCoord.topLeft.y + 9,

            6,
            3
          );
          ctx.fillStyle = "#38188b";
          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x + 5,
            gameData[userData].square.currentCoord.topLeft.y + 9,
            3,
            3
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x + 13,
            gameData[userData].square.currentCoord.topLeft.y + 9,
            3,
            3
          );
          ctx.fillStyle = "#812222";
          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x + 9,
            gameData[userData].square.currentCoord.topLeft.y + 13,
            4,
            2
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x + 7,
            gameData[userData].square.currentCoord.topLeft.y + 15,
            8,
            2
          );
        } else {
          ctx.fillStyle = "#9f8b5b";

          ctx.fillRect(
            gameData[userData].square.prevCoord.topLeft.x,
            gameData[userData].square.prevCoord.topLeft.y,
            20,
            20
          );

          ctx.fillStyle = "#547d57";

          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            20,
            20
          );

          ctx.fillStyle = "#204622";

          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x + 4,
            gameData[userData].square.currentCoord.topLeft.y + 4,
            4,
            4
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x + 12,
            gameData[userData].square.currentCoord.topLeft.y + 4,
            4,
            4
          );
          ctx.fillStyle = "#161d17";

          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x + 6,
            gameData[userData].square.currentCoord.topLeft.y + 6,
            2,
            2
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x + 14,
            gameData[userData].square.currentCoord.topLeft.y + 6,
            2,
            2
          );

          ctx.fillStyle = "#204622";

          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x + 8,
            gameData[userData].square.currentCoord.topLeft.y + 9,
            4,
            2
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x + 6,
            gameData[userData].square.currentCoord.topLeft.y + 11,
            8,
            2
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x + 6,
            gameData[userData].square.currentCoord.topLeft.y + 13,
            2,
            2
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.topLeft.x + 12,
            gameData[userData].square.currentCoord.topLeft.y + 13,
            2,
            2
          );
        }
      }
    }
  }, [gameData]);

  useEffect(() => {
    var ctx = canvasRef.current.getContext("2d");

    ctx.fillStyle = "#bdecb6";

    ctx.fillRect(0, 0, 300, 300);
    for (const i in gameFieldData) {
      if (!Object.hasOwn(gameFieldData, i)) continue;

      for (const j in gameFieldData[i]) {
        if (!Object.hasOwn(gameFieldData[i], j)) continue;
        ctx.fillStyle = "#56c945";
        ctx.fillRect(8 * Number(i) + 4, 8 * Number(j), 2, 2);
        ctx.fillRect(8 * Number(i), 8 * Number(j) + 4, 4, 2);
        ctx.fillRect(8 * Number(i) + 6, 8 * Number(j) + 2, 2, 2);
        ctx.fillRect(8 * Number(i) + 6, 8 * Number(j) + 6, 2, 2);

        ctx.fillStyle = "#25631c";
        ctx.fillRect(8 * Number(i), 8 * Number(j), 2, 4);
        ctx.fillRect(8 * Number(i) + 4, 8 * Number(j) + 2, 4, 2);
        ctx.fillRect(8 * Number(i) + 4, 8 * Number(j) + 4, 2, 2);
        ctx.fillRect(8 * Number(i), 8 * Number(j) + 6, 2, 2);
      }
    }
  }, [gameFieldData]);

  return (
    <div>
      <canvas
        id="canvas"
        width={300}
        height={300}
        ref={canvasRef}
        // height={170}
        // className=" h-80 w-80"
      ></canvas>
    </div>
  );
};

export default RoomGameField;
