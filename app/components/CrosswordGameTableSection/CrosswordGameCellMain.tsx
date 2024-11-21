import { AddedWordDirection } from "@/app/store/crosswordSlice";
import React from "react";

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
  return (
    <div
      //   onClick={callContextMenuHandler}
      data-fieldid={`${i}:${j}`}
      data-row={cell.row}
      data-number={cell.number}
      data-paragraph={cell.paragraph}
      data-paragraphnum={cell.paragraphNum}
      data-textquestionstatus={cell.textQuestionStatus}
      //   data-textquestionvalue={cell.textQuestionValue}
      data-addedwordcell={cell.addedWordCell}
      key={`${i}:${j}`}
      className={` ${cell.addedWordCell === Number(0) ? "" : "bg-lime-800"} 

  cursor-zoom-in   flex gap-1 items-center justify-center h-10 w-10 border-solid border-2 border-indigo-600`}
    ></div>
  );
};

export default CrosswordGameCellMain;
