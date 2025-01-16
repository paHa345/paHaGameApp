import { AppDispatch } from "@/app/store";
import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import { faCheck, faCheckCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { div } from "framer-motion/client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface IGTSAnswerProps {
  index: number;
}
const UpdatedQuestionAnswer = ({ index }: IGTSAnswerProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const currentQuestion = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.currentQuestion
  );

  const currentGTSGame = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGTSGame
  );
  const currentUpdatedQuestion = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.updatedQuestionNumber
  );

  const updateAnswerHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.value);
    if (currentUpdatedQuestion !== undefined) {
      dispatch(
        GTSCreateGameActions.updateAnswerText({
          updatedAnswer: currentUpdatedQuestion,
          text: e.currentTarget.value,
          index: index,
        })
      );
    }
  };

  const updateAnswerIsCorrectHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(
      GTSCreateGameActions.updateCorrectAnswerNumber({
        updatedAnswer: currentUpdatedQuestion,
        correctAnswerIndex: index,
      })
    );
  };

  return (
    <div className=" py-3 flex justify-center items-center">
      <div onClick={updateAnswerIsCorrectHandler} className=" cursor-pointer hover:scale-110">
        {currentUpdatedQuestion !== undefined &&
        currentGTSGame[currentUpdatedQuestion].correctAnswerIndex === index ? (
          <FontAwesomeIcon className=" pr-2" icon={faCircleCheck} />
        ) : (
          <FontAwesomeIcon className=" pr-2" icon={faCheck} />
        )}
      </div>

      <div
        className={` ${
          currentUpdatedQuestion !== undefined &&
          currentGTSGame[currentUpdatedQuestion].correctAnswerIndex === index
            ? " bg-lime-200"
            : ""
        } px-3 border-2 border-solid rounded-md border-cyan-900`}
      >
        {currentQuestion?.answersArr && (
          <input
            className=" w-full py-1"
            type="text"
            size={40}
            // defaultValue={"Введите название"}
            placeholder={`Введите ответ ${index + 1}`}
            value={
              currentGTSGame !== undefined &&
              currentUpdatedQuestion !== undefined &&
              currentGTSGame[currentUpdatedQuestion].answersArr !== undefined
                ? currentGTSGame[currentUpdatedQuestion].answersArr[index].text
                : ""
            }
            onChange={updateAnswerHandler}
          />
        )}
      </div>
    </div>
  );
};

export default UpdatedQuestionAnswer;
