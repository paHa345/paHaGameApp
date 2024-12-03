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
      <div className="flex justify-center items-center flex-col gap-5">
        {currentUserCompletedAttempt?.completedCorrectly === true && (
          <div className="flex justify-center items-center flex-col gap-5 ">
            <h1 className=" text-center text-xl">
              Поздравляем, вы успешно справились с кроссвордом:{" "}
              <span className=" font-semibold">{currentUserCompletedAttempt?.crosswordName}</span>
            </h1>
            <h1 className=" text-center text-xl">
              Ваше время:(Час:Мин:Сек){" "}
              <span className=" underline underline-offset-4">
                {currentUserCompletedAttempt?.duration}
              </span>
            </h1>
          </div>
        )}
        {currentUserCompletedAttempt?.completedCorrectly === false && (
          <div>
            <h1 className=" text-center">
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
