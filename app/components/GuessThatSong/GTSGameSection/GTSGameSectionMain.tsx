"use client";

import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { redirect } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import StartGameButton from "./StartGameButton";
import CurrentGTSGame from "./CurrentGTSGame";
import CurrentAttemptQuestionStatusMain from "../GameSection/CurrentAttemptQuestionStatusSection/CurrentAttemptQuestionStatusMain";
import CurrentAttemptTimeStatusMain from "../GameSection/CurrentAttemptTimeStatusSection/CurrentAttemptTimeStatusMain";
import AudioVisualiserMain from "./AudioVisualiserSection/AudioVisualiserMain";

const GTSGameSectionMain = () => {
  const currentAttemptID = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSGameAttemptID
  );
  const startGameStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.startGameStatus
  );

  const currentAttempt = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData
  );

  if (!currentAttemptID) {
    redirect("/guessThatSongGame");
  }
  return (
    <>
      <div className=" bg-zinc-100 py-7 rounded-sm shadow-smallShadow">
        {/* <AudioVisualiserMain></AudioVisualiserMain> */}
        {!startGameStatus && (
          <div className=" flex justify-center items-center h-[79vh] flex-col gap-7 ">
            <CurrentAttemptQuestionStatusMain></CurrentAttemptQuestionStatusMain>
            <StartGameButton></StartGameButton>{" "}
            <CurrentAttemptTimeStatusMain></CurrentAttemptTimeStatusMain>
          </div>
        )}
        {startGameStatus && (
          // <div className="flex justify-center items-center h-[70vh] ">
          //   <h1 className="text-3xl text-center">Игра началась</h1>
          <CurrentGTSGame></CurrentGTSGame>
          // </div>
        )}
      </div>
    </>
  );
};

export default GTSGameSectionMain;
