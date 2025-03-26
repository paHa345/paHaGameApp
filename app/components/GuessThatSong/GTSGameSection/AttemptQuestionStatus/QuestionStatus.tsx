import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { color } from "framer-motion";
import React from "react";

interface IQuestionStatusProps {
  isCompleted: boolean;
  isCurrent: boolean;
  bonusTime: number | undefined;
}
const QuestionStatus = ({ isCompleted, isCurrent, bonusTime }: IQuestionStatusProps) => {
  console.log(bonusTime);
  return (
    <div>
      <div className={`${isCurrent ? " bg-cyan-200" : " bg-amber-200"} rounded-lg`}>
        <FontAwesomeIcon
          style={{ color: `${isCompleted ? " green" : "gray"}` }}
          className="fa-fw fa-3x red"
          icon={faMusic}
        />
        <p>{bonusTime}</p>
      </div>
    </div>
  );
};

export default QuestionStatus;
