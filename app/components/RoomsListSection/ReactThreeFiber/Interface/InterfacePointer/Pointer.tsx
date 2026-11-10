import React from "react";

const Pointer = () => {
  return (
    <div className={` z-50 w-[32px] h-[45px] overflow-hidden absolute`}>
      <img
        className={` h-[100%] relative left-[-5px] max-w-none`}
        src="/RPGUI/pointer.png"
        alt=""
      />
    </div>
  );
};

export default Pointer;
