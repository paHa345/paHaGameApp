"use client";

import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import React from "react";
import { useSelector } from "react-redux";

const CurrentUserCompletedAttempt = () => {
  const currentUserCompletedAttempt = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.currentUserCompletedAttempt
  );

  return (
    <>
      <div>
        {currentUserCompletedAttempt?.completedCorrectly === true && (
          <div>
            <h1>
              Поздравляем, вы справились с кроссвордом:{" "}
              <span>{currentUserCompletedAttempt?.crosswordName}</span>
            </h1>
            <h1>
              Ваше время:(Час:Мин:Сек) <span>{currentUserCompletedAttempt?.duration}</span>
            </h1>
          </div>
        )}
        {currentUserCompletedAttempt?.completedCorrectly === false && (
          <div>
            <h1>
              Сожалеем, вы не смогли справиться с кроссвордом:{" "}
              <span>{currentUserCompletedAttempt?.crosswordName}</span>
            </h1>
            {/* <h1>
              Ваше время:(Час:Мин:Сек) <span>{currentUserCompletedAttempt?.duration}</span>
            </h1> */}
          </div>
        )}
      </div>
    </>
  );
};

export default CurrentUserCompletedAttempt;
