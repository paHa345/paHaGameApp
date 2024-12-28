import { AppDispatch } from "@/app/store";
import { crossworGamedActions, ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import { AddedWordDirection, crosswordActions } from "@/app/store/crosswordSlice";
import {
  faCheckCircle,
  faRulerHorizontal,
  faRulerVertical,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CrosswordGameCellMenuMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const addedWordDirection = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.addedWordDirection
  );

  const highlightedCell = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.highlightedCell
  );

  const selectedCell = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.selectedCell
  );

  const currentDirection = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.addedWordDirection
  );

  const isMobileBrowser = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.browserType
  );

  const currentCrosswordLength = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame.crosswordLength
  );

  const setAddedWordDirection = function (this: any, e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    dispatch(crossworGamedActions.changeAddedWordDirectionAndSetHighlightedCells(this));
    dispatch(crossworGamedActions.updateCellAndHaghlightedValue());
    const inputEl: HTMLInputElement | null = document.querySelector(".inputBase");

    if (inputEl !== null) {
      inputEl.focus();
    }
  };

  const hideCellMenu = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    dispatch(crossworGamedActions.setShowCrosswordGameCellMenu(false));
  };

  const currentQuestion =
    currentDirection === AddedWordDirection.Horizontal
      ? highlightedCell?.questionObj.horizontal?.value
      : highlightedCell?.questionObj.vertical?.value;

  return (
    <div
      style={{ left: "0px", top: `-80px` }}
      className=" relative  z-10 mt-10 flex justify-center items-center  "
    >
      <div className="w-11/12 sm:w-5/6 lg:w-2/3  shadow-crosswordGameCellMenuShadow rounded-md  bg-gradient-to-tr from-secoundaryColor to-lime-100 p-1 fixed flex  ">
        <div className=" transition-all ease-in duration-200 delay-50  mt-5 h-6 cursor-pointer rounded-2xl fa-2x hover:scale-110 hover:shadow-crosswordGameCellMenuButtonActive  flex flex-col justify-center items-center">
          <FontAwesomeIcon
            // style={{ color: "red" }}
            onClick={hideCellMenu}
            className=" "
            icon={faCheckCircle}
          />
        </div>

        <div className="rounded w-full flex flex-col justify-center items-center ml-2">
          <div className=" w-2/4 pb-2 flex gap-6 flex-row justify-around items-center">
            {selectedCell?.baseCell.horizontal !== null && (
              <div
                onClick={setAddedWordDirection.bind(AddedWordDirection.Horizontal)}
                className={` transition-all ease-in duration-200 delay-50  cursor-pointer h-12 w-12 flex justify-center items-center ${addedWordDirection === AddedWordDirection.Horizontal ? " border-solid border-y-2 border-slate-400  shadow-crosswordGameCellMenuButtonActive scale-110" : "shadow-crosswordGameCellMenuButton "} hover:shadow-crosswordGameCellMenuButtonActive hover:scale-110 bg-slate-200 px-2 py-1 rounded-full  `}
              >
                <a href="">
                  <FontAwesomeIcon icon={faRulerHorizontal} />
                </a>
              </div>
            )}
            {selectedCell?.baseCell.vertical !== null && (
              <div
                onClick={setAddedWordDirection.bind(AddedWordDirection.Vertical)}
                className={` transition-all ease-in duration-200 delay-50   cursor-pointer h-12 w-12 flex justify-center items-center ${addedWordDirection === AddedWordDirection.Vertical ? " border-solid border-x-2 border-slate-400 shadow-crosswordGameCellMenuButtonActive  scale-110 " : "shadow-crosswordGameCellMenuButton "} hover:shadow-crosswordGameCellMenuButtonActive hover:scale-110  bg-slate-200 px-2 py-1 rounded-full `}
              >
                <a
                  // className=" h-fit bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
                  href=""
                >
                  <FontAwesomeIcon icon={faRulerVertical} />
                </a>
              </div>
            )}
          </div>
          <div className=" bg-gradient-to-tl from-secoundaryColor to-lime-200 px-2 rounded shadow-cardButtonShadow">
            <h1 className=" pb-2 text-center text-xl">
              {/* <span className=" text-base">Вопрос: </span> */}
              {currentQuestion}
            </h1>
            {/* {currentValue !== undefined && (
              <div className=" flex justify-center items-center">
                <div className="flex flex-wrap flex-row gap-2">{valueEl}</div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrosswordGameCellMenuMain;
