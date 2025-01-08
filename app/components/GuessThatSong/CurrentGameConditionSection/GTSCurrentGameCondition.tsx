import { faMusic, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const GTSCurrentGameCondition = () => {
  return (
    <div className=" h-[20vh]">
      <div className=" flex justify-center items-center pt-10 h-10 w-10">
        <FontAwesomeIcon className="fa-fw fa-3x" icon={faMusic} />
      </div>
    </div>
  );
};

export default GTSCurrentGameCondition;
