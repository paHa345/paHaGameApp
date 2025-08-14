import { guessThatSongActions, IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import GTSGameAnswer from "../AnswersModalSection/GTSGameAnswer";
import { AppDispatch } from "@/app/store";
import Image from "next/image";
import { IUserSlice } from "@/app/store/userSlice";
import ArtistAnswer from "../AnswersModalSection/ArtistAnswer";
import AnswerStatus from "../AnswersModalSection/AnswerStatus";
import GTSGameAudioVisualiser from "../AudioVisualiserSection/GTSGameAudioVisualiser";

interface IAnswerMainProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}
const AnswerShowFirstStepMain = ({ audioRef }: IAnswerMainProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const imageURL = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.imageURL
  );

  const answerIsCorrect = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.answerIsCorrect
  );
  const artistAnswerIsCorrect = useSelector(
    (state: IGuessThatSongSlice) =>
      state.guessThatSongState.currentGTSAttemptData.artistAnswerIsCorrect
  );

  const answerStatus = useSelector(
    (state: IGuessThatSongSlice) =>
      state.guessThatSongState.currentGTSAttemptData.showIsCorrectStatus
  );
  const currentGTSAttemptData = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData
  );

  const artistAnswersArr = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.artistAnswerArr
  );

  // const currentGTSAnswers = useSelector(
  //   (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.questionAnswers
  // );

  const chosenArtistAnswerID = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.chosenArtistAnswerID
  );

  const currentGameType = useSelector((state: IUserSlice) => state.userState.currentGameType);
  const gamesData = useSelector((state: IUserSlice) => state.userState.gamesData);
  const songIsPlaying = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentAttemptSongIsPlaying
  );

  const abortController = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.abortController
  );

  const currentGTSAnswers = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.questionAnswers
  );

  const stopStartSongHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    // console.log(audioRef.current);
    if (songIsPlaying) {
      audioRef.current?.pause();
      dispatch(guessThatSongActions.setCurrentAttemptSongIsPlaying(false));

      abortController?.abort();
      dispatch(guessThatSongActions.setAbortController(undefined));
      console.log("Stop song");
      dispatch(guessThatSongActions.setShowGTSAnswersModal(true));
      dispatch(guessThatSongActions.setStopAnswerTimerController(new AbortController()));
    } else {
      audioRef.current?.play();
      if (!abortController) {
        dispatch(guessThatSongActions.setAbortController(new AbortController()));
      }
      dispatch(guessThatSongActions.setCurrentAttemptSongIsPlaying(true));
    }
  };

  const answersEls = currentGTSAnswers.map((answer, index) => {
    return (
      <div key={answer._id} className="w-full">
        <div className=" px-3 py-2" onClick={stopStartSongHandler}>
          <GTSGameAnswer id={answer._id} answerText={answer.text}></GTSGameAnswer>
        </div>
      </div>
    );
  });

  const artistAnswerEl = artistAnswersArr.map((answer, index) => {
    return (
      <div key={answer._id} className="w-full">
        {(!answerStatus?.artist || chosenArtistAnswerID === answer._id) && (
          <ArtistAnswer
            isCorrect={artistAnswerIsCorrect}
            artistAnswerIsChosen={chosenArtistAnswerID === answer._id}
            text={answer.text}
            artistAnswerID={answer._id}
          ></ArtistAnswer>
        )}
      </div>
    );
  });
  return (
    <>
      <AnswerStatus></AnswerStatus>

      {imageURL ? (
        <div className=" flex justify-center items-center flex-col gap-3">
          <div className=" h-[20vh]  w-full flex justify-center items-center ">
            <Image
              width="0"
              height="0"
              sizes="100vw"
              className="w-auto h-full rounded-md"
              src={imageURL}
              alt="Трек"
            />
          </div>
          <div
            className={` cursor-pointer py-2 w-full bg-gradient-to-tr rounded-lg from-secoundaryColor ${answerIsCorrect ? "to-green-200" : "to-red-200"}  shadow-audioControlsButtonShadow hover:shadow-audioControlsButtonHoverShadow `}
          >
            <h1 className=" text-2xl text-center">
              {
                currentGTSAttemptData.questionsStatus[currentGTSAttemptData.currentQuestion]
                  ?.userAnswerSongName
              }
            </h1>
          </div>
          <div>
            <h1 className="text-2xl">
              {gamesData &&
                currentGameType &&
                Object.values(gamesData).find((el) => {
                  return el.gameType === currentGameType;
                })?.textSecoundStep}
            </h1>
          </div>
          {artistAnswerEl}
        </div>
      ) : (
        <div className=" flex justify-center items-center flex-col relative w-full h-full ">
          <div className=" z-10 rounded-xl">
            <GTSGameAudioVisualiser audioRef={audioRef}></GTSGameAudioVisualiser>
          </div>
          <div className=" z-20">{answersEls}</div>
        </div>
      )}
    </>
  );
};

export default AnswerShowFirstStepMain;
