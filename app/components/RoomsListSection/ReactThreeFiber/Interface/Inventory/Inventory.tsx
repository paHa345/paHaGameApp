import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { width } from "@fortawesome/free-regular-svg-icons/faSave";
import React from "react";
import { useSelector } from "react-redux";
import styles from "./Inventory.module.css";

const Inventory = () => {
  const playerInventory = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerItems.inventory,
  );
  // xl:right-[${423 - 91 * (index % 4)}px]
  const slotContainers = playerInventory.map((el, index) => {
    const numberCol = index % 4;
    const numberRaw = Math.floor(index / 4);
    return (
      <div
        key={`${el.id}_${index}`}
        className={`${styles.element} inventoryContainer slot_${index}`}
        style={
          {
            "--numberCol": `${numberCol}`,
            "--numberRaw": `${numberRaw}`,
          } as React.CSSProperties
        }
        //   className={` inventoryContainer slot${index} right-[${282 - 63 * (index % 4)}px] top-[${182 + 63 * Math.floor(index / 4)}px] w-[50px] h-[50px]  xl:top-[${273 + 90 * Math.floor(index / 4)}px]  xl:h-[77px] xl:w-[77px] absolute overflow-hidden`}
      >
        <img
          className={` h-[500%] relative max-w-none top-[${el.position.top}px] left-[${el.position.left}px] xl:h-[500%]  xl:top-[${el.position.xlTop}px] xl:left-[${el.position.xlLeft}px]`}
          src="/RPGUI/icons.png"
          alt="icons"
        />
      </div>
    );
  });

  return (
    <>
      {slotContainers}
      {/* {playerInventory[0] && (
        <div className=" inventoryContainer slot1 right-[282px] top-[182px] w-[50px] h-[50px] xl:right-[423px] xl:top-[273px]  xl:h-[77px] xl:w-[77px] absolute overflow-hidden ">
          <img
            className={` h-[500%] relative max-w-none top-[${playerInventory[0].position.top}px] left-[${playerInventory[0].position.left}px] xl:h-[500%]  xl:top-[${playerInventory[0].position.xlTop}px] xl:left-[${playerInventory[0].position.xlLeft}px]`}
            src="/RPGUI/icons.png"
            alt="icons"
          />
        </div>
      )}
      {playerInventory[1] && (
        <div className=" inventoryContainer slot2 right-[219px] top-[182px] w-[50px] h-[50px] xl:right-[332px] xl:top-[273px]  xl:h-[77px] xl:w-[77px] absolute overflow-hidden ">
          <img
            className={` h-[500%] relative max-w-none top-[5px] left-[-44px] xl:h-[500%]  xl:top-[6px] xl:left-[-65px]`}
            src="/RPGUI/icons.png"
            alt="icons"
          />
        </div>
      )}
      {playerInventory[2] && (
        <div className=" inventoryContainer slot3 right-[156px] top-[182px] w-[50px] h-[50px] xl:right-[237px] xl:top-[273px]  xl:h-[77px] xl:w-[77px] absolute overflow-hidden ">
          <img
            className={` h-[500%] relative max-w-none top-[-44px] left-[2px] xl:h-[500%]  xl:top-[-70px] xl:left-[5px]`}
            src="/RPGUI/icons.png"
            alt="icons"
          />
        </div>
      )}
      {playerInventory[3] && (
        <div className=" inventoryContainer slot4 right-[93px] top-[182px] w-[50px] h-[50px] xl:right-[143px] xl:top-[273px]  xl:h-[77px] xl:w-[77px] absolute overflow-hidden ">
          <img
            className={` h-[500%] relative max-w-none top-[-44px] left-[-44px] xl:h-[500%]  xl:top-[-70px] xl:left-[-65px]`}
            src="/RPGUI/icons.png"
            alt="icons"
          />
        </div>
      )}
      {playerInventory[4] && (
        <div className=" inventoryContainer slot5 right-[282px] top-[245px] w-[50px] h-[50px] xl:right-[423px] xl:top-[363px]  xl:h-[77px] xl:w-[77px] absolute overflow-hidden ">
          <img
            className={` h-[500%] relative max-w-none top-[5px] left-[2px] xl:h-[500%]  xl:top-[6px] xl:left-[5px]`}
            src="/RPGUI/icons.png"
            alt="icons"
          />
        </div>
      )}
      {playerInventory[5] && (
        <div className=" inventoryContainer slot6 right-[222px] top-[245px] w-[50px] h-[50px] xl:right-[332px] xl:top-[363px]  xl:h-[77px] xl:w-[77px] absolute overflow-hidden ">
          <img
            className={` h-[500%] relative max-w-none top-[5px] left-[2px] xl:h-[500%]  xl:top-[6px] xl:left-[5px]`}
            src="/RPGUI/icons.png"
            alt="icons"
          />
        </div>
      )}
      {playerInventory[6] && (
        <div className=" inventoryContainer slot7 right-[157px] top-[245px] w-[50px] h-[50px] xl:right-[237px] xl:top-[363px]  xl:h-[77px] xl:w-[77px] absolute overflow-hidden ">
          <img
            className={` h-[500%] relative max-w-none top-[5px] left-[2px] xl:h-[500%]  xl:top-[6px] xl:left-[5px]`}
            src="/RPGUI/icons.png"
            alt="icons"
          />
        </div>
      )}
      {playerInventory[7] && (
        <div className=" inventoryContainer slot8 right-[96px] top-[245px] w-[50px] h-[50px] xl:right-[143px] xl:top-[363px]  xl:h-[77px] xl:w-[77px] absolute overflow-hidden ">
          <img
            className={` h-[500%] relative max-w-none top-[5px] left-[2px] xl:h-[500%]  xl:top-[6px] xl:left-[5px]`}
            src="/RPGUI/icons.png"
            alt="icons"
          />
        </div>
      )} */}
    </>
  );
};

export default Inventory;
