import { AppDispatch } from "@/app/store";
import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import { faCheck, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface IGTSSecoundAnswerProps {
  index: number;
}
const GTSSecoundAnswer = ({ index }: IGTSSecoundAnswerProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const currentCorrectAnswer = useSelector(
    (state: IGTSCreateGameSlice) =>
      state.GTSCreateGameState.currentQuestion?.secoundStep?.correctAnswerIndex
  );
  const currentQuestion = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.currentQuestion
  );

  const setSecoundAnswerIsCorrectHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    dispatch(GTSCreateGameActions.setSecoundStepCorrectAnswerIndex(index));
  };

  const changeSecoundStepAnswerHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      GTSCreateGameActions.setCurrentQuestionSecoundStepAnswer({
        text: e.currentTarget.value,
        index: index,
        isCorrect: currentQuestion?.secoundStep?.secoundStepAnswerArr[index].isCorrect,
      })
    );
    console.log(currentQuestion);
  };

  return (
    <div className=" py-3 flex justify-center items-center">
      <div onClick={setSecoundAnswerIsCorrectHandler} className=" cursor-pointer hover:scale-110">
        {currentCorrectAnswer === index ? (
          <FontAwesomeIcon className=" pr-2" icon={faCircleCheck} />
        ) : (
          <FontAwesomeIcon className=" pr-2" icon={faCheck} />
        )}
      </div>

      <div
        className={` ${currentCorrectAnswer === index ? " bg-lime-200" : ""} px-3 border-2 border-solid rounded-md border-cyan-900`}
      >
        {currentQuestion?.secoundStep?.secoundStepAnswerArr && (
          <input
            className=" w-full py-1"
            type="text"
            size={40}
            // defaultValue={"Введите название"}
            placeholder={`Введите ответ ${index + 1}`}
            value={currentQuestion?.secoundStep.secoundStepAnswerArr[index].text}
            onChange={changeSecoundStepAnswerHandler}
          />
        )}
      </div>
    </div>
  );
};

export default GTSSecoundAnswer;
