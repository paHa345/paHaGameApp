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
import { ICrossword } from "@/app/types";

const CrosswordGameTableMain = () => {
  const crosswordGame = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame
  );

  const dispatch = useDispatch<AppDispatch>();

  const startGame = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.startGameStatus
  );

  const baseInput = useSelector((state: ICrosswordGameSlice) => state.crosswordGameState.baseInput);

  const phoneLetters = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.phoneLetters
  );

  const { user, webApp } = useTelegram();

  const showCellMenu = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.showCrosswordGameCellMenu
  );

  const ref = React.useRef<HTMLInputElement>(null) as MutableRefObject<HTMLInputElement>;
  const refSecound = React.useRef<HTMLInputElement>(null) as MutableRefObject<HTMLInputElement>;

  const setLetterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // dispatch(crossworGamedActions.changeBaseInput(e.currentTarget.value));
    // dispatch(crossworGamedActions.setSelectedElLetter(e.currentTarget.value));
    console.log(e.currentTarget.value);

    dispatch(crossworGamedActions.changeBaseInput(e.currentTarget.value));
    dispatch(crossworGamedActions.setSelectedElLetter(e.currentTarget.value));

    const elSecound = refSecound.current;
    const elFirst = ref.current;

    setTimeout(() => {
      elSecound.focus();
      elFirst.focus();
    }, 0);
  };

  const inputKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      dispatch(crossworGamedActions.changeBaseInput(e.key));
      dispatch(crossworGamedActions.setSelectedElLetter(e.key));
    }

    if (e.key.length > 1 && e.key !== "Backspace") {
      return;
    }
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
              <CrosswordGameCellMain
                refSecound={refSecound}
                ref={ref}
                cell={cell}
                i={i}
                j={j}
              ></CrosswordGameCellMain>
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

        <h1>{phoneLetters}</h1>
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
        <div>
          <input
            ref={ref}
            style={{ right: "-5px", bottom: "0px" }}
            className=" inputBase left-0 top-1/2 fixed opacity-0 h-0 w-0  text-slate-50 text-3xl font-extrabold"
            type="text"
            maxLength={1}
            value={baseInput}
            onChange={setLetterHandler}
            onKeyUp={inputKeyDownHandler}
          />
          <input
            ref={refSecound}
            style={{ right: "-5px", bottom: "0px" }}
            className=" inputBaseSecound left-0 top-1/2 fixed opacity-0 h-0 w-0  text-slate-50 text-3xl font-extrabold"
            type="text"
            maxLength={1}
            value={baseInput}
            // onChange={setLetterHandler}
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
