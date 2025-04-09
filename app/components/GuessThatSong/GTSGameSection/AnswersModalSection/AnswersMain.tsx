import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import GTSGameAnswer from "./GTSGameAnswer";
import ArtistAnswer from "./ArtistAnswer";

const AnswerMain = () => {
  const imageURL = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.imageURL
  );

  const answerIsCorrect = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.answerIsCorrect
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
        <ArtistAnswer text={answer.text} artistAnswerID={answer._id}></ArtistAnswer>
      </div>
    );
  });

  console.log(answerIsCorrect);

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
            <h1 className="text-2xl">Угадайте исполнителя</h1>
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
