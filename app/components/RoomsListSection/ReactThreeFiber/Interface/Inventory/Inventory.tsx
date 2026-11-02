import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { width } from "@fortawesome/free-regular-svg-icons/faSave";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Inventory.module.css";

const Inventory = () => {
  const playerInventory = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.playerItems.inventory,
  );
  const dragItemIndex = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.playerItems.dragItem.itemIndexInInventory,
  );

  const windowWidth = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.windowHeightWidth.width,
  );

  // xl:right-[${423 - 91 * (index % 4)}px]
  const slotContainers = playerInventory.map((el, index) => {
    const numberCol = index % 4;
    const numberRaw = Math.floor(index / 4);
    return (
      <div
        key={`${el.id}_${index}`}
        className={`${styles.element} inventoryContainer slot_${index} ${dragItemIndex === index ? `${styles.selected}` : ""}`}
        data-index={`${index}`}
        style={
          {
            "--numberCol": `${numberCol}`,
            "--numberRaw": `${numberRaw}`,
          } as React.CSSProperties
        }
        //   className={` inventoryContainer slot${index} right-[${282 - 63 * (index % 4)}px] top-[${182 + 63 * Math.floor(index / 4)}px] w-[50px] h-[50px]  xl:top-[${273 + 90 * Math.floor(index / 4)}px]  xl:h-[77px] xl:w-[77px] absolute overflow-hidden`}
      >
        <img
          style={
            windowWidth > 1280
              ? {
                  top: `${el?.position?.xlTop}px`,
                  left: `${el?.position?.xlLeft}px`,
                }
              : {
                  top: `${el?.position?.top}px`,
                  left: `${el?.position?.left}px`,
                }
          }
          // style={
          //   {
          //     "--xl-top": `${el?.position?.xlTop}px`,
          //     "--xl-left": `${el?.position?.xlLeft}px`,
          //   } as React.CSSProperties
          // }
          // style={
          //   {
          //     "--xl-top": `${el?.position?.xlTop}px`,
          //     "--xl-left": `${el?.position?.xlLeft}px`,
          //     "--top": `${el?.position?.top}px`,
          //     "--left": `${el?.position?.left}px`,
          //   } as React.CSSProperties
          // }
          className={` h-[500%] relative max-w-none xl:h-[500%] ]`}
          src="/RPGUI/icons.png"
          alt="icons"
        />
      </div>
    );
  });

  return <>{slotContainers}</>;
};

export default Inventory;
