import { AppDispatch } from "@/app/store";
import {
  crossworGamedActions,
  ICrosswordGameSlice,
  setHighlightedElementAndDirection,
} from "@/app/store/crosswordGameSlice";
import { AddedWordDirection, crosswordActions } from "@/app/store/crosswordSlice";
import React, { MutableRefObject, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ICellProps {
  ref: MutableRefObject<HTMLInputElement>;
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
    addedWordDirectionJbj?: {
      horizontal: Boolean;
      vertical: Boolean;
    };
    baseCell: {
      horizontal?: { row: number; col: number } | null;
      vertical?: { row: number; col: number } | null;
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
const CrosswordGameCellMain = ({ ref, cell, i, j }: ICellProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const selectedCell = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.selectedCell
  );
  const highlightedObj = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.highlightedWordObj
  );
  const direction = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.addedWordDirection
  );

  const crosswordGameObj = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame.crosswordObj
  );
  //   console.log(direction);

  const isSelectedCell =
    selectedCell?.number === cell.number && selectedCell.row === cell.row ? true : false;

  const clickCellNumberHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    // dispatch(crossworGamedActions.setSelectedAndHighLightedCell(cell));

    const el = ref.current;
    if (el) {
      setTimeout(() => el.focus(), 0);
    }

    if (cell.addedWordCell === 0) {
      return;
    }
    console.log(cell);
    if (
      direction === AddedWordDirection.Vertical &&
      (cell.baseCell.horizontal || cell.baseCell.vertical) &&
      cell.baseCell.vertical
    ) {
      dispatch(
        setHighlightedElementAndDirection({
          selectedCell: {
            col: cell.number,
            row: cell.row,
          },
          highlightedCell: {
            col: cell.baseCell.vertical?.col,
            row: cell.baseCell.vertical?.row,
          },
          direction: AddedWordDirection.Vertical,
        })
      );
      return;
    }
    if (cell.baseCell.horizontal) {
      dispatch(
        setHighlightedElementAndDirection({
          selectedCell: {
            col: cell.number,
            row: cell.row,
          },
          highlightedCell: {
            col: cell.baseCell.horizontal?.col,
            row: cell.baseCell.horizontal?.row,
          },
          direction: AddedWordDirection.Horizontal,
        })
      );
    } else {
      if (cell.baseCell.vertical && direction === AddedWordDirection.Horizontal) {
        dispatch(
          setHighlightedElementAndDirection({
            selectedCell: {
              col: cell.number,
              row: cell.row,
            },
            highlightedCell: {
              col: cell.baseCell.vertical?.col,
              row: cell.baseCell.vertical?.row,
            },
            direction: AddedWordDirection.Vertical,
          })
        );
      }
    }

    // console.log(selectedCell?.baseCell.horizontal);
    // console.log(selectedCell?.baseCell.vertical);
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
  const hasNumber = cell?.paragraphNum !== undefined && cell?.paragraphNum !== 0;

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
      // style={{ backgroundColor: `${isHighlightedWord ? "rgb(101 163 13)" : ""}` }}
      style={{
        backgroundColor: `${isHighlightedWord ? (isSelectedCell ? " #cbc512" : "#5e7d33") : ""}`,
      }}
      className={`${isHighlightedWord ? "" : ""} ${!hasLetter ? "" : "bg-lime-500"} ${isSelectedCell ? "animate-pulse" : ""} transition duration-800 ease-out  cursor-zoom-in   flex gap-1 items-center justify-center h-10 w-10 border-solid border-2 border-indigo-600`}
    >
      {hasNumber && (
        <div className="absolute">
          <p style={{ right: "10px", bottom: "6px" }} className=" relative text-2xl font-extrabold">
            {cell.inputValue}
          </p>{" "}
        </div>
      )}

      {/* {hasLetter && <input className=" h-4 w-4" type="text" maxLength={1} />} */}
      {hasAddedWord && (
        <div className="absolute">
          <p
            style={{ right: "-5px", bottom: "0px" }}
            className={`relative ${isSelectedCell ? " text-slate-900" : "text-slate-50"}   text-3xl font-extrabold`}
          >
            {cell.addedWordLetter}
          </p>
          {/* <input
            ref={ref}
            style={{ right: "-5px", bottom: "0px" }}
            className=" absolute h-6 w-6 text-slate-50 text-3xl font-extrabold"
            type="text"
            maxLength={1}
            value={cell?.addedWordLetter ? cell.addedWordLetter : ""}
            onChange={changeCurrentLetterHandler}
          /> */}
        </div>
      )}

      {/* {highlightedObj !== null &&
        cell.row >= highlightedObj?.startRow &&
        cell.row <= highlightedObj?.endRow &&
        cell.number >= highlightedObj?.startCol &&
        cell.number <= highlightedObj?.endCol && <p className=" w-full">22</p>} */}
    </div>
  );
};

export default CrosswordGameCellMain;
