import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Spark from "./Spark";

interface IPlayerSparcsProps {
  playerID: string;
}
const PlayerSparksMain = ({ playerID }: IPlayerSparcsProps) => {
  const playerSparks = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.effects.sparks[playerID],
  );

  console.log(playerSparks);

  const sparksEls = Object.entries(playerSparks).map((el) => {
    return (
      <Spark
        key={el[1].id}
        id={el[1].id}
        timestamp={el[1].timestamp}
        position={[0, 0, 0]}
      ></Spark>
    );
  });

  return <>{sparksEls}</>;
};

export default PlayerSparksMain;
