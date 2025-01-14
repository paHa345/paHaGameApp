import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { div } from "framer-motion/client";
import React from "react";

const QuestionsButtons = () => {
  return (
    <div className=" py-3">
      <div className=" flex justify-center items-center">
        <h1>Редактировать</h1>
        <FontAwesomeIcon className=" pr-2" icon={faPencil} />
      </div>
    </div>
  );
};

export default QuestionsButtons;
