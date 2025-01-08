"use client";
import { PutBlobResult } from "@vercel/blob";
import React, { useRef, useState } from "react";
import AudioPlayerMain from "../AudioPlayer/AudioPlayerMain";
import GTSCurrentGameCondition from "../CurrentGameConditionSection/GTSCurrentGameCondition";

const GameSeactionMain = () => {
  return (
    <div>
      <h1 className=" text-3xl pt-7 text-center">Угадай мелодию</h1>

      <GTSCurrentGameCondition></GTSCurrentGameCondition>

      <AudioPlayerMain></AudioPlayerMain>
    </div>
  );
};

export default GameSeactionMain;
