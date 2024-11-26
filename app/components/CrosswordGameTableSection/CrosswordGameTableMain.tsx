"use client";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import React from "react";
import { useSelector } from "react-redux";
import CrosswordGameCellMain from "./CrosswordGameCellMain";
import CrosswordGameQuestionsMain from "./CrosswordGameQuestionsMain";
import CrosswordGameCellMenuMain from "../CrosswordGameCellMenuSection/CrosswordGameCellMenuMain";
import { useTelegram } from "@/app/telegramProvider";

const CrosswordGameTableMain = () => {
  const crosswordGame = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame
  );

  const { user, webApp } = useTelegram();

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
  console.log(user);

  return (
    <div className=" py-10">
      {showCellMenu && <CrosswordGameCellMenuMain></CrosswordGameCellMenuMain>}

      <div className=" pb-8">
        <br />
        <br />
        <br />
        {user && (
          <div>
            <h2>Welcome, {user?.username}!</h2>
            <h3>Your Telegram ID: {user?.id}</h3>
          </div>
        )}

        <h1 className=" text-center text-4xl">{crosswordGame.name}</h1>
        <br />

        <br />
      </div>
      {crosswordGameTableEl}

      <div>
        <CrosswordGameQuestionsMain></CrosswordGameQuestionsMain>
      </div>
    </div>
  );
};

export default CrosswordGameTableMain;
