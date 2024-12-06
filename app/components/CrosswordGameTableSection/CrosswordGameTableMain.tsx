"use client";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import React from "react";
import { useSelector } from "react-redux";
import CrosswordGameCellMain from "./CrosswordGameCellMain";
import CrosswordGameQuestionsMain from "./CrosswordGameQuestionsMain";
import CrosswordGameCellMenuMain from "../CrosswordGameCellMenuSection/CrosswordGameCellMenuMain";
import { useTelegram } from "@/app/telegramProvider";
import StartGameModalMain from "./StartGameModalMain";
import { redirect } from "next/navigation";
import EndGameButton from "./EndGameButton";

const CrosswordGameTableMain = () => {
  const crosswordGame = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame
  );

  const startGame = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.startGameStatus
  );

  const { user, webApp } = useTelegram();

  const showCellMenu = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.showCrosswordGameCellMenu
  );

  const highlightedCell = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.highlightedCell
  );

  const selectedCell = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.selectedCell
  );

  const highlightedWord = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.highlightedWordObj
  );

  // console.log(highlightedCell?.addedWordArr);

  if (!crosswordGame._id) {
    redirect("/crosswordGame");
  }

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
      {!startGame && <StartGameModalMain></StartGameModalMain>}

      {showCellMenu && (
        <div className=" z-10">
          <CrosswordGameCellMenuMain></CrosswordGameCellMenuMain>
        </div>
      )}

      <div className=" pb-8">
        <br />

        {user?.username && (
          <div className=" text-2xl pb-4">
            <h2>Приветствуем, {user?.username}</h2>
            {/* <h3>Your Telegram ID: {user?.id}</h3> */}
          </div>
        )}

        {/* <h1>{highlightedCell?.questionObj.horizontal?.value}</h1>
        <h1>{highlightedCell?.questionObj.vertical?.value}</h1>
        <h1>{selectedCell?.key}</h1> */}

        <br />
        <br />
        <h1 className=" text-center text-4xl">{crosswordGame.name}</h1>
        <br />

        <br />

        <EndGameButton></EndGameButton>
      </div>
      {crosswordGameTableEl}
      {startGame && (
        <div>
          <CrosswordGameQuestionsMain></CrosswordGameQuestionsMain>
        </div>
      )}
    </div>
  );
};

export default CrosswordGameTableMain;
