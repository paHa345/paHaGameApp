import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React, { ReactElement, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AttemptRemainedTimer from "./AttemptRemainedTimer";
import DisplayCurrentTrack from "./DisplayCurrentTrack";
import SongStartStopButton from "./SongStartStopButton";
import AnswersModalMain from "./AnswersModalSection/AnswersModalMain";

const CurrentGTSGame = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <>
      <div className="flex justify-center items-center h-[70vh] flex-col ">
        <div>CurrentGTSGame</div>
        <DisplayCurrentTrack audioRef={audioRef}></DisplayCurrentTrack>
        <SongStartStopButton audioRef={audioRef}></SongStartStopButton>
        <AttemptRemainedTimer></AttemptRemainedTimer>
        <AnswersModalMain></AnswersModalMain>
      </div>
    </>
  );
};

export default CurrentGTSGame;
