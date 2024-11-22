import { AppDispatch } from "@/app/store";
import {
  crossworGamedActions,
  ICrosswordGameSlice,
  setHighlightedElementAndDirection,
} from "@/app/store/crosswordGameSlice";
import { AddedWordDirection } from "@/app/store/crosswordSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ICellProps {
  cell: {
    key: string;
    value: string;
    number: number;
    row: number;
    paragraph: number;
    paragraphNum?: number;
    inputStatus: number;
    inputValue: number;
    textQuestionStatus: number;
    questionObj: {
      horizontal: {
        value: string;
        questionNumber: number;
        cell: {
          row: number;
          col: number;
        };
      } | null;
      vertical: {
        value: string;
        questionNumber: number;
        cell: {
          row: number;
          col: number;
        };
      } | null;
    };
    addedWordCell: number;
    addedWordLetter?: string | null;
    addedWordDirectionJbj: {
      horizontal: Boolean;
      vertical: Boolean;
    };
    addedWordArr: {
      direction: AddedWordDirection;
      value?: string;
      addedWordArr: {
        row: number;
        col: number;
        addedLetter?: string;
      }[];
    }[];
  };
  i: number;
  j: number;
}
const CrosswordGameCellMain = ({ cell, i, j }: ICellProps) => {
  const dispatch = useDispatch<AppDispatch>();

  //   const contextMenuHandler = (e: React.MouseEvent<HTMLDivElement>) => {
  const callContextMenuHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log(cell.paragraphNum);
  };

  const [value, setValue] = useState("");

  const changeCellInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // dispatch(crosswordActions.setInputToCell(parseInt(e.target.value)));
  };

  const highlightedCell = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.highlightedCell
  );
  const highlightedObj = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.highlightedWordObj
  );
  const direction = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.addedWordDirection
  );
  //   console.log(direction);

  const clickCellNumberHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(cell);
    if (!cell.questionObj) {
      return;
    }
    dispatch(setHighlightedElementAndDirection(cell));
    // console.log(cell);
    console.log(highlightedCell);
  };

  const isHighlightedWord =
    highlightedObj !== null &&
    cell.row >= highlightedObj?.startRow &&
    cell.row <= highlightedObj?.endRow &&
    cell.number >= highlightedObj?.startCol &&
    cell.number <= highlightedObj?.endCol
      ? true
      : false;

  const hasLetter = cell.addedWordCell === Number(1);
  const hasAddedWord = cell.addedWordLetter;
  return (
    <div
      onClick={clickCellNumberHandler}
      data-fieldid={`${i}:${j}`}
      data-row={cell.row}
      data-number={cell.number}
      data-paragraph={cell.paragraph}
      data-paragraphnum={cell.paragraphNum}
      data-textquestionstatus={cell.textQuestionStatus}
      //   data-textquestionvalue={cell.textQuestionValue}
      data-addedwordcell={cell.addedWordCell}
      key={`${i}:${j}`}
      className={` ${isHighlightedWord ? "bg-gray-400" : ""} ${!hasLetter ? "bg-headerFooterMainColor" : ""} cursor-zoom-in   flex gap-1 items-center justify-center h-10 w-10 border-solid border-2 border-indigo-600`}
    >
      {cell.paragraphNum && <p className=" w-full">{cell.inputValue}</p>}
      {/* {hasLetter && <input className=" h-4 w-4" type="text" maxLength={1} />} */}
      {hasAddedWord && <p>{cell.addedWordLetter}</p>}

      {/* {highlightedObj !== null &&
        cell.row >= highlightedObj?.startRow &&
        cell.row <= highlightedObj?.endRow &&
        cell.number >= highlightedObj?.startCol &&
        cell.number <= highlightedObj?.endCol && <p className=" w-full">22</p>} */}
    </div>
  );
};

export default CrosswordGameCellMain;
