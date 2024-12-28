import { AddedWordDirection, ICrosswordSlice } from "@/app/store/crosswordSlice";
import React from "react";
import { useSelector } from "react-redux";

const CreateCrosswordQuestionsSectionMain = () => {
  const directions = [
    { directionEn: "horizontal", directionRu: "По горизонтали" },
    { directionEn: "vertical", directionRu: "По вертикали" },
  ];
  const questions = useSelector((state: ICrosswordSlice) => state.crosswordState.questionsArr);

  const questionsEl = directions.map((el, index) => (
    <div
      className=" flex flex-col pb-4 pt-4 justify-center items-center"
      key={`${el.directionEn}_${index}`}
    >
      <h1 className=" text-2xl pb-4 ">{el.directionRu}</h1>
      <div>
        {el.directionEn === "horizontal"
          ? questions
              .filter((question) => question.direction === AddedWordDirection.Horizontal)
              .map((el, index) => {
                return (
                  <div className=" pb-3" key={`${el.value}_${index}`}>
                    <div className=" flex flex-row gap-4 text-xl">
                      <h1> {el.questionNumber}</h1>
                      <h1>{el.value}</h1>
                    </div>
                  </div>
                );
              })
          : questions
              .filter((question) => question.direction === AddedWordDirection.Vertical)
              .map((el, index) => {
                return (
                  <div key={`${el.value}_${index}`}>
                    <div className=" flex flex-row gap-4 text-xl">
                      <h1> {el.questionNumber}</h1>
                      <h1>{el.value}</h1>
                    </div>
                  </div>
                );
              })}
      </div>
    </div>
  ));
  return (
    <div className=" pb-8">
      {questions.length > 0 && (
        <div>
          <h1 className=" text-2xl text-center">Вопросы</h1>

          {questionsEl}
        </div>
      )}
    </div>
  );
};

export default CreateCrosswordQuestionsSectionMain;
