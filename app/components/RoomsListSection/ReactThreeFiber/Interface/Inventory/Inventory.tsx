import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { width } from "@fortawesome/free-regular-svg-icons/faSave";
import React from "react";
import { useSelector } from "react-redux";
import styles from "./Inventory.module.css";

const Inventory = () => {
  const playerInventory = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerItems.inventory,
  );
  const dragItemIndex = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.playerItems.dragItem.itemIndexInInventory,
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
          className={` h-[500%] relative max-w-none top-[${el?.position?.top}px] left-[${el?.position?.left}px] xl:h-[500%]  xl:top-[${el?.position?.xlTop}px] xl:left-[${el?.position?.xlLeft}px]`}
          src="/RPGUI/icons.png"
          alt="icons"
        />
      </div>
    );
  });

  return <>{slotContainers}</>;
};

export default Inventory;
