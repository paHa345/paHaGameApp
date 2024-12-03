"use client";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CurrentUserCompletedAttempt from "./CurrentUserCompletedAttempt";
import CurrentGameAttempts from "./CurrentGameAttempts";
import { AppDispatch } from "@/app/store";
import AllGamesList from "./AllGamesList";
import { attemptsActions, IAttemptsSlice } from "@/app/store/attemptsSlice";
import { useTelegram } from "@/app/telegramProvider";

const ResultsSectionMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUserCompletedAttempt = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.currentUserCompletedAttempt
  );

  useEffect(() => {
    dispatch(attemptsActions.setGameAllAttempts(undefined));
  });

  const { user } = useTelegram();

  return (
    <>
      <section className={`min-h-[80vh] container mx-auto`}>
        <div className=" py-5">
          <h1 className=" text-center text-3xl font-bold">Результаты</h1>
        </div>
        {currentUserCompletedAttempt && (
          <div>
            <div>
              <h1>Моя попытка</h1>
            </div>
          </div>
        )}
        <div>
          <CurrentUserCompletedAttempt></CurrentUserCompletedAttempt>
        </div>
        <div className=" flex flex-col justify-center items-center">
          <AllGamesList></AllGamesList>
        </div>
        <div className=" flex flex-col justify-center items-center py-3">
          <CurrentGameAttempts></CurrentGameAttempts>
        </div>
      </section>
    </>
  );
};

export default ResultsSectionMain;
