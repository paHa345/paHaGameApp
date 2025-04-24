import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AttemptRemainedTimer from "./AttemptRemainedTimer";
import DisplayCurrentTrack from "./DisplayCurrentTrack";
import SongStartStopButton from "./SongStartStopButton";
import AnswersModalMain from "./AnswersModalSection/AnswersModalMain";
import CurrentAttemptQuestionStatusMain from "../GameSection/CurrentAttemptQuestionStatusSection/CurrentAttemptQuestionStatusMain";
import GTSGameAudioVisualiser from "./AudioVisualiserSection/GTSGameAudioVisualiser";

const CurrentGTSGame = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <>
      <div className="flex justify-center items-center h-[80vh] flex-col ">
        {/* <AttemptQuestionStatusMain></AttemptQuestionStatusMain> */}
        <CurrentAttemptQuestionStatusMain></CurrentAttemptQuestionStatusMain>
        {/* <GTSGameAudioVisualiser audioRef={audioRef}></GTSGameAudioVisualiser> */}
        <DisplayCurrentTrack audioRef={audioRef}></DisplayCurrentTrack>
        <SongStartStopButton audioRef={audioRef}></SongStartStopButton>
        <AttemptRemainedTimer></AttemptRemainedTimer>
        <AnswersModalMain></AnswersModalMain>
      </div>
    </>
  );
};

export default CurrentGTSGame;
