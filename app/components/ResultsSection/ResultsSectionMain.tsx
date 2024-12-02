"use client";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CurrentUserCompletedAttempt from "./CurrentUserCompletedAttempt";
import CurrentGameAttempts from "./CurrentGameAttempts";
import { attemptsActions, IAttemptsSlice } from "@/app/store/attemptsSlice";
import { AppDispatch } from "@/app/store";

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
        <button onClick={handler}>Set 10</button>
        <h1>{test}</h1>
        <CurrentUserCompletedAttempt></CurrentUserCompletedAttempt>
      </div>
      <div>
        <CurrentGameAttempts></CurrentGameAttempts>
      </div>
    </>
  );
};

export default ResultsSectionMain;
