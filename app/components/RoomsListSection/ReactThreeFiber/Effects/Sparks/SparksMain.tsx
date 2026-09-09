import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Spark from "./Spark";

const SparksMain = () => {
  const sparksEffects = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.effects.sparks,
  );

  const sparksEls = Object.entries(sparksEffects).map((el) => {
    return <Spark key={el[1].id} id={el[1].id} position={el[1].position}></Spark>;
  });

  return <>{sparksEls}</>;
};

export default SparksMain;
