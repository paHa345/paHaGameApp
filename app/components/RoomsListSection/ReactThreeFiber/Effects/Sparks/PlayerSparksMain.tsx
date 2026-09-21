import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Spark from "./Spark";

interface IPlayerSparcsProps {
  playerID: string;
}
const PlayerSparksMain = ({ playerID }: IPlayerSparcsProps) => {
  const playerSparks = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.effects.sparks[playerID],
  );
  const player = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerBodyRef,
  );

  const playerPosition = player?.translation();
  const playerRotation = player?.rotation();

  const sparksEls = Object.entries(playerSparks).map((el) => {
    return (
      <Spark
        key={el[1].id}
        id={el[1].id}
        timestamp={el[1].timestamp}
        position={[
          playerPosition ? playerPosition.x : 0,
          playerPosition ? playerPosition.y : 0,
          playerPosition ? playerPosition.z : 0,
        ]}
        rotation={[
          playerRotation ? playerRotation.x : 0,
          playerRotation ? playerRotation.y : 0,
          playerRotation ? playerRotation.z : 0,
          playerRotation ? playerRotation.w : 0,
        ]}
      ></Spark>
    );
  });

  return <>{sparksEls}</>;
};

export default PlayerSparksMain;
