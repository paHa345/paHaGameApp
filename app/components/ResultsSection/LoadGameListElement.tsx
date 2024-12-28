import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const LoadGameListElement = () => {
  return (
    <article
      className={` w-full py-2 px-2
 transition-all rounded-lg ease-in-out delay-50 bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow `}
    >
      <div className=" flex flex-col">
        <div className=" flex flex-col justify-center items-center">
          <div>
            <FontAwesomeIcon className=" animate-spin fa-fw fa-2x" icon={faSpinner} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default LoadGameListElement;
