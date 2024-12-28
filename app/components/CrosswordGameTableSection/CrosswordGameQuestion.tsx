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

  const highlightedCell = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.highlightedCell
  );

  const direction = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.addedWordDirection
  );

  const clickQuestionHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    // const element = document
    //   .querySelector(`[data-fieldid='${question.cell.row}:${question.cell.col}']`)
    //   ?.getClientRects()[0].y;
    // if (element !== null && element) {
    //   setTimeout(() => {
    //     scrollTo({ left: 0, top: window.scrollY + element - 250, behavior: "smooth" });
    //   }, 500);
    // }

    const elementY = document
      .querySelector(`[data-fieldid='${question.cell.row}:${question.cell.col}']`)
      ?.getClientRects()[0].y;

    const elementX = document
      .querySelector(`[data-fieldid='${question.cell.row}:${question.cell.col}']`)
      ?.getClientRects()[0].x;

    const crosswordTable = document.querySelector(".crosswordTableMain");
    if (elementY !== null && elementY && elementX) {
      setTimeout(() => {
        scrollTo({ left: 0, top: window.scrollY + elementY - 250, behavior: "smooth" });
        crosswordTable?.scrollTo({
          left: elementX - 160 + crosswordTable?.scrollLeft,
          behavior: "smooth",
        });
      }, 500);
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

    const inputEl: HTMLInputElement | null = document.querySelector(".inputBase");

    if (inputEl !== null) {
      inputEl.focus();
    }
  };
  const isHighlighted =
    highlightedCell?.row === question.cell.row &&
    highlightedCell.number === question.cell.col &&
    question.direction === direction;
  return (
    <div
      onClick={clickQuestionHandler}
      className={` ${isHighlighted ? "bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-crosswordGameCellMenuButton rounded-md px-1 py-1" : ""} cursor-pointer pb-3`}
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
