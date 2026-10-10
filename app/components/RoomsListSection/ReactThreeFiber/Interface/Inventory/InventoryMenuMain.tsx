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
          src="/RPGUI/InventoryMainMenu_001.webp"
          alt=""
        />
        <div
          className={` z-10 bg-amber-400 absolute top-[100px] right-[100px] h-[50px] w-[50px] `}
        ></div>
        {/* Shield */}
        <div className=" right-[107px] top-[50px] w-[55px] h-[63px] absolute overflow-hidden xl:right-[160px] xl:top-[76px]  xl:h-[90px] xl:w-[80px]   ">
          <img
            className={` h-[500%] relative max-w-none top-[-255px] left-[-29px]  xl:h-[600%]  xl:top-[-444px] xl:left-[-58px]  `}
            src="/RPGUI/InventoryMainMenu_001.webp"
            alt=""
          />
        </div>
        {/* Sword */}
        <div className=" right-[271px] top-[50px] w-[25px] h-[80px] absolute overflow-hidden xl:right-[407px] xl:top-[78px]  xl:h-[95px] xl:w-[35px]   ">
          {/* */}
          <img
            className={` h-[500%] relative max-w-none top-[-330px] left-[-9px] xl:h-[600%]  xl:top-[-470px] xl:left-[-15px]  `}
            src="/RPGUI/InventoryMainMenu_001.webp"
            alt=""
          />
        </div>
        {/* Helmet */}
        <div className=" right-[199px] top-[28px] w-[36px] h-[40px] xl:right-[300px] xl:top-[46px]  xl:h-[54px] xl:w-[50px]  absolute overflow-hidden ">
          <img
            className={`h-[1400%]   relative max-w-none top-[-407px] left-[-202px] xl:h-[1400%]  xl:top-[-650px]  xl:left-[-325px]  `}
            src="/RPGUI/InventoryMainMenu_001.webp"
            alt=""
          />
        </div>
        {/* Armour */}
        <div className=" right-[181px] top-[85px] w-[70px] h-[83px] xl:right-[270px] xl:top-[130px]  xl:h-[120px] xl:w-[110px] absolute overflow-hidden ">
          <img
            className={` h-[500%] relative max-w-none top-[-340px] left-[-108px] xl:h-[600%]  xl:top-[-590px] xl:left-[-194px]`}
            src="/RPGUI/InventoryMainMenu_001.webp"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryMenuMain;
