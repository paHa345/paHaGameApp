import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Spark from "./Spark";
import PlayerSparksMain from "./PlayerSparksMain";

const SparksMain = () => {
  console.log("Sparks redraw");

  //   const sparksEls = Object.entries(sparksEffects).map((el) => {
  //     return (
  //       <Spark
  //         key={el[1].id}
  //         id={el[1].id}
  //         timestamp={el[1].timestamp}
  //         position={el[1].position}
  //       ></Spark>
  //     );
  //   });

  return (
    <>
      <PlayerSparksMain playerID={"player"}></PlayerSparksMain>
    </>
  );
};

export default SparksMain;
