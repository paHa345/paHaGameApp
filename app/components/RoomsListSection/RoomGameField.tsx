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
        console.log(userData);
        console.log(socket?.id);
        if (userData === socket?.id) {
          ctx.fillStyle = "green";
        } else {
          ctx.fillStyle = "red";
        }

        ctx.clearRect(
          gameData[userData].square.prevCoord.x,
          gameData[userData].square.prevCoord.y,
          10,
          5
        );

        ctx.fillRect(
          gameData[userData].square.currentCoord.x,
          gameData[userData].square.currentCoord.y,
          10,
          5
        );
      }
    }
  }, [gameData]);

  useEffect(() => {
    var ctx = canvasRef.current.getContext("2d");

    ctx.fillStyle = "#f2f7bc";

    ctx.fillRect(0, 0, 256, 128);
  }, []);

  return (
    <div>
      <canvas
        id="canvas"
        ref={canvasRef}
        // height={170}
        className=" h-80 w-80"
      ></canvas>
    </div>
  );
};

export default RoomGameField;
