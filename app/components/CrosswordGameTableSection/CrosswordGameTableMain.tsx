"use client";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import React from "react";
import { useSelector } from "react-redux";
import CrosswordGameCellMain from "./CrosswordGameCellMain";
import CrosswordGameQuestionsMain from "./CrosswordGameQuestionsMain";
import CrosswordGameCellMenuMain from "../CrosswordGameCellMenuSection/CrosswordGameCellMenuMain";

const CrosswordGameTableMain = () => {
  const crosswordGame = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame
  );

  const showCellMenu = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.showCrosswordGameCellMenu
  );

  const crosswordGameTableEl = crosswordGame.crosswordObj.map((el, i: number) => {
    return (
      <div className=" flex gap-1 mb-1 cellContainer" key={i}>
        {el.map((cell, j: number) => {
          return (
            <div key={`${i}:${j}`}>
              <CrosswordGameCellMain cell={cell} i={i} j={j}></CrosswordGameCellMain>
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <div className=" py-10">
      {showCellMenu && <CrosswordGameCellMenuMain></CrosswordGameCellMenuMain>}

      <div className=" pb-8">
        <h1 className=" text-center text-4xl">{crosswordGame.name}</h1>
      </div>
      {crosswordGameTableEl}

      <div>
        <CrosswordGameQuestionsMain></CrosswordGameQuestionsMain>
      </div>
    </div>
  );
};

export default CrosswordGameTableMain;
