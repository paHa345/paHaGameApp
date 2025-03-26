"use client";
import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React, { useEffect } from "react";
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
    return (
      <QuestionStatus
        isCurrent={currentQuestion === number}
        isCompleted={question.getAnswer}
        key={question._id}
        bonusTime={question.bonusTime}
      />
    );
  });

  //   useEffect(() => {
  //     scrollTo({ left: -150, top: 0, behavior: "smooth" });
  //   });

  return (
    <div className=" px-5 py-5 w-11/12 overflow-hidden overflow-x-scroll flex justify-start items-start gap-3">
      {questionsStatusEls}
    </div>
  );
};

export default AttemptQuestionStatusMain;
