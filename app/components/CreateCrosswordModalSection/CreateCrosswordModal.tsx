import { AppDispatch } from "@/app/store";
import {
  crosswordActions,
  crosswordSlice,
  ICrosswordSlice,
  ModalType,
} from "@/app/store/crosswordSlice";
import { faXmark, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CreateCrosswordModal = () => {
  const dispatch = useDispatch<AppDispatch>();

  const highlitedCoordinates = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.highlightedField.cellCoordinates
  );

  const modalType = useSelector((state: ICrosswordSlice) => state.crosswordState.modalType);

  const [currentNumber, setCurrentNumber] = useState(0);

  const changeNumberHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentNumber(Number(e.currentTarget.value));
  };

  const hideSetNumberModalHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(crosswordActions.hideSetElementsMenu());
  };

  const addNumberTextAndHideModalHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // dispatch(crosswordActions.addNumberAndText(currentNumber));
    dispatch(crosswordActions.setCellInputToParagraph(""));
    dispatch(crosswordActions.setHighlitedParagraphStatusTrue());
    dispatch(crosswordActions.hideSetElementsMenu());
  };
  return (
    <div className=" relative modal-overlay">
      {modalType === ModalType.Number && (
        <div
          style={{ top: `${highlitedCoordinates.y}px`, left: `${highlitedCoordinates.x}px` }}
          className=" absolute flex justify-center items-center  h-10 w-10 bg-slate-200 border-solid border-2 border-indigo-600"
        >
          <div className=" w-full ">
            <input
              onChange={changeNumberHandler}
              className=" w-full"
              type="number"
              value={currentNumber}
            />
          </div>
          <div className="absolute flex top-[-30px] right-[-30px] ">
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
        </div>
      )}
      {modalType === ModalType.Question && (
        <div
          style={{
            top: `${highlitedCoordinates.y + 40}px`,
            left: `${highlitedCoordinates.x}px`,
          }}
          className=" absolute flex justify-center items-center  h-10 w-10 bg-slate-200 border-solid border-2 border-indigo-600"
        >
          <div className=" w-full ">
            <input
              onChange={changeNumberHandler}
              className=" w-full"
              type="number"
              value={currentNumber}
            />
          </div>
          <div className="absolute flex top-[-30px] right-[-30px] ">
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
        </div>
      )}
    </div>
  );
};

export default CreateCrosswordModal;
