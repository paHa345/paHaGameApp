"use client";

import { AppDispatch } from "@/app/store";
import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GTSAddSongQuestionSectionMain from "./GTSAddSongQuectionSection/GTSAddSongQuestionSectionMain";

const GuessThatSongCreateGameMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const gameValue = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGgameValue
  );
  const createdGameName = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGameName
  );
  const gameIsBeingCreated = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.gameIsBeingCreated
  );

  const changeGameValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(GTSCreateGameActions.setGameValue(e.currentTarget.value));
  };
  const changeCreatedGameNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(GTSCreateGameActions.setCreatedGameName(e.currentTarget.value));
  };
  const createGTSGameHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(GTSCreateGameActions.setGameIsBeingCreated(true));
    dispatch(GTSCreateGameActions.setCurrentAddedSong(1));
  };

  return (
    <div className=" pt-8 py-5 min-h-[70vh]">
      <div className=" flex flex-col gap-3 justify-center items-center text-center text-2xl">
        <h1>Укажите количество песен в игре</h1>
        <div className=" border-2 border-solid rounded-md border-cyan-900 w-20">
          <input className=" w-full" type="number" value={gameValue} onChange={changeGameValue} />
        </div>

        <h1>Укажите название игры</h1>
        <div className=" border-2 border-solid rounded-md border-cyan-900">
          <input
            className=" w-full py-1"
            type="text"
            size={40}
            // defaultValue={"Введите название"}
            placeholder="Введите название"
            value={createdGameName ? createdGameName : ""}
            onChange={changeCreatedGameNameHandler}
          />
        </div>
        <div className=" py-5">
          <button
            // disabled
            disabled={gameValue <= 0 || createdGameName.length === 0}
            className={`py-3 px-3 mx-6 ${gameValue > 0 && createdGameName.length !== 0 ? `  transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow` : "  "}  `}
            onClick={createGTSGameHandler}
          >
            <FontAwesomeIcon className=" pr-2" icon={faCirclePlus} />
            Создать игру
          </button>
        </div>
      </div>

      {gameIsBeingCreated && <GTSAddSongQuestionSectionMain></GTSAddSongQuestionSectionMain>}
    </div>
  );
};

export default GuessThatSongCreateGameMain;
