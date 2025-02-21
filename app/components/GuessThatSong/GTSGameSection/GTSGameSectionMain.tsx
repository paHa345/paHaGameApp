"use client";

import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { redirect } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import StartGameButton from "./StartGameButton";
import { h1 } from "framer-motion/client";

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
    </>
  );
};

export default GTSGameSectionMain;
