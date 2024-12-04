"use client";
import React, { useEffect } from "react";
import ChooseCrosswordButton from "./ChooseCrosswordButton";
import { useDispatch, useSelector } from "react-redux";
import { crossworGamedActions, ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import LoadCrosswordGameModalMain from "../CrosswordGameLoadModalSection/LoadCrosswordGameModalMain";
import { AppDispatch } from "@/app/store";
import { redirect } from "next/navigation";
const CrosswordGameSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const showCrosswordGameChooseModal = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.showChooseCrosswordModal
  );

  useEffect(() => {
    const currentCrossword = localStorage.getItem("currentCrosswordGame");
    const currentAttemptID = localStorage.getItem("currentAttemptID");

    if (currentCrossword !== null && currentAttemptID !== null) {
      dispatch(crossworGamedActions.setAttemptID(JSON.parse(currentAttemptID)));
      dispatch(crossworGamedActions.setCrosswordGame(JSON.parse(currentCrossword)));

      dispatch(crossworGamedActions.setStartGameStatus(true));

      redirect("/crosswordGame/game");
    }
  });
  return (
    <div className=" flex justify-center items-center h-[80vh] py-10 px-8">
      {showCrosswordGameChooseModal && <LoadCrosswordGameModalMain></LoadCrosswordGameModalMain>}
      <ChooseCrosswordButton></ChooseCrosswordButton>
    </div>
  );
};

export default CrosswordGameSection;
