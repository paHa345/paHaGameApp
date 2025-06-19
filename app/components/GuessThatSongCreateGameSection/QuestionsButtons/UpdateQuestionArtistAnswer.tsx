import { AppDispatch } from "@/app/store";
import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import { faCheck, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface IArtistAnswerProps {
  text: string;
  index: number;
  isCorrect: boolean;
}
const UpdateQuestionArtistAnswer = ({ text, index, isCorrect }: IArtistAnswerProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const currentUpdatedQuestion = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.updatedQuestionNumber
  );
  const updateSecoundStepAnswerIsCorrectHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(
      GTSCreateGameActions.updateSecoundStepCorrectVariant({
        updatedAnswer: currentUpdatedQuestion,
        correctAnswerIndex: index,
      })
    );
    // dispatch(
    //   GTSCreateGameActions.updateArtistCorrectVariant({
    //     updatedAnswer: currentUpdatedQuestion,
    //     correctAnswerIndex: index,
    //   })
    // );
  };
  const updateSecoundStepAnswerHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(
      GTSCreateGameActions.updateAnswerSecoundStepText({
        updatedAnswer: currentUpdatedQuestion,
        updatedArtistIndex: index,
        text: e.currentTarget.value,
      })
    );
  };

  return (
    <div className=" py-3 flex justify-center items-center">
      <div
        onClick={updateSecoundStepAnswerIsCorrectHandler}
        className=" cursor-pointer hover:scale-110"
      >
        {isCorrect ? (
          <FontAwesomeIcon className=" pr-2" icon={faCircleCheck} />
        ) : (
          <FontAwesomeIcon className=" pr-2" icon={faCheck} />
        )}
      </div>
      <div className=" flex gap-2">
        <div className=" px-3 border-2 border-solid rounded-md border-cyan-900">
          <input
            className=" w-full py-1"
            type="text"
            size={40}
            // defaultValue={"Введите название"}
            placeholder={`Введите ответ ${index + 1}`}
            value={text}
            onChange={updateSecoundStepAnswerHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateQuestionArtistAnswer;
