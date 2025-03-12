import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
interface IQuestionStatusProps {
  isCompleted: boolean;
  isCurrent: boolean;
}
const CurrentAttemptQuestion = ({ isCompleted, isCurrent }: IQuestionStatusProps) => {
  return (
    <div>
      <div className={`${isCurrent ? " bg-cyan-200" : " bg-amber-200"} py-1 px-1 rounded-lg`}>
        <FontAwesomeIcon
          style={{ color: `${isCompleted ? " green" : "gray"}` }}
          className="fa-fw fa-3x red"
          icon={faMusic}
        />

        {isCurrent && <h1>Текущий</h1>}
      </div>
    </div>
  );
};

export default CurrentAttemptQuestion;
