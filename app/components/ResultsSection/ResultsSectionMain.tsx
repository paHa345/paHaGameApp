"use client";
import { crossworGamedActions, ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CurrentUserCompletedAttempt from "./CurrentUserCompletedAttempt";
import CurrentGameAttempts from "./CurrentGameAttempts";
import { AppDispatch } from "@/app/store";
import AllGamesList from "./AllGamesList";
import { attemptsActions, attemptsFetchStatus, IAttemptsSlice } from "@/app/store/attemptsSlice";
import { useTelegram } from "@/app/telegramProvider";
import { CSSTransition } from "react-transition-group";
import { Transition } from "react-transition-group";
import ReactDOM from "react-dom";

const ResultsSectionMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUserCompletedAttempt = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.currentUserCompletedAttempt
  );

  useEffect(() => {
    dispatch(attemptsActions.setGameAllAttempts(undefined));
    dispatch(attemptsActions.setGetGameAllAttemptsFetchStatus(attemptsFetchStatus.Ready));
    dispatch(crossworGamedActions.setEndAttempt(false));
  });

  const { user } = useTelegram();

  return (
    <>
      <section className={`min-h-[80vh] container mx-auto`}>
        <div className=" py-5">
          <h1 className="font-roboto text-center text-3xl font-bold">Результаты</h1>
        </div>
        {currentUserCompletedAttempt && (
          <div className=" flex justify-center items-center flex-col gap-2">
            <div>
              <h1 className=" text-2xl">Попытка завершена</h1>
            </div>
            <div className="flex justify-center items-center flex-col gap-2">
              <CurrentUserCompletedAttempt></CurrentUserCompletedAttempt>
            </div>
          </div>
        )}
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
