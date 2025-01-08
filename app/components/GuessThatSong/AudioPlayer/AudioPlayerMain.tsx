"use client";
import React, { useRef, useState } from "react";
import AudioPlayerControls from "./AudioPlayerControls";
import DisplayTrack from "./DisplayTrack";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "@/app/store";
import { crossworGamedActions } from "@/app/store/crosswordGameSlice";
import ProgressBar from "./ProgressBar";
const AudioPlayerMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef(null);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  console.log(audioRef);

  return (
    <div>
      <figure>
        <DisplayTrack audioRef={audioRef}></DisplayTrack>
        <ProgressBar
          progressBarRef={progressBarRef}
          audioRef={audioRef}
          timeProgress={timeProgress}
        ></ProgressBar>
        <AudioPlayerControls
          audioRef={audioRef}
          progressBarRef={progressBarRef}
        ></AudioPlayerControls>
      </figure>
    </div>
  );
};

export default AudioPlayerMain;
