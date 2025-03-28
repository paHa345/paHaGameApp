"use client";
import { crossworGamedActions, ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CurrentGameAttempts from "./CurrentGameAttempts";
import { AppDispatch } from "@/app/store";
import AllGamesList from "./AllGamesList";
import { attemptsActions, attemptsFetchStatus, IAttemptsSlice } from "@/app/store/attemptsSlice";

import { IAppSlice } from "@/app/store/appStateSlice";
import SelectGameButtonsMain from "./SelectGameButtonsSection/SelectGameButtonsMain";
import { guessThatSongActions, IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import CurrentUserCompletedCrosswordAttempt from "./CurrentUserCompletedCrosswordAttempt";
import CurrentUserCompletedGTSGameAttempt from "./CurrentUserCompletedGTSGameAttempt";

const ResultsSectionMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUserCompletedAttempt = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.currentUserCompletedAttempt
  );

  const currentGTSGameCompletedAttempt = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentUserCompletedGTSAttempt
  );

  const currentGamesType = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.selectedGamesName
  );

  const currentUserCompletedCrosswordAttempt = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.currentUserCompletedAttempt
  );

  const currentUserCompletedGTSGameAttempt = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentUserCompletedGTSAttempt
  );

  useEffect(() => {
    dispatch(attemptsActions.setGameAllAttempts(undefined));
    dispatch(attemptsActions.setGetGameAllAttemptsFetchStatus(attemptsFetchStatus.Ready));
    dispatch(crossworGamedActions.setEndAttempt(false));
  });

  useEffect(() => {
    if (currentUserCompletedCrosswordAttempt) {
      dispatch(attemptsActions.setSelectedGamesName("Crossword"));
    }

    if (currentUserCompletedGTSGameAttempt) {
      dispatch(attemptsActions.setSelectedGamesName("GTS"));
    }
  }, []);

  return (
    <>
      <section className={`min-h-[80vh] container mx-auto pb-20`}>
        <div className=" py-5">
          <h1 className="font-roboto text-center text-3xl font-bold">Результаты</h1>
          <SelectGameButtonsMain></SelectGameButtonsMain>
        </div>
        {currentGTSGameCompletedAttempt && (
          <div className=" w-full shadow-crosswordGameCellMenuButtonActive rounded-lg py-5 my-3 flex justify-center items-center flex-col gap-2">
            <div>
              <h1 className=" text-2xl">Попытка завершена</h1>
            </div>
            <div className="w-full flex justify-center items-center flex-col gap-2">
              <CurrentUserCompletedGTSGameAttempt></CurrentUserCompletedGTSGameAttempt>
            </div>
          </div>
        )}
        {currentUserCompletedAttempt && (
          <div className=" w-full shadow-crosswordGameCellMenuButtonActive rounded-lg py-5 my-3 flex justify-center items-center flex-col gap-2">
            <div>
              <h1 className=" text-2xl">Попытка завершена</h1>
            </div>
            <div className="flex justify-center items-center flex-col gap-2">
              <CurrentUserCompletedCrosswordAttempt></CurrentUserCompletedCrosswordAttempt>
            </div>
          </div>
        )}

        {currentGamesType && (
          <div className=" flex flex-col justify-center items-center">
            <AllGamesList></AllGamesList>
          </div>
        )}

        <div className=" flex flex-col justify-center items-center py-3">
          <CurrentGameAttempts></CurrentGameAttempts>
        </div>
      </section>
    </>
  );
};

export default ResultsSectionMain;
