import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import { faCross, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { div, h1 } from "framer-motion/client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import UpdateQuestion from "./UpdateQuestion";

interface IQuestionsButtonsProps {
  questionNumber: number;
}
const QuestionsButtons = ({ questionNumber }: IQuestionsButtonsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const questionISBeingUpdated = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.gameIsBeingUpdated
  );
  const updatedQuestionNumber = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.updatedQuestionNumber
  );

  const updateQuestionStatus = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.gameIsBeingUpdated
  );

  const updateQuestionHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(GTSCreateGameActions.setGameIsBeingUpdated(true));
    dispatch(GTSCreateGameActions.setUpdatedQuestionNumber(questionNumber));
  };
  const showDeleteQuestionModalHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(GTSCreateGameActions.setDeleteQuestionStatus(true));
  };
  return (
    <div className=" my-3 py-3 shadow-smallShadow rounded-md">
      <div className=" flex justify-center items-center flex-col">
        <div>
          <h1 className=" text-2xl">
            Вопрос <span>{questionNumber + 1}</span>{" "}
          </h1>
        </div>
        {updatedQuestionNumber !== questionNumber && !updateQuestionStatus && (
          <div className=" flex justify-center items-center gap-4 flex-col sm:flex-row py-2">
            <div
              onClick={updateQuestionHandler}
              className=" py-3 flex justify-center items-center gap-2 cursor-pointer w-full px-4 hover:scale-105 duration-200 rounded-lg ease-in hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow
"
            >
              <FontAwesomeIcon className=" pr-2" icon={faPencil} />
              <h1>Редактировать</h1>
            </div>
            <div
              onClick={showDeleteQuestionModalHandler}
              className=" py-3 flex justify-center items-center gap-2 cursor-pointer  px-4  hover:scale-105 duration-200 rounded-lg ease-in hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-red-400 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadowflex"
            >
              <FontAwesomeIcon className=" pr-2" icon={faTrash} />
              <h1>Удалить</h1>
            </div>
          </div>
        )}
        {questionISBeingUpdated && updatedQuestionNumber === questionNumber && (
          //   <UpdateQuestionMain></UpdateQuestionMain>
          <UpdateQuestion></UpdateQuestion>
        )}
      </div>
    </div>
  );
};

export default QuestionsButtons;
