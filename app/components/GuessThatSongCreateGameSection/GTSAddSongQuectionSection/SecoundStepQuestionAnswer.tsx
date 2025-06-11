import React from "react";
import UploadImageMain from "../UploadImageSection/UploadImageMain";
import { useDispatch, useSelector } from "react-redux";
import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import { AppDispatch } from "@/app/store";
import AddSecoundStepQuestion from "./AddSecoundStepQuestion";

const SecoundStepQuestionAnswer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const addedGame = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.currentQuestion
  );

  const addDeleteSecoundStepHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!addedGame?.secoundStep) {
      dispatch(GTSCreateGameActions.addUpdateSecoundStepQuestionAnswer("add"));
    } else {
      console.log("Delete");
      dispatch(GTSCreateGameActions.deleteCurrentQuestionSecoundStepAnswer());
    }
    console.log(addedGame);
  };
  return (
    <div>
      <div className=" flex justify-center items-center">
        <div
          className={`  cursor-pointer py-3 my-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-${addedGame?.secoundStep ? "red" : "lime"}-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
          onClick={addDeleteSecoundStepHandler}
        >
          <h1> {addedGame?.secoundStep ? "Удалить" : "Добавить"} 2 этап для вопроса</h1>
        </div>
      </div>

      <AddSecoundStepQuestion></AddSecoundStepQuestion>
    </div>
  );
};

export default SecoundStepQuestionAnswer;
