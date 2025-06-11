import { IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import React from "react";
import { useSelector } from "react-redux";
import GTSAnswer from "./GTSAnswer";
import GTSSecoundAnswer from "./GTSSecoundAnswer";
import UploadImageMain from "../UploadImageSection/UploadImageMain";
import { div } from "framer-motion/client";

const AddSecoundStepQuestion = () => {
  const secoundStepQuestion = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.currentQuestion?.secoundStep
  );

  const secoundStepAnswerEls = secoundStepQuestion?.secoundStepAnswerArr ? (
    secoundStepQuestion.secoundStepAnswerArr.map((answer, index) => {
      return (
        <div key={`SecoundStepAnswer_${index}`}>
          {" "}
          <GTSSecoundAnswer index={index}></GTSSecoundAnswer>
        </div>
      );
    })
  ) : (
    <div></div>
  );

  return (
    <div>
      {secoundStepQuestion && (
        <div>
          <UploadImageMain></UploadImageMain>

          <h1 className=" text-center text-2xl">Варианты ответов 2 этап</h1>

          {/* <div className=" my-3 py-2 shadow-smallShadow">
        <h1 className=" text-center text-2xl">Количество вариантов ответов</h1>

        <div className=" py-3 flex justify-center items-center">
          <div
            onClick={setQuestionNumberHandler.bind(4)}
            className={` my-2 ${questionNumber === 4 ? "scale-110 shadow-crosswordGameCellMenuShadow border-2 border-solid border-lime-400" : ""}  border-2 border-solid  cursor-pointer py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
          >
            <h1>4</h1>
          </div>
          <div
            onClick={setQuestionNumberHandler.bind(6)}
            className={` my-2 ${questionNumber === 6 ? "scale-110 shadow-crosswordGameCellMenuShadow border-2 border-solid border-lime-400" : ""}  border-2 border-solid   cursor-pointer py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
          >
            <h1>6</h1>
          </div>
        </div>
      </div> */}

          <div className=" grid gap-2 justify-center items-center sm:grid-cols-2">
            {secoundStepAnswerEls}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSecoundStepQuestion;
