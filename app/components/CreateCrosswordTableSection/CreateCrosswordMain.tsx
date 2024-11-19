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

const CreateCrosswordMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cretedCrosswordValue = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.crosswordValue
  );

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

  const changeCrosswordName = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // const sendBotHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   console.log("first");
  //   const dataReq = await fetch(
  //     "https://api.telegram.org/bot7577331969:AAGYO1E1Kz_hDPu8DPhXRMUv1Gx_HdTn7Iw/getMe"
  //   );
  //   const data = await dataReq.json();
  //   console.log(data);
  // };

  return (
    <div>
      <div>
        <p>Укажите размер кроссворда</p>
        <input type="number" value={crosswordValue} onChange={changeCrosswordValueHandler} />
        <button onClick={createCrosswordTableHandler}>Создать поле кроссворда</button>
      </div>
      <div>
        <p>
          Размерность кроссворда <span>{cretedCrosswordValue}</span>
        </p>
      </div>
      {crosswordIsCreated || crosswordIsLoading ? (
        <div>
          <p>Название кроссворда</p>

          <input
            className=" border-solid border-2 border-indigo-600"
            type="text"
            value={crosswordName}
            onChange={changeCrosswordName}
          />
        </div>
      ) : (
        <div></div>
      )}

      <SaveCrosswordNotification></SaveCrosswordNotification>

      {crosswordIsCreated && <SaveCurrentCrosswordButton></SaveCurrentCrosswordButton>}

      <LoadCrosswordButton></LoadCrosswordButton>

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
