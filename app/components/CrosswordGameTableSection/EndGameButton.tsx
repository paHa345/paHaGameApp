import { faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const EndGameButton = () => {
  return (
    <div className=" flex justify-center items-center">
      <div
        className={` cursor-pointer w-2/4 px-4 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
      >
        <div className=" flex flex-col">
          <div className=" flex flex-col gap-2">
            <div className=" flex flex-row justify-center items-center">
              <div className=" flex justify-center items-center">
                <FontAwesomeIcon className="fa-fw fa-2x" icon={faFlagCheckered} />
              </div>
              <h1 className=" font-light text-2xl text-center grow pl-1 py-2 my-2">
                Закончить попытку
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndGameButton;
