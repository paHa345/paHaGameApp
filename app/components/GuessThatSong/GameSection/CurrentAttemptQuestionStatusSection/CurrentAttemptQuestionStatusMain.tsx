import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React from "react";
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
  const questionsStatusEls = attemptQuestions.map((question, number) => {
    return (
      <CurrentAttemptQuestion
        isCurrent={currentQuestion === number}
        isCompleted={question.getAnswer}
        answerIsCorrect={question?.answerIsCorrect}
        key={question._id}
      />
    );
  });
  console.log(currentAttemptQuestionStatusArr);
  return (
    <div className="w-11/12">
      <div className=" text-center">
        <h1 className=" text-2xl">Вопросы</h1>
      </div>

      <div className=" px-5 py-5 overflow-hidden overflow-x-scroll flex justify-start items-start gap-3">
        {questionsStatusEls}
      </div>
    </div>
  );
};

export default CurrentAttemptQuestionStatusMain;
