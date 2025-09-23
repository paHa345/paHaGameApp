import { ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const RoomGameField = () => {
  const canvasRef = useRef(null) as any;
  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);

  const gameData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.squareCoordinates);

  useEffect(() => {
    var ctx = canvasRef.current.getContext("2d");
    if (gameData) {
      for (let userData in gameData) {
        if (gameData[userData].userRole === "steve") {
          ctx.fillStyle = "#9f8b5b";

          ctx.fillRect(
            gameData[userData].square.prevCoord.x1,
            gameData[userData].square.prevCoord.y1,
            20,
            20
          );

          ctx.fillStyle = "#dec6ab";

          ctx.fillRect(
            gameData[userData].square.currentCoord.x1,
            gameData[userData].square.currentCoord.y1,
            20,
            20
          );

          ctx.fillStyle = "#6e0808";

          ctx.fillRect(
            gameData[userData].square.currentCoord.x1,
            gameData[userData].square.currentCoord.y1,
            20,
            4
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.x1,
            gameData[userData].square.currentCoord.y1 + 4,
            2,
            2
          );

          ctx.fillRect(
            gameData[userData].square.currentCoord.x1 + 18,
            gameData[userData].square.currentCoord.y1 + 4,
            2,
            2
          );

          ctx.clearRect(
            gameData[userData].square.currentCoord.x1 + 2,
            gameData[userData].square.currentCoord.y1 + 9,
            6,
            3
          );
          ctx.clearRect(
            gameData[userData].square.currentCoord.x1 + 13,
            gameData[userData].square.currentCoord.y1 + 9,
            6,
            3
          );
          ctx.fillStyle = "#38188b";
          ctx.fillRect(
            gameData[userData].square.currentCoord.x1 + 5,
            gameData[userData].square.currentCoord.y1 + 9,
            3,
            3
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.x1 + 13,
            gameData[userData].square.currentCoord.y1 + 9,
            3,
            3
          );
          ctx.fillStyle = "#812222";
          ctx.fillRect(
            gameData[userData].square.currentCoord.x1 + 9,
            gameData[userData].square.currentCoord.y1 + 13,
            4,
            2
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.x1 + 7,
            gameData[userData].square.currentCoord.y1 + 15,
            8,
            2
          );
        } else {
          ctx.fillStyle = "#9f8b5b";

          ctx.fillRect(
            gameData[userData].square.prevCoord.x1,
            gameData[userData].square.prevCoord.y1,
            20,
            20
          );

          ctx.fillStyle = "#547d57";

          ctx.fillRect(
            gameData[userData].square.currentCoord.x1,
            gameData[userData].square.currentCoord.y1,
            20,
            20
          );

          ctx.fillStyle = "#204622";

          ctx.fillRect(
            gameData[userData].square.currentCoord.x1 + 4,
            gameData[userData].square.currentCoord.y1 + 4,
            4,
            4
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.x1 + 12,
            gameData[userData].square.currentCoord.y1 + 4,
            4,
            4
          );
          ctx.fillStyle = "#161d17";

          ctx.fillRect(
            gameData[userData].square.currentCoord.x1 + 6,
            gameData[userData].square.currentCoord.y1 + 6,
            2,
            2
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.x1 + 14,
            gameData[userData].square.currentCoord.y1 + 6,
            2,
            2
          );

          ctx.fillStyle = "#204622";

          ctx.fillRect(
            gameData[userData].square.currentCoord.x1 + 8,
            gameData[userData].square.currentCoord.y1 + 9,
            4,
            2
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.x1 + 6,
            gameData[userData].square.currentCoord.y1 + 11,
            8,
            2
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.x1 + 6,
            gameData[userData].square.currentCoord.y1 + 13,
            2,
            2
          );
          ctx.fillRect(
            gameData[userData].square.currentCoord.x1 + 12,
            gameData[userData].square.currentCoord.y1 + 13,
            2,
            2
          );
        }
      }
    }
  }, [gameData]);

  useEffect(() => {
    if (window) {
      var ctx = canvasRef.current.getContext("2d");

      ctx.fillStyle = "#9f8b5b";

      ctx.fillRect(0, 0, 300, 300);
    }
  }, []);

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
