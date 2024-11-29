"use client";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import React from "react";
import { useSelector } from "react-redux";
import CurrentUserCompletedAttempt from "./CurrentUserCompletedAttempt";

const ResultsSectionMain = () => {
  const currentUserCompletedAttempt = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.currentUserCompletedAttempt
  );

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
          <div>
            <CurrentUserCompletedAttempt></CurrentUserCompletedAttempt>
          </div>
        </div>
      )}
    </>
  );
};

export default ResultsSectionMain;
