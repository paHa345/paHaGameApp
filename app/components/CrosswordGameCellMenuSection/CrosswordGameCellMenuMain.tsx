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
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const CrosswordGameCellMenuMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const addedWordDirection = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.addedWordDirection
  );

  const highlightedCell = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.highlightedCell
  );
  const setAddedWordDirection = function (this: any, e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    dispatch(crossworGamedActions.changeAddedWordDirectionAndSetHighlightedCells(this));
  };

  const currentDirection = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.addedWordDirection
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

  let currentValue: string | undefined = highlightedCell?.addedWordArr.filter(
    (el) => el.direction === addedWordDirection
  )[0].value;

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

  if (
    highlightedCell?.addedWordArr.filter((el) => el.direction === addedWordDirection)[0] !==
    undefined
  ) {
    highlightedCell?.addedWordArr.filter((el) => el.direction === addedWordDirection)[0].value;
  }

  useEffect(() => {
    currentValue = highlightedCell?.addedWordArr.filter(
      (el) => el.direction === addedWordDirection
    )[0].value;
  }, [addedWordDirection]);

  const changeAddedWordValueHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(crossworGamedActions.changeAddedWordValue(e.currentTarget.value));
  };

  const hideCellMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(crossworGamedActions.setShowCrosswordGameCellMenu(false));
  };

  const currentQuestion =
    currentDirection === AddedWordDirection.Horizontal
      ? highlightedCell?.questionObj.horizontal?.value
      : highlightedCell?.questionObj.vertical?.value;

  return (
    <div style={{ top: `100px`, right: `200px` }} className=" flex justify-center items-center  ">
      <div className=" w-5/6  rounded-md bg-slate-200 p-2 fixed flex  border-slate-400 border-solid border-2 ">
        <a
          className=" h-fit bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
          onClick={hideCellMenu}
          href=""
        >
          <FontAwesomeIcon icon={faXmark} />
        </a>
        {/* <a
          className=" h-fit bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
          // onClick={addNumberTextAndHideModalHandler}
          href=""
        >
          <FontAwesomeIcon icon={faCheckCircle} />
        </a> */}
        <div className="rounded flex flex-col gap-1 justify-center items-center ml-2 border-slate-600 border-solid border-2">
          <div className=" py-2 flex gap-6 flex-row justify-center items-center">
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
          <div className=" max-w-full m-2 rounded border-slate-100 border-solid border-2">
            <h1>
              <span>Вопрос: </span>
              {currentQuestion}
            </h1>
            <textarea
              className=" ml-2"
              onChange={changeAddedWordValueHandler}
              value={currentValue}
              placeholder="Ваш ответ"
              name="answer"
              cols={20}
              rows={1}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrosswordGameCellMenuMain;
