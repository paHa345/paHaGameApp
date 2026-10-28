import React, { useEffect, useState } from "react";
import Inventory from "./Inventory";
import { useSelector } from "react-redux";
import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { inventoryItemTypes } from "@/app/types";

interface IInventoryMenuProps {
  isMobile: boolean;
}

const InventoryMenuMain = ({ isMobile }: IInventoryMenuProps) => {
  const playersEquipment = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerItems.equipment,
  );

  return (
    <div>
      <div className=" w-[400px] h-[330px]  lg:w-[500px] lg:h-[412px] xl:w-[600px] xl:h-[495px] overflow-hidden absolute top-[40px] right-[20px] lg:top-[60px] lg:right-[40px] ">
        <img
          //   height={isMobile ? 400 : 800}
          //   width={isMobile ? 400 : 800}
          src="/RPGUI/InventoryMainMenu_002.png"
          alt=""
        />

        {/* Shield */}
        <div
          data-equipmenttype={`${inventoryItemTypes.Shield}`}
          className=" equipmentContainer right-[107px] top-[50px] w-[55px] h-[63px] absolute overflow-hidden xl:right-[160px] xl:top-[76px]  xl:h-[90px] xl:w-[80px]   "
        >
          {playersEquipment.shield?.id ? (
            <img
              className={`
    h-[500%] relative max-w-none xl:h-[500%]
    top-[var(--top)] left-[var(--left)]
    xl:top-[var(--xl-top)] xl:left-[var(--xl-left)]  `}
              style={
                {
                  "--top": `${playersEquipment?.shield?.position?.equipmentTop}px`,
                  "--left": `${playersEquipment?.shield?.position?.equipmentLeft}px`,
                  "--xl-top": `${playersEquipment?.shield?.position?.equipmentXlTop}px`,
                  "--xl-left": `${playersEquipment?.shield?.position?.equipmentXlLeft}px`,
                } as React.CSSProperties
              }
              src="/RPGUI/icons.png"
              alt="icons"
            />
          ) : (
            <img
              className={` h-[500%] relative max-w-none top-[-255px] left-[-29px]  xl:h-[600%]  xl:top-[-444px] xl:left-[-58px]  `}
              src="/RPGUI/InventoryMainMenu_002.png"
              alt=""
            />
          )}
        </div>
        {/* Sword */}
        <div
          data-equipmenttype={`${inventoryItemTypes.Weapon}`}
          className=" equipmentContainer right-[271px] top-[50px] w-[25px] h-[80px] absolute overflow-hidden xl:right-[407px] xl:top-[78px]  xl:h-[95px] xl:w-[35px]   "
        >
          {/* */}
          <img
            className={` h-[500%] relative max-w-none top-[-330px] left-[-9px] xl:h-[600%]  xl:top-[-470px] xl:left-[-15px]  `}
            src="/RPGUI/InventoryMainMenu_002.png"
            alt=""
          />
        </div>
        {/* Helmet */}
        <div
          data-equipmenttype={`${inventoryItemTypes.Helmet}`}
          className=" equipmentContainer right-[199px] top-[28px] w-[36px] h-[40px] xl:right-[300px] xl:top-[46px]  xl:h-[54px] xl:w-[50px]  absolute overflow-hidden "
        >
          <img
            className={`h-[1200%]   relative max-w-none top-[-407px] left-[-202px] xl:h-[1400%]  xl:top-[-650px]  xl:left-[-325px]  `}
            src="/RPGUI/InventoryMainMenu_002.png"
            alt=""
          />
        </div>
        {/* Armour */}
        <div
          data-equipmenttype={`${inventoryItemTypes.Armour}`}
          className=" equipmentContainer right-[181px] top-[85px] w-[70px] h-[83px] xl:right-[270px] xl:top-[130px]  xl:h-[120px] xl:w-[110px] absolute overflow-hidden "
        >
          <img
            className={` h-[500%] relative max-w-none top-[-340px] left-[-108px] xl:h-[600%]  xl:top-[-590px] xl:left-[-194px]`}
            src="/RPGUI/InventoryMainMenu_002.png"
            alt=""
          />
        </div>
        {/* Inventory */}
        <Inventory></Inventory>
      </div>
    </div>
  );
};

export default InventoryMenuMain;
