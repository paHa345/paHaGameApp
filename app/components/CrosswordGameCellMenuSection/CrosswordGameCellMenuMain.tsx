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

  // const currentCrosswordGame = useSelector(
  //   (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame
  // );

  // const currentAttemptID = useSelector(
  //   (state: ICrosswordGameSlice) => state.crosswordGameState.attemptID
  // );

  // const currentCrosswordID = useSelector(
  //   (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame._id
  // );
  //   const currentCrosswordGame = useSelector(
  //     (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame.crosswordObj
  //   );

  //   const currentWord = useSelector(
  //     (state: ICrosswordGameSlice) => state.crosswordGameState.currentWord
  //   );
  //   console.log(currentWord);

  //   console.log(
  //     highlightedCell?.addedWordArr
  //       .filter((el) => el.direction === addedWordDirection)[0]
  //       .addedWordArr.map((el) => {
  //         console.log(currentCrosswordGame[el.row][el.col].addedWordLetter?.length);
  //         if (currentCrosswordGame[el.row][el.col].addedWordLetter?.length === undefined) {
  //           return " ";
  //         } else {
  //           return currentCrosswordGame[el.row][el.col].addedWordLetter;
  //         }
  //       })
  //       .join("")
  //   );

  // let currentValue: string[] | undefined = highlightedCell?.addedWordArr
  //   .filter((el) => el.direction === addedWordDirection)[0]
  //   .value?.split("");

  // const changeCurrentLetterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const index = e.currentTarget.dataset.number;
  //   if (index && currentValue) {
  //     if (e.currentTarget.dataset.number !== undefined && valueEl) {
  //       const currentCell = highlightedCell?.addedWordArr.filter(
  //         (el) => el.direction === addedWordDirection
  //       )[0].addedWordArr[Number(index)];

  //       dispatch(
  //         crossworGamedActions.changeInput({
  //           cell: currentCell,
  //           value: e.currentTarget.value.toLowerCase(),
  //         })
  //       );
  //       dispatch(crossworGamedActions.updateCellAndHaghlightedValue());
  //       // valueEl[Number(e.currentTarget.dataset.number) + 1]
  //       if (
  //         Number(index) + 1 < currentValue?.length &&
  //         e.currentTarget.value.toLowerCase().length > 0
  //       ) {
  //         console.log(document.querySelectorAll("input")[Number(index) + 1].focus());
  //       }

  //       //set crossword game
  //       //set crossword ID

  //       window.localStorage.setItem("currentCrosswordGame", JSON.stringify(currentCrosswordGame));
  //       window.localStorage.setItem("currentAttemptID", JSON.stringify(currentAttemptID));
  //       // window.localStorage.setItem("currentCrosswordID", JSON.stringify(currentCrosswordID));
  //     }
  //   }
  // };

  // const valueEl = highlightedCell?.addedWordArr
  //   .filter((el) => el.direction === addedWordDirection)[0]
  //   .addedWordArr.map((el, index) => {
  //     if (currentValue !== undefined) {
  //       let value = currentValue[index].trim().length === 0 ? "" : currentValue[index];
  //       return (
  //         <div
  //           className=" flex justify-center items-center border border-neutral-800 border-solid"
  //           key={`${index}_${el.col}_${el.row}`}
  //           data-number={index}
  //         >
  //           <input
  //             className={`${el.col}_${el.row} pl-2 h-6 w-4 sm:h-10 sm:w-8 text-2xl`}
  //             key={`${index}_${el.col}_${el.row}`}
  //             data-number={index}
  //             data-col={el.col}
  //             data-row={el.row}
  //             type="text"
  //             maxLength={1}
  //             value={value}
  //             onChange={changeCurrentLetterHandler}
  //           />
  //         </div>
  //       );
  //     }
  //   });

  const setAddedWordDirection = function (this: any, e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    dispatch(crossworGamedActions.changeAddedWordDirectionAndSetHighlightedCells(this));
    dispatch(crossworGamedActions.updateCellAndHaghlightedValue());
    const inputEl: HTMLInputElement | null = document.querySelector(".inputBase");

    if (inputEl !== null) {
      inputEl.focus();
    }
  };

  // .addedWordArr.map((el) => {
  //   console.log(currentCrosswordGame[el.row][el.col].addedWordLetter?.length);
  //   if (currentCrosswordGame[el.row][el.col].addedWordLetter?.length === 0) {
  //     return " ";
  //   } else {
  //     return currentCrosswordGame[el.row][el.col].addedWordLetter;
  //   }
  // })
  // .join("");

  //   useEffect(() => {
  //     dispatch(
  //       crossworGamedActions.setCurrentWord(
  //         highlightedCell?.addedWordArr
  //           .filter((el) => el.direction === addedWordDirection)[0]
  //           .addedWordArr.map((el) => {
  //             console.log(currentCrosswordGame[el.row][el.col].addedWordLetter?.length);
  //             if (currentCrosswordGame[el.row][el.col].addedWordLetter?.length === 0) {
  //               return " ";
  //             } else {
  //               return currentCrosswordGame[el.row][el.col].addedWordLetter;
  //             }
  //           })
  //           .join("")
  //       )
  //     );
  //   }, []);

  //   if (
  //     highlightedCell?.addedWordArr.filter((el) => el.direction === addedWordDirection)[0] !==
  //     undefined
  //   ) {
  //     highlightedCell?.addedWordArr.filter((el) => el.direction === addedWordDirection)[0].value;
  //   }

  // useEffect(() => {
  //   currentValue = highlightedCell?.addedWordArr
  //     .filter((el) => el.direction === addedWordDirection)[0]
  //     .value?.split("");
  // }, [addedWordDirection]);

  // const changeAddedWordValueHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   dispatch(crossworGamedActions.changeAddedWordValue(e.currentTarget.value));
  // };

  console.log(selectedCell);

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
      className=" relative z-10 mt-10 flex justify-center items-center  "
    >
      <div className="w-11/12 sm:w-5/6 lg:w-2/3  shadow-crosswordGameCellMenuShadow rounded-md  bg-gradient-to-tr from-secoundaryColor to-lime-100 p-1 fixed flex  ">
        <div className=" transition-all ease-in duration-200 delay-50  mt-5 h-6 cursor-pointer rounded-2xl fa-2x hover:scale-110 hover:shadow-crosswordGameCellMenuButtonActive  flex flex-col justify-center items-center">
          <FontAwesomeIcon
            // style={{ color: "red" }}
            onClick={hideCellMenu}
            className=" "
            icon={faCheckCircle}
          />
          {/* <a
            className=" fa-2x hover:bg-slate-400 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
            onClick={hideCellMenu}
            href=""
          >
          </a> */}
        </div>
        {/* <a
          className=" h-fit bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
          // onClick={addNumberTextAndHideModalHandler}
          href=""
        >
          <FontAwesomeIcon icon={faCheckCircle} />
        </a> */}
        <div className="rounded w-full flex flex-col justify-center items-center ml-2">
          <div className=" w-2/4 pb-2 flex gap-6 flex-row justify-around items-center">
            {selectedCell?.baseCell.horizontal !== null && (
              <div
                onClick={setAddedWordDirection.bind(AddedWordDirection.Horizontal)}
                className={` transition-all ease-in duration-200 delay-50  cursor-pointer h-12 w-12 flex justify-center items-center ${addedWordDirection === AddedWordDirection.Horizontal ? "  shadow-crosswordGameCellMenuButtonActive scale-110" : "shadow-crosswordGameCellMenuButton "} hover:shadow-crosswordGameCellMenuButtonActive hover:scale-110 bg-slate-200 px-2 py-1 rounded-full  `}
              >
                <a href="">
                  <FontAwesomeIcon icon={faRulerHorizontal} />
                </a>
              </div>
            )}
            {selectedCell?.baseCell.vertical !== null && (
              <div
                onClick={setAddedWordDirection.bind(AddedWordDirection.Vertical)}
                className={` transition-all ease-in duration-200 delay-50   cursor-pointer h-12 w-12 flex justify-center items-center ${addedWordDirection === AddedWordDirection.Vertical ? " shadow-crosswordGameCellMenuButtonActive  scale-110 " : "shadow-crosswordGameCellMenuButton "} hover:shadow-crosswordGameCellMenuButtonActive hover:scale-110  bg-slate-200 px-2 py-1 rounded-full `}
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
