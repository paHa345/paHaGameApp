import React from "react";

const LoadingGTSGameCards = () => {
  return (
    <div className=" animate-pulse ">
      <article className="  transition-shadow px-1 py-1 bg-gradient-to-tr from-secoundaryColor to-slate-200 rounded-lg shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow">
        <div className=" flex flex-col">
          <div className=" flex flex-col gap-2">
            <div className=" flex justify-center items-center">
              <div className="self-center  w-4/5  h-6 bg-slate-500 rounded mt-4"></div>
            </div>
            <div className=" flex flex-row justify-around">
              <p
                className={` h-5 w-1/4  bg-isolatedColour self-center py-1 px-2 rounded-md text-cyan-50`}
              ></p>
            </div>
          </div>
          <div className=" flex flex-row justify-center"></div>

          <div className=" flex flex-col">
            <div className="self-end  w-2/5  h-6 bg-slate-500 rounded mt-4"></div>
          </div>
          <div className="self-center  w-4/5  h-6 bg-mainColor rounded mt-4"></div>
        </div>
      </article>
    </div>
  );
};

export default LoadingGTSGameCards;
