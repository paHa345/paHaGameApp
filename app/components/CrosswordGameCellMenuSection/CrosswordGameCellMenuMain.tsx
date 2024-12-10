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

  const [activeTab, setActiveTab] = useState(2);

  const addedWordDirection = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.addedWordDirection
  );

  const highlightedCell = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.highlightedCell
  );

  const currentDirection = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.addedWordDirection
  );

  const currentCrosswordGame = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame
  );

  const currentAttemptID = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.attemptID
  );

  const currentCrosswordID = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame._id
  );
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

  const changeAddedWordValueHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(crossworGamedActions.changeAddedWordValue(e.currentTarget.value));
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
      style={{ top: `-50px` }}
      className=" relative z-10 mt-10 flex justify-center items-center  "
    >
      <div className="w-11/12 sm:w-5/6 lg:w-2/3  rounded-md  bg-lime-50 p-1 fixed flex  border-slate-400 border-solid border-2 ">
        <div className=" flex flex-col justify-center items-center">
          <FontAwesomeIcon
            // style={{ color: "red" }}
            onClick={hideCellMenu}
            className=" cursor-pointer fa-2x hover:text-slate-200  hover:bg-lime-800 rounded-full  hover:border-lime-800 border-solid border-2  border-slate-200"
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
          <div className=" flex gap-6 flex-row justify-center items-center">
            {highlightedCell?.questionObj.horizontal?.value && (
              <div
                onClick={setAddedWordDirection.bind(AddedWordDirection.Horizontal)}
                className={`h-12 w-12 flex justify-center items-center bg ${addedWordDirection === AddedWordDirection.Horizontal ? "bg-slate-400" : ""} hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200`}
              >
                <a href="">
                  <FontAwesomeIcon icon={faRulerHorizontal} />
                </a>
              </div>
            )}
            {highlightedCell?.questionObj.vertical?.value && (
              <div
                onClick={setAddedWordDirection.bind(AddedWordDirection.Vertical)}
                className={`h-12 w-12 flex justify-center items-center bg ${addedWordDirection === AddedWordDirection.Vertical ? "bg-slate-400" : ""} hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200`}
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
          <div className=" rounded bg-lime-200 border-slate-100 border-solid border-2">
            <h1 className=" pb-2 text-center text-base">
              <span>Вопрос: </span>
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
