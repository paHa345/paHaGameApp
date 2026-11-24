import React, { useEffect, useState } from "react";
import Inventory from "./Inventory";
import { useSelector } from "react-redux";
import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { inventoryItemTypes } from "@/app/types";
import EquipmentMain from "./EquipmentMain";
import SelectedItemMenuMain from "./SelectedItemMenuMain";
import PlayerStats from "./PlayerStats";
import LevelUpIcon from "./LevelUpIcon";
import LevelUpMenuMain from "../LevelUpMenu/LevelUpMenuMain";

interface IInventoryMenuProps {
  isMobile: boolean;
}

const InventoryMenuMain = ({ isMobile }: IInventoryMenuProps) => {
  return (
    <div>
      <div className=" w-[400px] h-[330px]  lg:w-[500px] lg:h-[412px] xl:w-[600px] xl:h-[495px] overflow-hidden absolute top-[40px] right-[20px] lg:top-[60px] lg:right-[40px] ">
        <img
          //   height={isMobile ? 400 : 800}
          //   width={isMobile ? 400 : 800}
          src="/RPGUI/InventoryMainMenu_002.png"
          alt=""
        />
        {/* Player Stats */}
        <PlayerStats></PlayerStats>
        {/* Level Up Icon */}
        <LevelUpIcon></LevelUpIcon>
        {/* Equipment */}
        <EquipmentMain></EquipmentMain>

        {/* Inventory */}
        <Inventory></Inventory>
      </div>
      {/* Selected Item Menu */}
      <SelectedItemMenuMain></SelectedItemMenuMain>

      {/* Level Up Menu */}
      <LevelUpMenuMain></LevelUpMenuMain>
    </div>
  );
};

export default InventoryMenuMain;
