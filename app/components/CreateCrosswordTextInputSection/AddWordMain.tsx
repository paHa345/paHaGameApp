import { AppDispatch } from "@/app/store";
import { AddedWordDirection, crosswordActions, ICrosswordSlice } from "@/app/store/crosswordSlice";
import {
  faXmark,
  faCheckCircle,
  faRulerHorizontal,
  faRulerVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddWordMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const highlitedCoordinates = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.highlightedField.cellCoordinates
  );

  const addedWordDirection = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.addedWord.direction
  );

  const addedWordValue = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.addedWord.value
  );

  useEffect(() => {
    dispatch(crosswordActions.setWordObjFronCellToState(addedWordDirection));

    // return () => {
    //   second
    // }
  }, []);

  const changeAddedWordValueHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("change");
    dispatch(crosswordActions.setAddedWordValue(e.currentTarget.value.toLowerCase()));
  };

  const hideSetNumberModalHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(crosswordActions.hideSetElementsMenu());
    dispatch(crosswordActions.setAddedWordValue(""));
  };

  const setAddedWordDirection = function (this: any, e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    dispatch(crosswordActions.setAddedWordDirection(this));
    dispatch(crosswordActions.setWordObjFronCellToState(addedWordDirection));

    // dispatch(crosswordActions.setAddedWordValue(""));

    // dispatch(crosswordActions.setAddedWordDirection(e.target.dataset.direction as AddedWordDirection));
  };

  const addNumberTextAndHideModalHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // dispatch(crosswordActions.setAddedWordValue(""));

    // dispatch(crosswordActions.setCellTextQuestionValue(textQuestionValue));
    dispatch(crosswordActions.hideSetElementsMenu());
    dispatch(crosswordActions.addWordObjToCell(""));
    dispatch(crosswordActions.clearAddedWord());
  };

  return (
    <div
      style={{ top: `100px`, left: `200px` }}
      className=" absolute flex justify-center items-center  "
    >
      <div className=" rounded-md bg-slate-200 p-2 fixed flex  border-slate-400 border-solid border-2 ">
        <div>
          <div className=" flex">
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
          </div>
        </div>
        <div className=" flex flex-col gap-1 justify-center items-center ml-2 border-slate-600 border-solid border-2">
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

          <div className="m-3  border-slate-300 border-solid border-2">
            <textarea
              className=" ml-2"
              onChange={changeAddedWordValueHandler}
              value={addedWordValue}
              placeholder="Введите слово"
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

export default AddWordMain;
