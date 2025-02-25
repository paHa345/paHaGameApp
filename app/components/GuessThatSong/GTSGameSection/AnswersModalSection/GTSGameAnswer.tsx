import React from "react";

interface IGTSGameAnswerProps {
  answerText: string;
}
const GTSGameAnswer = ({ answerText }: IGTSGameAnswerProps) => {
  return (
    <div className="">
      <h1>{answerText}</h1>
    </div>
  );
};

export default GTSGameAnswer;
