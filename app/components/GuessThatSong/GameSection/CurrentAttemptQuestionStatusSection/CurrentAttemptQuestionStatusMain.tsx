import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import CurrentAttemptQuestion from "./CurrentAttemptQuestion";
import { div } from "framer-motion/client";

const CurrentAttemptQuestionStatusMain = () => {
  const currentQuestion = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.currentQuestion
  );
  const attemptQuestions = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.questionsStatus
  );
  const currentAttemptQuestionStatusArr = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.questionsStatus
  );

  const currentGTSAttemptData = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData
  );

  const questionsStatusEls = attemptQuestions.map((question, number) => {
    return (
      <CurrentAttemptQuestion
        isCurrent={currentQuestion === number}
        isCompleted={question.getAnswer}
        answerIsCorrect={question?.answerIsCorrect && question?.artistAnswerIsCorrect}
        bonusTime={question.bonusTime}
        key={question._id}
      />
    );
  });

  useEffect(() => {
    const questionStatusContainer = document.querySelector(".questionStatusContainer");

    questionStatusContainer?.scrollTo({
      left: currentGTSAttemptData.currentQuestion * 40,
      behavior: "smooth",
    });
  });

  return (
    <div className="w-full rounded-sm py-1 px-3 border-b-2 border-zinc-300">
      <div className=" text-center">
        <h1 className=" text-2xl ">{currentGTSAttemptData.GTSGameName}</h1>
        <h1 className=" text-xl ">
          Вопрос
          <span> {currentQuestion + 1}</span> из <span>{attemptQuestions.length}</span>
        </h1>
      </div>

      <div className="questionStatusContainer my-3 px-5 overflow-hidden overflow-x-scroll flex justify-start items-start gap-3">
        {questionsStatusEls}
      </div>
    </div>
  );
};

export default CurrentAttemptQuestionStatusMain;
