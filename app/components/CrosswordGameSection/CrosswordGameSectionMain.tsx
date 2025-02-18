"use client";
import React, { useEffect, useRef, useState } from "react";
import ChooseCrosswordButton from "./ChooseCrosswordButton";
import { useDispatch, useSelector } from "react-redux";
import {
  crossworGamedActions,
  getUserCurrentAttempt,
  ICrosswordGameSlice,
} from "@/app/store/crosswordGameSlice";
import LoadCrosswordGameModalMain from "../CrosswordGameLoadModalSection/LoadCrosswordGameModalMain";
import { AppDispatch } from "@/app/store";
import { redirect } from "next/navigation";

import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import Modal from "../CrosswordGameLoadModalSection/TestModal";
import { IAppSlice } from "@/app/store/appStateSlice";

const CrosswordGameSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const showCrosswordGameChooseModal = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.showChooseCrosswordModal
  );

  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  useEffect(() => {
    const currentCrossword = localStorage.getItem("currentCrosswordGame");
    const currentAttemptID = localStorage.getItem("currentAttemptID");
    dispatch(crossworGamedActions.setShowEndGameModal(false));

    if (currentCrossword !== null && currentAttemptID !== null) {
      dispatch(
        getUserCurrentAttempt({
          telegramUserID: telegramUser?.id,
          attemptID: currentAttemptID?.slice(1, -1),
        })
      );
      dispatch(crossworGamedActions.setAttemptID(JSON.parse(currentAttemptID)));
      dispatch(crossworGamedActions.setCrosswordGame(JSON.parse(currentCrossword)));
      dispatch(crossworGamedActions.setStartGameStatus(true));
      redirect("/crosswordGame/game");
    }
  });

  return (
    <div className=" flex justify-center items-center h-[80vh] py-10 px-8">
      <LoadCrosswordGameModalMain />
      {!showCrosswordGameChooseModal && <ChooseCrosswordButton></ChooseCrosswordButton>}
    </div>
  );
};

export default CrosswordGameSection;
