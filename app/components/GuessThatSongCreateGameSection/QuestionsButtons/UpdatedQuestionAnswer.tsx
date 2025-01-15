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
  const [answer, setAnswer] = useState("");

  const changeAnswerHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.currentTarget.value);
    dispatch(
      GTSCreateGameActions.setCurrentQuestionAnswer({
        index: index,
        text: e.currentTarget.value,
      })
    );
    console.log(currentQuestion);
  };
  const currentCorrectAnswer = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.currentQuestion?.correctAnswerIndex
  );
  const currentQuestion = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.currentQuestion
  );

  const currentGTSGame = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGTSGame
  );
  const currentUpdatedQuestion = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.updatedQuestionNumber
  );

  if (
    currentGTSGame !== undefined &&
    currentUpdatedQuestion !== undefined &&
    currentGTSGame[currentUpdatedQuestion].answersArr !== undefined
  ) {
    console.log(currentGTSGame[currentUpdatedQuestion].answersArr[index]);
  }

  const setAnswerIsCorrect = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log(index);
    dispatch(GTSCreateGameActions.setCorrectAnswerIndex(index));
  };
  return (
    <div className=" py-3 flex justify-center items-center">
      <div onClick={setAnswerIsCorrect} className=" cursor-pointer hover:scale-110">
        {currentCorrectAnswer === index ? (
          <FontAwesomeIcon className=" pr-2" icon={faCircleCheck} />
        ) : (
          <FontAwesomeIcon className=" pr-2" icon={faCheck} />
        )}
      </div>

      <div
        className={` ${currentCorrectAnswer === index ? " bg-lime-200" : ""} px-3 border-2 border-solid rounded-md border-cyan-900`}
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
            onChange={changeAnswerHandler}
          />
        )}
      </div>
    </div>
  );
};

export default UpdatedQuestionAnswer;
