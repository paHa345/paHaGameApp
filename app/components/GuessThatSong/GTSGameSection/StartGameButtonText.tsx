import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React from "react";
import { useSelector } from "react-redux";

const StartGameButtonText = () => {
  const currentNumberAttemptQuestion = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.currentQuestion
  );
  return <h1>{currentNumberAttemptQuestion === 0 ? "Начать попытку" : "Следующая песня"}</h1>;
};

export default StartGameButtonText;
