"use client";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CurrentUserCompletedAttempt from "./CurrentUserCompletedAttempt";
import CurrentGameAttempts from "./CurrentGameAttempts";
import { AppDispatch } from "@/app/store";
import AllGamesList from "./AllGamesList";
import { attemptsActions, IAttemptsSlice } from "@/app/store/attemptsSlice";

const ResultsSectionMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUserCompletedAttempt = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.currentUserCompletedAttempt
  );

  const test = useSelector((state: IAttemptsSlice) => state.attemptsState.attempts);
  console.log(test);
  const handler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(attemptsActions.setCurrentCrosswordAttempts(10));
  };

  return (
    <>
      <div>
        <h1>Результаты</h1>
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
      <div>
        <AllGamesList></AllGamesList>
      </div>
      <div>
        <CurrentGameAttempts></CurrentGameAttempts>
      </div>
    </>
  );
};

export default ResultsSectionMain;
