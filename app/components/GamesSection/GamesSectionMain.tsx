"use client";
import { Container } from "postcss";
import React, { useEffect } from "react";
import GameSectionCard from "./GameSectionCard";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { crossworGamedActions } from "@/app/store/crosswordGameSlice";

const GamesSectionMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // console.log("clear attempt data");
    dispatch(crossworGamedActions.clearCurrentUserCompletedAttempt());
    dispatch(crossworGamedActions.setEndAttempt(false));
  });

  return (
    <section className=" container mx-auto">
      <div className=" py-5">
        <h1 className=" text-center text-3xl font-bold">Список Игр</h1>
      </div>
      <div className=" px-4  grid lg:grid-cols-3 sm:grid-cols-2 gap-9 justify-center items-center py-5">
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
            description: "Получиться разгадать все мелодии за указанное время?",
            image: "headphones",

            backgroundColor: "cyan",
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
