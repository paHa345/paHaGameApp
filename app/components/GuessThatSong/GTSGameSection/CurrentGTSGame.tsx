import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AttemptRemainedTimer from "./AttemptRemainedTimer";
import DisplayCurrentTrack from "./DisplayCurrentTrack";
import SongStartStopButton from "./SongStartStopButton";
import AnswersModalMain from "./AnswersModalSection/AnswersModalMain";
import CurrentAttemptQuestionStatusMain from "../GameSection/CurrentAttemptQuestionStatusSection/CurrentAttemptQuestionStatusMain";
import GTSGameAudioVisualiser from "./AudioVisualiserSection/GTSGameAudioVisualiser";
import { IUserSlice } from "@/app/store/userSlice";
import GTSGameAnswer from "./AnswersModalSection/GTSGameAnswer";
import AnswerShowFirstStepMain from "./AnswerSection/AnswerMain";

const CurrentGTSGame = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const showFirstStepAnswerStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.showCurrentGameFirstStepAnswer
  );

  const currentGameShowAnswerStatus = useSelector(
    (state: IUserSlice) => state.userState.currentGameShowAnswerStatus
  );

  const gamesData = useSelector((state: IUserSlice) => state.userState.gamesData);

  const currentGTSAnswers = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.questionAnswers
  );

  const answersEls = currentGTSAnswers.map((answer, index) => {
    return (
      <div key={answer._id} className="w-full">
        <GTSGameAnswer id={answer._id} answerText={answer.text}></GTSGameAnswer>
      </div>
    );
  });
  return (
    <>
      <div className="flex justify-center items-center h-[100vh] flex-col ">
        {/* <AttemptQuestionStatusMain></AttemptQuestionStatusMain> */}
        {Boolean(currentGameShowAnswerStatus) === false && (
          <CurrentAttemptQuestionStatusMain></CurrentAttemptQuestionStatusMain>
        )}
        {/* <GTSGameAudioVisualiser audioRef={audioRef}></GTSGameAudioVisualiser> */}
        <DisplayCurrentTrack audioRef={audioRef}></DisplayCurrentTrack>

        {Boolean(currentGameShowAnswerStatus) === false && (
          <SongStartStopButton audioRef={audioRef}></SongStartStopButton>
        )}

        <div className=" flex flex-col w-full h-full justify-center items-center">
          {Boolean(currentGameShowAnswerStatus) === true && (
            <AnswerShowFirstStepMain audioRef={audioRef}></AnswerShowFirstStepMain>
          )}
        </div>

        {/* <div className=" basis-1/5"> */}
        <AttemptRemainedTimer></AttemptRemainedTimer>
        {/* </div> */}
        {Boolean(currentGameShowAnswerStatus) === false && <AnswersModalMain></AnswersModalMain>}
        {/* {Boolean(currentGameShowAnswerStatus) === true && <div>{answersEls} </div>} */}
      </div>
    </>
  );
};

export default CurrentGTSGame;
