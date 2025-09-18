import { ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const RoomGameField = () => {
  const canvasRef = useRef(null) as any;

  const squareCoord = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.squareCoordinates
  );

  useEffect(() => {
    var ctx = canvasRef.current.getContext("2d");
    if (squareCoord) {
      ctx.fillRect(squareCoord.x, squareCoord.y, 20, 20);
    }
  }, [squareCoord]);

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
