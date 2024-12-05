import { AddedWordDirection, crosswordActions, ICrosswordSlice } from "@/app/store/crosswordSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/index";

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
    // textQuestionValue: string;
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
    addedWordLetter: string | null;
    addedWordDirectionJbj: {
      horizontal: Boolean;
      vertical: Boolean;
    };
    baseCell: {
      horizontal?: { row: number; col: number } | null;
      vertical?: { row: number; col: number } | null;
    };
    addedWordArr: {
      direction: AddedWordDirection;
      value: string;
      addedWordArr: {
        row: number;
        col: number;
        addedLetter: string;
      }[];
    }[];
  };
  i: number;
  j: number;
}

const CreateCrosswordCellMain = ({ cell, i, j }: ICellProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const showAddElementMenu = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.setElementsModalStatus
  );

  const setTextModalStatus = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.setTextModalStatus
  );

  const highlightedElId = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.highlightedField
  );

  const callContextMenuHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log(cell);
    const target: any = e.target;
    console.log(target.nodeName);
    if (showAddElementMenu || setTextModalStatus) {
      return;
    }

    if (target.nodeName !== "DIV" && target.nodeName !== "P") {
      return;
    }

    // console.log(e.currentTarget.dataset.paragraphnum);
    const paragraphNum = dispatch(
      crosswordActions.setHighlightedField({
        id: `${i}:${j}`,
        row: cell.row,
        number: cell.number,
        cellCoordinates: {
          x: e.currentTarget.getBoundingClientRect().x,
          y: e.currentTarget.getBoundingClientRect().y,
        },
        paragraphNum: cell.paragraphNum === undefined ? 0 : Number(cell.paragraphNum),
        setParagraph: Number(cell.paragraph),
        textQuestionStatus: Number(cell.textQuestionStatus),
        // textQuestionValue: cell.textQuestionValue,
      })
    );
    // dispatch(crosswordActions.setQuestionValue(cell.textQuestionValue));

    dispatch(
      crosswordActions.setCreateContextMenuPosition({
        x: e.pageX,
        y: e.pageY,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      })
    );
    dispatch(crosswordActions.setCreateContextMenuStatusTrue());
  };

  const changeCellInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cellContainerEl = e.currentTarget.closest(".bg-lime-600") as HTMLElement;
    if (
      cellContainerEl !== null &&
      cellContainerEl.dataset?.row &&
      cellContainerEl.dataset?.number
    ) {
      dispatch(
        crosswordActions.changeCellInputValue({
          value: e.target.value,
          fieldPosition: {
            row: cellContainerEl.dataset?.row,
            col: cellContainerEl.dataset?.number,
          },
        })
      );
    }
  };

  return (
    <div
      onClick={callContextMenuHandler}
      data-fieldid={`${i}:${j}`}
      data-row={cell.row}
      data-number={cell.number}
      data-paragraph={cell.paragraph}
      data-paragraphnum={cell.paragraphNum}
      data-textquestionstatus={cell.textQuestionStatus}
      //   data-textquestionvalue={cell.textQuestionValue}
      data-addedwordcell={cell.addedWordCell}
      key={`${i}:${j}`}
      className={` ${cell.addedWordCell === Number(0) ? "" : "bg-lime-800"} ${highlightedElId.id === `${i}:${j}` ? " bg-lime-600" : ""} cursor-zoom-in   flex gap-1 items-center justify-center h-10 w-10 border-solid border-2 border-indigo-600`}
    >
      <div className=" relative z-10">
        {cell.paragraph !== 0 && (
          <p className=" text-slate-100 absolute -top-5 -left-1">{cell?.paragraphNum}</p>
        )}
      </div>
      {cell.addedWordLetter && <p className=" text-slate-200">{cell.addedWordLetter}</p>}
      {cell.inputStatus !== 0 && (
        <input
          onChange={changeCellInputHandler}
          className=" w-full"
          type="number"
          value={cell.inputValue}
        />
      )}
    </div>
  );
};

export default CreateCrosswordCellMain;
