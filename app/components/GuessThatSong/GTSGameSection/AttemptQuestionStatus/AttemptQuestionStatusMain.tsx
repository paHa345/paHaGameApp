import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React from "react";
import { useSelector } from "react-redux";
import QuestionStatus from "./QuestionStatus";

const AttemptQuestionStatusMain = () => {
  const attemptQuestions = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.questionsStatus
  );

  const currentQuestion = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.currentQuestion
  );

  const questionsStatusEls = attemptQuestions.map((question, number) => {
    return <QuestionStatus isCompleted={question.getAnswer} key={question._id} />;
  });

  return <div className=" flex justify-center items-center">{questionsStatusEls}</div>;
};

export default AttemptQuestionStatusMain;
