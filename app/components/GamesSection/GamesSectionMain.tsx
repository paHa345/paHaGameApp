"use client";
import { Container } from "postcss";
import React, { useEffect } from "react";
import GameSectionCard from "./GameSectionCard";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { crossworGamedActions } from "@/app/store/crosswordGameSlice";
import { guessThatSongActions } from "@/app/store/guessThatSongSlice";

const GamesSectionMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // console.log("clear attempt data");
    dispatch(guessThatSongActions.setCurrentUserCompletedGTSAttempt(undefined));
    dispatch(crossworGamedActions.clearCurrentUserCompletedAttempt());
    dispatch(crossworGamedActions.setEndAttempt(false));
  });

  return (
    <section className=" container mx-auto">
      <div className=" py-5">
        <h1 className=" text-center text-3xl font-bold">Список Игр</h1>
      </div>
      <div className=" px-4  grid lg:grid-cols-3 sm:grid-cols-2 gap-9 justify-center items-center py-5 ">
        <GameSectionCard
          gameData={{
            title: "Кроссворды",
            link: "crosswordGame",
            image: "crossword",
            description: "Попробуй разгадать кроссворд быстрее других игроков?",
            backgroundColor: "lime",
          }}
        ></GameSectionCard>
        <GameSectionCard
          gameData={{
            title: "Угадай мелодии",
            link: "guessThatSongGame",
            description: "Получится разгадать все мелодии за указанное время?",
            image: "headphones",

            backgroundColor: "cyan",
          }}
        ></GameSectionCard>
        <GameSectionCard
          gameData={{
            title: "Авто аудио викторина",
            link: "carAudioGame",
            description: "Автомобильная аудио-визуальная игра",
            image: "car",

            backgroundColor: "indigo",
          }}
        ></GameSectionCard>

        {/* <GameSectionCard></GameSectionCard>
        <GameSectionCard></GameSectionCard>
        <GameSectionCard></GameSectionCard> */}
      </div>
    </section>
  );
};

export default GamesSectionMain;
