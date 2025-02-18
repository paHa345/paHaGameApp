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
      {/* <AnimatePresence initial={false}>
        {showCrosswordGameChooseModal ? (
          <motion.div
            transition={{ duration: 0.3 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className=" h-full w-full"
            key="box"
          >
            {" "}
            <LoadCrosswordGameModalMain></LoadCrosswordGameModalMain>
          </motion.div>
        ) : (
          <ChooseCrosswordButton></ChooseCrosswordButton>
        )}
      </AnimatePresence> */}

      {/* <AnimatePresence
        // Disable any initial animations on children that
        // are present when the component is first rendered
        initial={false}
        // Only render one component at a time.
        // The exiting component will finish its exit
        // animation before entering component is rendered
        mode="sync"
        // Fires when all exiting nodes have completed animating out
        onExitComplete={() => null}
      > */}
      {/* {showCrosswordGameChooseModal ? ( */}
      <LoadCrosswordGameModalMain />
      {/* ) : ( */}
      {!showCrosswordGameChooseModal && <ChooseCrosswordButton></ChooseCrosswordButton>}
      {/* )} */}
      {/* </AnimatePresence> */}

      {/* <button className="button" onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </div>
  );
};

export default CrosswordGameSection;
