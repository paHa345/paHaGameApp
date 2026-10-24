import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import React from "react";
import { useSelector } from "react-redux";
import styles from "./pointerDragContainer.module.css";

const PointerDragContainer = () => {
  const dragItem = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.playerItems.dragItem,
  );
  return (
    <div
      className={` ${styles.gradientBorder} dragObjectContainer right-[30px] bottom-[30px] w-[50px] h-[50px] xl:right-[55wpx] xl:top-[-55px]  xl:h-[77px] xl:w-[77px] absolute overflow-hidden `}
    >
      <img
        className={` h-[500%] relative max-w-none top-[${dragItem.position.top}px] left-[${dragItem.position.left}px] xl:h-[500%]  xl:top-[${dragItem.position.xlTop}px] xl:left-[${dragItem.position.xlLeft}px]`}
        src="/RPGUI/icons.png"
        alt="icons"
      />
    </div>
  );
};

export default PointerDragContainer;
