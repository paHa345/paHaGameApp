import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { color } from "framer-motion";
import React from "react";

interface IQuestionStatusProps {
  isCompleted: boolean;
  isCurrent: boolean;
}
const QuestionStatus = ({ isCompleted, isCurrent }: IQuestionStatusProps) => {
  return (
    <div>
      <div className={`${isCurrent ? " bg-cyan-200" : " bg-amber-200"} py-1 px-1 rounded-lg`}>
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
