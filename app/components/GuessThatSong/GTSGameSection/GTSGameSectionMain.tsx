"use client";

import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { redirect } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import StartGameButton from "./StartGameButton";
import CurrentGTSGame from "./CurrentGTSGame";

const GTSGameSectionMain = () => {
  const currentAttemptID = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSGameAttemptID
  );
  console.log(currentAttemptID);
  const startGameStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.startGameStatus
  );
  console.log(startGameStatus);
  if (!currentAttemptID) {
    redirect("/guessThatSongGame");
  }
  return (
    <>
      {!startGameStatus && (
        <div className="flex justify-center items-center h-[70vh] ">
          <StartGameButton></StartGameButton>{" "}
        </div>
      )}
      {startGameStatus && (
        // <div className="flex justify-center items-center h-[70vh] ">
        //   <h1 className="text-3xl text-center">Игра началась</h1>
        <CurrentGTSGame></CurrentGTSGame>
        // </div>
      )}
    </>
  );
};

export default GTSGameSectionMain;
