"use client";
import React from "react";
import ChooseCrosswordButton from "./ChooseCrosswordButton";
import { useSelector } from "react-redux";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import LoadCrosswordGameModalMain from "../CrosswordGameLoadModalSection/LoadCrosswordGameModalMain";
const CrosswordGameSection = () => {
  const showCrosswordGameChooseModal = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.showChooseCrosswordModal
  );
  return (
    <div className=" flex justify-center items-center h-[80vh] py-10 px-8">
      {showCrosswordGameChooseModal && <LoadCrosswordGameModalMain></LoadCrosswordGameModalMain>}
      <ChooseCrosswordButton></ChooseCrosswordButton>
    </div>
  );
};

export default CrosswordGameSection;
