import { ICrosswordSlice, ModalType } from "@/app/store/crosswordSlice";
import React from "react";
import { useSelector } from "react-redux";
import AddQuestionMain from "./AddQuestionMain";
import AddNumberMain from "./AddNumberMain";
import AddWordMain from "./AddWordMain";

const AddElementsMenuMain = () => {
  const modalType = useSelector((state: ICrosswordSlice) => state.crosswordState.modalType);

  return (
    <div className=" z-20">
      {modalType === ModalType.Question && <AddQuestionMain></AddQuestionMain>}
      {modalType === ModalType.Word && <AddWordMain></AddWordMain>}
      {modalType === ModalType.Number && <AddNumberMain></AddNumberMain>}
    </div>
  );
};

export default AddElementsMenuMain;
