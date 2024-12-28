import { AppDispatch } from "@/app/store";
import { crosswordActions, ICrosswordSlice, ModalType } from "@/app/store/crosswordSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const CreateCrosswordContextMenu = () => {
  const dispatch = useDispatch<AppDispatch>();

  const positionX = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.createContextMenuXPosition
  );
  const positionY = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.createContextMenuYPosition
  );

  const createdCrossword = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.createdCrossword
  );

  const highlightedEl = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.highlightedField
  );

  console.log(highlightedEl);

  const createContextMenuConstant = [
    {
      name: ` ${highlightedEl.setParagraph !== 0 ? "Обновить" : "Добавить"}  номер`,
      handler: "addNumberHandler",
    },
    // { name: "Добавить текст", handler: "addText" },
    // { name: "По горизонтали", handler: "addHorizontHandler" },
    { name: "Добавить слово", handler: "addWordHandler" },
  ];

  const contextMenuActionHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    const actionName = e.currentTarget.dataset.actionhandler;
    if (actionName === "addNumberHandler") {
      dispatch(crosswordActions.setInputToCell(1));
      dispatch(crosswordActions.hideParagraph());
      dispatch(crosswordActions.setModalType(ModalType.Number));
      dispatch(crosswordActions.setCreateContextMenuStatusFalse());
      dispatch(crosswordActions.showSetElementsMenu());
    }
    if (actionName === "addWordHandler") {
      dispatch(crosswordActions.setModalType(ModalType.Word));
      dispatch(crosswordActions.setCreateContextMenuStatusFalse());
      dispatch(crosswordActions.showSetElementsMenu());
    }
  };

  const hideMenuHandler = () => {
    dispatch(crosswordActions.setHighlightedField(""));
    dispatch(crosswordActions.setCreateContextMenuStatusFalse());
  };

  const clearParagraphFieldHandler = () => {
    dispatch(crosswordActions.clearParagraphField());
    // dispatch(crosswordActions.setCreateContextMenuStatusFalse());
    dispatch(crosswordActions.daleteQuestionTextFromState());
    dispatch(crosswordActions.deleteQuestionTextFromCurrentCell());
    // dispatch(crosswordActions.setCellTextQuestionValue(""));
    dispatch(crosswordActions.setQuestionValue(""));
    dispatch(crosswordActions.clearCurrentCellAddedWord());
  };

  const addTextHandler = () => {
    dispatch(crosswordActions.setQuestionTextFromCellToState());
    dispatch(crosswordActions.setModalType(ModalType.Question));
    dispatch(crosswordActions.setCreateContextMenuStatusFalse());
    dispatch(crosswordActions.showSetElementsMenu());
  };

  return (
    <div
      className=" z-20 rounded-lg  bg-slate-700 text-slate-200 shadow-lg border-solid border-2"
      style={{ position: "absolute", left: `${positionX}px`, top: `${positionY + 30}px` }}
    >
      <div onClick={hideMenuHandler} className=" mt-2 mr-2 flex justify-end">
        <div className=" cursor-pointer  flex justify-center items-center w-8 h-8 rounded-full p-2 border-2 pb-2 hover:bg-slate-500">
          <p>x</p>
        </div>
      </div>

      <div className=" rounded-lg p-4 flex flex-col w-fit ">
        {highlightedEl.setParagraph !== 0 && (
          <div
            onClick={clearParagraphFieldHandler}
            //   data-actionhandler={el.handler}
            //   key={el.name}
            className=" cursor-pointer flex justify-center items-center rounded-sm p-2 border-b-2 pb-2 hover:bg-slate-500"
          >
            Очистить поле
          </div>
        )}
        {highlightedEl.setParagraph === 1 && (
          <div
            onClick={addTextHandler}
            data-actionhandler={"addtext"}
            className=" cursor-pointer flex justify-center items-center rounded-sm p-2 border-b-2 pb-2 hover:bg-slate-500"
          >
            {"Добавить текст"}
          </div>
        )}
        {createContextMenuConstant.map((el, index) => {
          return (
            <div
              onClick={contextMenuActionHandler}
              data-actionhandler={el.handler}
              key={el.name}
              className=" cursor-pointer flex justify-center items-center rounded-sm p-2 border-b-2 pb-2 hover:bg-slate-500"
            >
              {el.name}
            </div>
          );
        })}
        {/* <div className=" rounded-sm p-2 border-b-2 pb-2 hover:bg-slate-500">Добавить номер</div>
        <div className=" rounded-sm p-2 border-b-2 pb-2 hover:bg-slate-500">По горизонтали</div>
        <div className=" rounded-sm p-2 border-b-2 pb-2 hover:bg-slate-500">По вертикали</div> */}
      </div>
    </div>
  );
};

export default CreateCrosswordContextMenu;
