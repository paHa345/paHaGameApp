import { AppDispatch } from "@/app/store";
import {
  crosswordActions,
  crosswordSlice,
  ICrosswordSlice,
  ModalType,
} from "@/app/store/crosswordSlice";
import { faXmark, faCheckCircle, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddNumberMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const highlitedCoordinates = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.highlightedField.cellCoordinates
  );

  const currentValue = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.highlightedField
  );

  const createdCrossword = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.createdCrossword
  );
  const crosswordName = useSelector((state: ICrosswordSlice) => state.crosswordState.crosswordName);
  const crosswordValue = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.crosswordValue
  );
  const crosswordId = useSelector((state: ICrosswordSlice) => state.crosswordState.crosswordId);

  const hideSetNumberModalHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // dispatch(crosswordActions.setCellInputToParagraph(""));
    dispatch(crosswordActions.showParagraph());
    dispatch(crosswordActions.setInputToCell(0));
    dispatch(crosswordActions.setHighlitedParagraphStatusTrue());
    dispatch(crosswordActions.hideSetElementsMenu());
    dispatch(crosswordActions.clearInputValueAndParagraphStatus());
  };

  const addNumberTextAndHideModalHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log("hide");
    // dispatch(crosswordActions.addNumberAndText(currentNumber));

    window.localStorage.setItem("createdCrossword", JSON.stringify(createdCrossword));
    window.localStorage.setItem("crosswordName", JSON.stringify(crosswordName));
    window.localStorage.setItem("crosswordValue", JSON.stringify(crosswordValue));
    window.localStorage.setItem("crosswordId", JSON.stringify(crosswordId));

    dispatch(crosswordActions.setCellInputToParagraph(""));
    dispatch(crosswordActions.setHighlitedParagraphStatusTrue());
    dispatch(crosswordActions.hideSetElementsMenu());
    dispatch(crosswordActions.setInputToCell(0));
  };

  const incrementNumberHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log(currentValue.paragraphNum);

    dispatch(
      crosswordActions.changeCellInputValue({
        value: String(currentValue.paragraphNum + 1),
        fieldPosition: {
          row: String(currentValue.row),
          col: String(currentValue.number),
        },
      })
    );
  };
  const decrementNumberHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    dispatch(
      crosswordActions.changeCellInputValue({
        value: String(Math.max(currentValue.paragraphNum - 1, 1)),
        fieldPosition: {
          row: String(currentValue.row),
          col: String(currentValue.number),
        },
      })
    );
  };

  return (
    <div
      style={{
        top: `${highlitedCoordinates.y + window.scrollY}px`,
        left: `${highlitedCoordinates.x}px`,
      }}
      className=" absolute flex justify-center items-center  "
    >
      <div className=" rounded-md bg-slate-200 p-2 absolute flex flex-col top-[-105px] right-[-60px] border-slate-400 border-solid border-2 ">
        <div className=" flex">
          <a
            className=" bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
            onClick={hideSetNumberModalHandler}
            href=""
          >
            <FontAwesomeIcon icon={faXmark} />
          </a>
          <a
            className=" bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
            onClick={addNumberTextAndHideModalHandler}
            href=""
          >
            <FontAwesomeIcon icon={faCheckCircle} />
          </a>
        </div>
        <div className=" flex">
          <a
            className=" bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
            onClick={incrementNumberHandler}
            href=""
          >
            <FontAwesomeIcon icon={faPlus} />
          </a>
          <a
            className=" bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
            onClick={decrementNumberHandler}
            href=""
          >
            <FontAwesomeIcon icon={faMinus} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AddNumberMain;
