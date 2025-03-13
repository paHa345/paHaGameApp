import { faCompactDisc, faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
interface IQuestionStatusProps {
  isCompleted: boolean;
  isCurrent: boolean;
  answerIsCorrect?: boolean;
}
const CurrentAttemptQuestion = ({
  isCompleted,
  isCurrent,
  answerIsCorrect,
}: IQuestionStatusProps) => {
  console.log(answerIsCorrect);

  let answerBGColor = " bg-slate-300";
  // ${answerIsCorrect && isCompleted ? "bg-lime-300" : " bg-red-300"}
  if (answerIsCorrect && isCompleted) {
    answerBGColor = "bg-lime-300";
  }
  if (!answerIsCorrect && isCompleted) {
    answerBGColor = "bg-red-300";
  }

  return (
    <div>
      <div
        className={` ${isCurrent ? " scale-110" : ""} ${answerBGColor}  py-3 px-3 rounded-2xl shadow-audioControlsButtonHoverShadow `}
      >
        <FontAwesomeIcon
          // style={{ color: "green" }}
          style={{ color: `${isCompleted ? " black" : "gray"}` }}
          className={`fa-fw fa-3x ${isCurrent ? "animate-spin" : ""} `}
          icon={faCompactDisc}
        />

        {/* {isCurrent && <h1>Текущий</h1>} */}
      </div>
    </div>
  );
};

export default CurrentAttemptQuestion;
