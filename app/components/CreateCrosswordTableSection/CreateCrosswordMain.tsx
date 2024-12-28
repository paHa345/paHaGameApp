"use client";
import { AppDispatch } from "@/app/store";
import {
  createCrosswordTableArrAndUpdateState,
  crosswordActions,
  ICrosswordSlice,
} from "@/app/store/crosswordSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateCrosswordContextMenu from "./CreateCrosswordContextMenu";
import AddElementsMenuMain from "../CreateCrosswordTextInputSection/AddElementsMenuMain";
import CreateCrosswordCellMain from "../CreateCrosswordCellSection/CreateCrosswordCellMain";
import CreateCrosswordQuestionsSectionMain from "../CreateCrosswordQuestionsSection/CreateCrosswordQuestionsSectionMain";
import SaveCurrentCrosswordButton from "./SaveCurrentCrosswordButton";
import LoadCrosswordButton from "./LoadCrosswordButton";
import LoadCrosswordModalMain from "../CreateCrosswordLoadModalSection/LoadCrosswordModalMain";
import SaveCrosswordNotification from "./SaveCrosswordNotification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { IAppSlice } from "@/app/store/appStateSlice";

const CreateCrosswordMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cretedCrosswordValue = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.crosswordValue
  );
  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  const showContextMenu = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.createContextMenuStatus
  );

  const crosswordIsCreated = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.crosswordIsCreate
  );

  const crosswordIsLoading = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.crosswordIsLoading
  );

  const crosswordName = useSelector((state: ICrosswordSlice) => state.crosswordState.crosswordName);

  const showAddElementMenu = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.setElementsModalStatus
  );

  const [crosswordValue, setCrosswordValue] = useState(10);
  const changeCrosswordValueHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCrosswordValue(Number(e.currentTarget.value));
  };

  const createdCrosswordTable = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.createdCrossword
  );

  const changeCrosswordName = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(crosswordActions.setCrosswordName(e.currentTarget.value));
  };

  const showLoadCrosswordModal = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.showLoadCrosswordModal
  );

  const cretedCrosswordTableEl = createdCrosswordTable.map((el, i: number) => {
    return (
      <div className=" flex gap-1 mb-1 cellContainer" key={i}>
        {el.map((cell, j: number) => {
          return (
            <div key={`${i}:${j}`}>
              <CreateCrosswordCellMain cell={cell} i={i} j={j}></CreateCrosswordCellMain>
            </div>
          );
        })}
      </div>
    );
  });

  const createCrosswordTableHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (crosswordIsCreated || crosswordIsLoading) {
      alert("Кроссворд уже создан или загружен");
      return;
    }
    dispatch(crosswordActions.crosswordIsCreated(true));
    dispatch(crosswordActions.setCrosswordSize(Number(crosswordValue)));
    dispatch(crosswordActions.resetCrosswordQuestionArr());
    dispatch(crosswordActions.setCrosswordValue(crosswordValue));
    dispatch(createCrosswordTableArrAndUpdateState(crosswordValue));
  };

  useEffect(() => {
    const createdCrossword = localStorage.getItem("createdCrossword");
    const crosswordName = localStorage.getItem("crosswordName");
    const crosswordValue = localStorage.getItem("crosswordValue");
    const crosswordId = localStorage.getItem("crosswordId");
  });

  return (
    <div className=" py-5 min-h-[70vh]">
      <div className=" flex flex-col gap-3 justify-center items-center text-center text-2xl">
        <h1>Укажите размер кроссворда</h1>
        <div className=" border-2 border-solid rounded-md border-cyan-900 w-20">
          <input
            className=" w-full"
            type="number"
            value={crosswordValue}
            onChange={changeCrosswordValueHandler}
          />
        </div>
        <div className=" py-5">
          <button
            className=" py-3 px-3 hover:scale-110 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow"
            onClick={createCrosswordTableHandler}
          >
            <FontAwesomeIcon className=" pr-2" icon={faCirclePlus} />
            Создать поле кроссворда
          </button>
        </div>
      </div>
      <div className=" py-3">
        <h1 className=" text-center text-xl">
          Размерность кроссворда{" "}
          <span className=" font-bold text-2xl underline underline-offset-4">
            {cretedCrosswordValue}
          </span>
        </h1>
      </div>
      {crosswordIsCreated || crosswordIsLoading ? (
        <div>
          <h1 className=" py-3 text-center text-xl">Название кроссворда</h1>

          <div className=" flex flex-col justify-center items-center">
            <textarea
              className=" py-2 text-center text-2xl border-2 border-solid rounded-md border-cyan-900 "
              cols={20}
              rows={3}
              value={crosswordName}
              onChange={changeCrosswordName}
            />
          </div>
        </div>
      ) : (
        <div></div>
      )}

      <SaveCrosswordNotification></SaveCrosswordNotification>

      {crosswordIsCreated && <SaveCurrentCrosswordButton></SaveCurrentCrosswordButton>}

      <div className=" flex justify-center items-center">
        <LoadCrosswordButton></LoadCrosswordButton>
      </div>
      {showLoadCrosswordModal && <LoadCrosswordModalMain></LoadCrosswordModalMain>}

      {/* {setNumberModalStatus && <CreateCrosswordButtonsMenuMain></CreateCrosswordButtonsMenuMain>} */}

      {showAddElementMenu && <AddElementsMenuMain></AddElementsMenuMain>}

      {showContextMenu && <CreateCrosswordContextMenu></CreateCrosswordContextMenu>}

      <div className={` min-w-max pt-5 pb-5 flex-col gap-1`}>{cretedCrosswordTableEl}</div>

      <CreateCrosswordQuestionsSectionMain></CreateCrosswordQuestionsSectionMain>
    </div>
  );
};

export default CreateCrosswordMain;
