import React, { useEffect, useState } from "react";

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
          src="/RPGUI/InventoryMainMenu_001.png"
          alt=""
        />
        <div className=" right-[107px] top-[50px] w-[55px] h-[63px] absolute overflow-hidden ">
          <img
            className={` h-[500%] relative max-w-none top-[-255px] left-[-29px]`}
            src="/RPGUI/InventoryMainMenu_001.png"
            alt=""
          />
        </div>
        <div className=" right-[271px] top-[50px] w-[25px] h-[80px] absolute overflow-hidden ">
          <img
            className={` h-[500%] relative max-w-none top-[-330px] left-[-9px]`}
            src="/RPGUI/InventoryMainMenu_001.png"
            alt=""
          />
        </div>
        <div className=" right-[199px] top-[28px] w-[36px] h-[40px] absolute overflow-hidden ">
          <img
            className={` h-[1200%] relative max-w-none top-[-407px] left-[-202px]`}
            src="/RPGUI/InventoryMainMenu_001.png"
            alt=""
          />
        </div>
        <div className=" right-[181px] top-[85px] w-[70px] h-[83px] absolute overflow-hidden ">
          <img
            className={` h-[500%] relative max-w-none top-[-340px] left-[-108px]`}
            src="/RPGUI/InventoryMainMenu_001.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryMenuMain;
