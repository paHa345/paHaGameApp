import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { color } from "framer-motion";
import React from "react";

interface IQuestionStatusProps {
  isCompleted: boolean;
}
const QuestionStatus = ({ isCompleted }: IQuestionStatusProps) => {
  return (
    <div>
      <div className=" ">
        <FontAwesomeIcon
          style={{ color: `${isCompleted ? " green" : "gray"}` }}
          className="fa-fw fa-3x red"
          icon={faMusic}
        />
      </div>
    </div>
  );
};

export default QuestionStatus;
