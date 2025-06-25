import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import GTSGameAnswer from "./GTSGameAnswer";
import ArtistAnswer from "./ArtistAnswer";
import { div } from "framer-motion/client";
import { IUserSlice } from "@/app/store/userSlice";

const AnswerMain = () => {
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

  const currentGTSAnswers = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.questionAnswers
  );

  const chosenArtistAnswerID = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.chosenArtistAnswerID
  );

  const currentGameType = useSelector((state: IUserSlice) => state.userState.currentGameType);
  const gamesData = useSelector((state: IUserSlice) => state.userState.gamesData);

  const answersEls = currentGTSAnswers.map((answer, index) => {
    return (
      <div key={answer._id} className="w-full">
        <GTSGameAnswer id={answer._id} answerText={answer.text}></GTSGameAnswer>
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
    <div>
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
              {gamesData && currentGameType && gamesData[currentGameType]?.textSecoundStep}
            </h1>
          </div>
          {artistAnswerEl}
        </div>
      ) : (
        <div>
          <div className=" w-full flex justify-center items-center flex-col gap-3 ">
            {" "}
            {answersEls}{" "}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerMain;
