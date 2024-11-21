import { AppDispatch } from "@/app/store";
import { crossworGamedActions, ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import { AddedWordDirection } from "@/app/store/crosswordSlice";
import {
  faCheckCircle,
  faRulerHorizontal,
  faRulerVertical,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const CrosswordGameCellMenuMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const addedWordDirection = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.addedWordDirection
  );

  const setAddedWordDirection = function (this: any, e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    dispatch(crossworGamedActions.changeAddedWordDirection(this));
  };

  const hideCellMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(crossworGamedActions.setShowCrosswordGameCellMenu(false));
  };

  return (
    <div
      style={{ top: `100px`, left: `200px` }}
      className=" absolute flex justify-center items-center  "
    >
      <div className=" rounded-md bg-slate-200 p-2 fixed flex  border-slate-400 border-solid border-2 ">
        <a
          className=" h-fit bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
          onClick={hideCellMenu}
          href=""
        >
          <FontAwesomeIcon icon={faXmark} />
        </a>
        <a
          className=" h-fit bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
          // onClick={addNumberTextAndHideModalHandler}
          href=""
        >
          <FontAwesomeIcon icon={faCheckCircle} />
        </a>
        <div className="rounded flex flex-col gap-1 justify-center items-center ml-2 border-slate-600 border-solid border-2">
          <div className=" py-2 flex gap-6 flex-row justify-center items-center">
            <div
              onClick={setAddedWordDirection.bind(AddedWordDirection.Horizontal)}
              className={`h-12 w-12 flex justify-center items-center bg ${addedWordDirection === AddedWordDirection.Horizontal ? "bg-slate-400" : ""} hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200`}
            >
              <a href="">
                <FontAwesomeIcon icon={faRulerHorizontal} />
              </a>
            </div>
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
          </div>
          <div className=" m-2 rounded border-slate-100 border-solid border-2">
            {/* <textarea
            className=" ml-2"
            onChange={changeTextQuestionValueHandler}
            value={textQuestionValue}
            placeholder="Введите текст вопроса"
            name="comment"
            cols={20}
            rows={3}
          ></textarea> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrosswordGameCellMenuMain;
