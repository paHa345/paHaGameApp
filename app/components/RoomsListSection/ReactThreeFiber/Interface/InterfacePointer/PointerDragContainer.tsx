import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import React from "react";
import { useSelector } from "react-redux";
import styles from "./pointerDragContainer.module.css";

const PointerDragContainer = () => {
  const dragItem = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.playerItems.dragItem.item,
  );
  const windowWidth = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.windowHeightWidth.width,
  );
  return (
    <>
      {dragItem.id ? (
        <div
          className={` ${styles.gradientBorder} dragObjectContainer right-[30px] bottom-[30px] w-[50px] h-[50px] xl:right-[55wpx] xl:top-[-55px]  xl:h-[77px] xl:w-[77px] absolute overflow-hidden `}
        >
          <img
            style={
              windowWidth > 1280
                ? {
                    top: `${dragItem?.position?.xlTop}px`,
                    left: `${dragItem?.position?.xlLeft}px`,
                  }
                : {
                    top: `${dragItem?.position?.top}px`,
                    left: `${dragItem?.position?.left}px`,
                  }
            }
            className={` h-[500%] relative max-w-none xl:h-[500%]  `}
            src="/RPGUI/icons.png"
            alt="icons"
          />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default PointerDragContainer;
