"use client";

import { guessThatSongActions, IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StartGameButton from "./StartGameButton";
import CurrentGTSGame from "./CurrentGTSGame";
import CurrentAttemptQuestionStatusMain from "../GameSection/CurrentAttemptQuestionStatusSection/CurrentAttemptQuestionStatusMain";
import CurrentAttemptTimeStatusMain from "../GameSection/CurrentAttemptTimeStatusSection/CurrentAttemptTimeStatusMain";
import AudioVisualiserMain from "./AudioVisualiserSection/AudioVisualiserMain";
import GTSGameAudioVisualiser from "./AudioVisualiserSection/GTSGameAudioVisualiser";
import { div } from "framer-motion/client";
import { IUserSlice } from "@/app/store/userSlice";
import { AppDispatch } from "@/app/store";

const GTSGameSectionMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentAttemptID = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSGameAttemptID
  );
  const startGameStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.startGameStatus
  );

  const currentAttempt = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData
  );

  // const currentGameType = useSelector(
  //   (state: IUserSlice) => state.userState.currentGameShowAnswerStatus
  // );
  // // console.log(currentGameType);
  // const currentGameShowAnswer = useSelector(
  //   (state: IUserSlice) => state.userState.currentGameShowAnswerStatus
  // );

  const gamesData = useSelector((state: IUserSlice) => state.userState.gamesData);

  useEffect(() => {
    // тут устанавливаем статус показа ответов первого этапа при проигрывании вопроса
    // const path = `/${window.location.pathname.split("/")[1]}`;
    // if (gamesData) {
    //   const data = Object.keys(gamesData).includes(`/${currentGameType}`)
    //     ? gamesData[path]
    //     : undefined;
    //   dispatch(guessThatSongActions.setShowCurrentGameFirstStepAnswer(data?.showFirstStepAnswer));
    // }
  }, []);

  if (!currentAttemptID) {
    redirect("/guessThatSongGame");
  }
  return (
    <>
      <div className=" bg-zinc-100 pt-7 rounded-sm shadow-smallShadow">
        {/* <AudioVisualiserMain></AudioVisualiserMain> */}
        {!startGameStatus && (
          <div>
            {/* <GTSGameAudioVisualiser></GTSGameAudioVisualiser> */}
            <div className=" flex justify-center items-center h-[80vh] flex-col gap-7 ">
              <CurrentAttemptQuestionStatusMain></CurrentAttemptQuestionStatusMain>
              <StartGameButton></StartGameButton>{" "}
              <CurrentAttemptTimeStatusMain></CurrentAttemptTimeStatusMain>
            </div>
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
