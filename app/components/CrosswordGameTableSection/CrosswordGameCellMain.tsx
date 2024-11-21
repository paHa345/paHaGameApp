import { AppDispatch } from "@/app/store";
import { crossworGamedActions, ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
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
    //   addedWordLetter: string | null;
    addedWordDirectionJbj: {
      horizontal: Boolean;
      vertical: Boolean;
    };
    addedWordArr: {
      direction: AddedWordDirection;
      // value: string;
      addedWordArr: {
        row: number;
        col: number;
        //   addedLetter: string;
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
  const direction = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.addedWordDirection
  );

  const clickCellNumberHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cell.questionObj) {
      return;
    }
    console.log(cell.questionObj?.horizontal?.value);
    console.log(cell.questionObj?.vertical?.value);
    dispatch(crossworGamedActions.setHighlightedCell(cell));
    if (cell.questionObj.horizontal?.value) {
      dispatch(crossworGamedActions.changeAddedWordDirection(AddedWordDirection.Horizontal));
    } else {
      dispatch(crossworGamedActions.changeAddedWordDirection(AddedWordDirection.Vertical));
    }
    dispatch(crossworGamedActions.setShowCrosswordGameCellMenu(true));
    // console.log(cell.addedWordArr.filter((el) => el.direction === direction));
    // console.log(direction);
  };
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
      className={` ${cell.addedWordCell === Number(0) ? "bg-headerFooterMainColor" : ""} cursor-zoom-in   flex gap-1 items-center justify-center h-10 w-10 border-solid border-2 border-indigo-600`}
    >
      {cell.paragraphNum && <p className=" w-full">{cell.inputValue}</p>}
    </div>
  );
};

export default CrosswordGameCellMain;
