import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import React from "react";
import { useSelector } from "react-redux";

const PointerMain = () => {
  return (
    <div className=" top-[50%] right-[50%] w-[32px] h-[45px] overflow-hidden absolute ">
      <img className={` h-[100%] relative max-w-none`} src="/RPGUI/pointer.png" alt="" />
    </div>
  );
};

export default PointerMain;
