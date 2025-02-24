import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React, { ReactElement, useRef } from "react";
import { useSelector } from "react-redux";
import AttemptRemainedTimer from "./AttemptRemainedTimer";
import DisplayCurrentTrack from "./DisplayCurrentTrack";
import SongStartStopButton from "./SongStartStopButton";

const CurrentGTSGame = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  console.log(audioRef.current);
  let aborter = new AbortController();

  return (
    <>
      <div className="flex justify-center items-center h-[70vh] flex-col ">
        <div>CurrentGTSGame</div>
        <DisplayCurrentTrack audioRef={audioRef} abortController={aborter}></DisplayCurrentTrack>
        <SongStartStopButton abortController={aborter} audioRef={audioRef}></SongStartStopButton>
        <AttemptRemainedTimer></AttemptRemainedTimer>
      </div>
    </>
  );
};

export default CurrentGTSGame;
