"use client";
import { crossworGamedActions, ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import React, { MutableRefObject, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CrosswordGameCellMain from "./CrosswordGameCellMain";
import CrosswordGameQuestionsMain from "./CrosswordGameQuestionsMain";
import CrosswordGameCellMenuMain from "../CrosswordGameCellMenuSection/CrosswordGameCellMenuMain";
import { useTelegram } from "@/app/telegramProvider";
import StartGameModalMain from "./StartGameModalMain";
import { redirect } from "next/navigation";
import EndGameButton from "./EndGameButton";
import InputLetter from "./InputLetter";
import { AppDispatch } from "@/app/store";

const CrosswordGameTableMain = () => {
  const crosswordGame = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame
  );

  const dispatch = useDispatch<AppDispatch>();

  const startGame = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.startGameStatus
  );

  const baseInput = useSelector((state: ICrosswordGameSlice) => state.crosswordGameState.baseInput);

  const { user, webApp } = useTelegram();

  const showCellMenu = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.showCrosswordGameCellMenu
  );

  const ref = React.useRef<HTMLInputElement>(null) as MutableRefObject<HTMLInputElement>;

  const highlightedCell = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.highlightedCell
  );

  const selectedCell = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.selectedCell
  );
  const currentCrosswordGame = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame
  );

  const currentAttemptID = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.attemptID
  );

  const highlightedWord = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.highlightedWordObj
  );

  const setLetterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // dispatch(crossworGamedActions.changeBaseInput(e.currentTarget.value));
    // dispatch(crossworGamedActions.setSelectedElLetter(e.currentTarget.value));
  };
  // console.log(highlightedCell?.addedWordArr);

  const [first, setfirst] = useState(0);

  const inputKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // e.preventDefault();
    console.log(e.which);
    setfirst(e.which);
    if (e.key.length > 1 && e.key !== "Backspace") {
      return;
    }
    if (e.key === "Backspace") {
      console.log("Back");
    }
    dispatch(crossworGamedActions.changeBaseInput(e.key));

    dispatch(crossworGamedActions.setSelectedElLetter(e.key));
  };

  if (!crosswordGame._id) {
    redirect("/crosswordGame");
  }

  const crosswordGameTableEl = crosswordGame.crosswordObj.map((el, i: number) => {
    return (
      <div className=" flex gap-1 mb-1 cellContainer" key={i}>
        {el.map((cell, j: number) => {
          return (
            <div key={`${i}:${j}`}>
              <CrosswordGameCellMain ref={ref} cell={cell} i={i} j={j}></CrosswordGameCellMain>
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

        <h1>{first}</h1>

        {/* <h1>{highlightedCell?.questionObj.horizontal?.value}</h1>
        <h1>{highlightedCell?.questionObj.vertical?.value}</h1>
        <h1>{selectedCell?.key}</h1> */}

        <br />
        <br />
        <h1 className=" text-center text-4xl">{crosswordGame.name}</h1>
        <br />

        <br />
        <div>
          <input
            ref={ref}
            style={{ right: "-5px", bottom: "0px" }}
            className=" inputBase left-0 top-1/2 fixed opacity-0 h-6 w-6  text-slate-50 text-3xl font-extrabold"
            type="text"
            maxLength={1}
            value={baseInput}
            onChange={setLetterHandler}
            onKeyUp={inputKeyDownHandler}
          />
        </div>
        <EndGameButton></EndGameButton>
      </div>
      {crosswordGameTableEl}
      {startGame && (
        <div className=" pb-20">
          <CrosswordGameQuestionsMain></CrosswordGameQuestionsMain>
        </div>
      )}
    </div>
  );
};

export default CrosswordGameTableMain;
