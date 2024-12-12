import { AppDispatch } from "@/app/store";
import { AddedWordDirection, crosswordActions, ICrosswordSlice } from "@/app/store/crosswordSlice";
import {
  faXmark,
  faCheckCircle,
  faRulerHorizontal,
  faRulerVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const AddQuestionMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const highlitedCoordinates = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.highlightedField.cellCoordinates
  );

  const addedWordDirection = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.addedWord.direction
  );

  const textQuestionValue = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.questionValue
  );

  const changeTextQuestionValueHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(crosswordActions.setQuestionValue(e.currentTarget.value));
  };

  const hideSetNumberModalHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(crosswordActions.hideSetElementsMenu());
    dispatch(crosswordActions.setQuestionValue(""));
  };

  const addNumberTextAndHideModalHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // console.log(textQuestionValue);
    // if (textQuestionValue.trim().length === 0) {
    //   console.log("first");
    //   // clear cell.questionObj.horizontal or vertical = null
    //   dispatch(crosswordActions.clearQuestion());
    // }

    dispatch(crosswordActions.setCellTextQuestionValue(textQuestionValue));
    dispatch(crosswordActions.addQuestionToState(textQuestionValue));
    dispatch(crosswordActions.setQuestionValue(""));
    dispatch(crosswordActions.hideSetElementsMenu());
  };

  const setAddedWordDirection = function (this: any, e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    dispatch(crosswordActions.setAddedWordDirection(this));
    dispatch(crosswordActions.setQuestionTextFromCellToState());
    // dispatch(crosswordActions.setWordObjFronCellToState(addedWordDirection));
    // dispatch(crosswordActions.setAddedWordValue(""));
    // dispatch(crosswordActions.setAddedWordDirection(e.target.dataset.direction as AddedWordDirection));
  };

  return (
    <div
      style={{ top: `100px`, left: `200px` }}
      className=" absolute flex justify-center items-center  "
    >
      <div className=" rounded-md bg-slate-200 p-2 fixed flex  border-slate-400 border-solid border-2 ">
        <a
          className=" h-fit bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
          onClick={hideSetNumberModalHandler}
          href=""
        >
          <FontAwesomeIcon icon={faXmark} />
        </a>
        <a
          className=" h-fit bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
          onClick={addNumberTextAndHideModalHandler}
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
            <textarea
              className=" ml-2"
              onChange={changeTextQuestionValueHandler}
              value={textQuestionValue}
              placeholder="Введите текст вопроса"
              name="comment"
              cols={20}
              rows={3}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionMain;
