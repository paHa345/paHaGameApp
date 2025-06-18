import { AppDispatch } from "@/app/store";
import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import { faDeleteLeft, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { div } from "framer-motion/client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const AddArtistToAnswerMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const currentUpdatedQuestionIndex = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.updatedQuestionNumber
  );

  const updatedQuestion = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGTSGame
  );
  console.log(updatedQuestion);
  const addArtistListHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    //addArtistListHandler logic here
    console.log(currentUpdatedQuestionIndex);
    if (currentUpdatedQuestionIndex === undefined) {
      return;
    }
    dispatch(GTSCreateGameActions.addUpdateSecoundStepQuestionAnswer(currentUpdatedQuestionIndex));
    // if (currentUpdatedQuestionIndex !== undefined) {
    //   dispatch(
    //     GTSCreateGameActions.addUpdateSecoundStepQuestionAnswer(currentUpdatedQuestionIndex)
    //   );
    // }
  };

  const deleteSecoundStepModalHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    dispatch(GTSCreateGameActions.setDeleteEditedQuestionSecoundStapModalStatus(true));
  };

  return (
    <div className=" flex justify-center items-center">
      <div className="py-5 flex justify-center items-center">
        {currentUpdatedQuestionIndex !== undefined &&
          updatedQuestion[currentUpdatedQuestionIndex] &&
          updatedQuestion[currentUpdatedQuestionIndex].secoundStep?.correctAnswerIndex !==
            undefined && (
            <div
              className={` w-3/5 text-center cursor-pointer py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-red-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
              onClick={deleteSecoundStepModalHandler}
            >
              <FontAwesomeIcon className=" pr-2" icon={faXmark} />
              Удалить 2 этап вопроса
            </div>
          )}

        {currentUpdatedQuestionIndex !== undefined &&
          updatedQuestion[currentUpdatedQuestionIndex] &&
          updatedQuestion[currentUpdatedQuestionIndex].secoundStep?.correctAnswerIndex ===
            undefined && (
            <div
              className={` w-3/5 text-center cursor-pointer py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
              onClick={addArtistListHandler}
            >
              <FontAwesomeIcon className=" pr-2" icon={faPlus} />
              Добавить 2 этап вопроса
            </div>
          )}
      </div>
    </div>
  );
};

export default AddArtistToAnswerMain;
