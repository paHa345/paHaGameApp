import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const AttemptLoadCard = () => {
  return (
    <article
      className={`
px-4 mx-4  hover:scale-105 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
    >
      <div className=" flex flex-col">
        <div className=" flex flex-col gap-2">
          <div className=" flex flex-col justify-center items-center">
            <div className=" py-4">
              <FontAwesomeIcon className=" animate-spin fa-fw fa-2x" icon={faSpinner} />
            </div>
          </div>
          <div className=" flex flex-row justify-around"></div>
        </div>
        <div className=" flex flex-row justify-center"></div>
        <div className=" flex flex-col"></div>
      </div>
    </article>
  );
};

export default AttemptLoadCard;
