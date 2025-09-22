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
        if (userData === socket?.id) {
          ctx.fillStyle = "#ffbcad";
        } else {
          ctx.fillStyle = "red";
        }

        // var img = new Image();
        // img.onload = function () {
        //   ctx.clearRect(
        //     gameData[userData].square.prevCoord.x,
        //     gameData[userData].square.prevCoord.y,
        //     40,
        //     40
        //   );
        //   ctx.drawImage(
        //     img,
        //     gameData[userData].square.prevCoord.x,
        //     gameData[userData].square.prevCoord.y
        //   );
        // };
        // img.src = "https://s.namemc.com/2d/skin/face.png?id=db1ae8323676a9c7&scale=4";

        ctx.clearRect(
          gameData[userData].square.prevCoord.x,
          gameData[userData].square.prevCoord.y,
          20,
          20
        );

        ctx.fillRect(
          gameData[userData].square.currentCoord.x,
          gameData[userData].square.currentCoord.y,
          20,
          20
        );
        ctx.clearRect(
          gameData[userData].square.currentCoord.x + 2,
          gameData[userData].square.currentCoord.y + 4,
          4,
          3
        );
        ctx.clearRect(
          gameData[userData].square.currentCoord.x + 14,
          gameData[userData].square.currentCoord.y + 4,
          4,
          3
        );
        ctx.fillStyle = "violet";
        ctx.fillRect(
          gameData[userData].square.currentCoord.x + 4,
          gameData[userData].square.currentCoord.y + 4,
          2,
          3
        );
        ctx.fillRect(
          gameData[userData].square.currentCoord.x + 14,
          gameData[userData].square.currentCoord.y + 4,
          2,
          3
        );
      }
    }
  }, [gameData]);

  useEffect(() => {
    if (window) {
      var ctx = canvasRef.current.getContext("2d");

      ctx.fillStyle = "#f2f7bc";

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
