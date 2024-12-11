import { AppDispatch } from "@/app/store";
import {
  ICrosswordGameSlice,
  setHighlightedElementAndDirection,
} from "@/app/store/crosswordGameSlice";
import { AddedWordDirection } from "@/app/store/crosswordSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface IQiestionProp {
  question: {
    direction: AddedWordDirection;
    value: string;
    questionNumber: number;
    cell: {
      row: number;
      col: number;
    };
  };
}
const CrosswordGameQuestion = ({ question }: IQiestionProp) => {
  const dispatch = useDispatch<AppDispatch>();
  const crosswordGameObj = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame.crosswordObj
  );
  const clickQuestionHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const element = document
      .querySelector(`[data-fieldid='${question.cell.row}:${question.cell.col}']`)
      ?.getClientRects()[0].y;
    if (element !== null && element) {
      scrollTo(0, window.scrollY + element - 250);
    }

    dispatch(
      setHighlightedElementAndDirection({
        selectedCell: {
          col: question.cell.col,
          row: question.cell.row,
        },
        highlightedCell: {
          col: question.cell.col,
          row: question.cell.row,
        },
        direction: question.direction,
      })
    );
  };
  return (
    <div
      onClick={clickQuestionHandler}
      className=" pb-3"
      key={`${question.value}_${question.cell.col}_${question.cell.row}_${question.direction}`}
    >
      <div className=" flex flex-row gap-4 text-xl">
        <h1> {question.questionNumber}</h1>
        <h1>{question.value}</h1>
      </div>
    </div>
  );
};

export default CrosswordGameQuestion;
