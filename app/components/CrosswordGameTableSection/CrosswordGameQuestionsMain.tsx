import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import { AddedWordDirection } from "@/app/store/crosswordSlice";
import React from "react";
import { useSelector } from "react-redux";
import CrosswordGameQuestion from "./CrosswordGameQuestion";

const CrosswordGameQuestionsMain = () => {
  const questions = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame.questionsArr
  );
  const directions = [
    { directionEn: "horizontal", directionRu: "По горизонтали" },
    { directionEn: "vertical", directionRu: "По вертикали" },
  ];
  const questionsEl = directions.map((el, index) => (
    <div
      className=" flex flex-col pb-4 pt-4 justify-center items-center"
      key={`${el.directionEn}_${index}`}
    >
      <h1 className=" text-2xl pb-4 ">{el.directionRu}</h1>
      <div>
        {el.directionEn === "horizontal"
          ? questions
              .filter(
                (question: {
                  direction: AddedWordDirection;
                  value: string;
                  questionNumber: number;
                  cell: {
                    row: number;
                    col: number;
                  };
                }) => question.direction === AddedWordDirection.Horizontal
              )
              .map((el, index) => {
                return <CrosswordGameQuestion key={el.value} question={el}></CrosswordGameQuestion>;
              })
          : questions
              .filter((question) => question.direction === AddedWordDirection.Vertical)
              .map((el, index) => {
                return <CrosswordGameQuestion key={el.value} question={el}></CrosswordGameQuestion>;
              })}
      </div>
    </div>
  ));
  return (
    <div className=" py-8">
      {questions.length > 0 && (
        <div>
          <h1 className=" text-2xl text-center">Вопросы</h1>
          <h1 className=" text-center">
            ( Нажмите на вопрос, чтобы показать соответствующее слово )
          </h1>

          {questionsEl}
        </div>
      )}
    </div>
  );
};

export default CrosswordGameQuestionsMain;
