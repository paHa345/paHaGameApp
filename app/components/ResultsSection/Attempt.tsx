import React from "react";

interface IAttemptProps {
  attempt: {
    completedCorrectly: boolean;
    crosswordID: string;
    crosswordName: string;
    duration: string;
    finishDate: Date;
    isCompleted: boolean;
    startDate: Date;
    telegramID: number;
    telegramUserName?: string;
    _id: string;
  };
}
const Attempt = ({ attempt }: IAttemptProps) => {
  return (
    <>
      <div className="flex gap-2">
        <div>{attempt.telegramUserName}</div>
        <div>{attempt.telegramID}</div>
        {/* <div>{attempt.isCompleted? "Completed" : "Not completed"}</div>
     <div>{attempt.crosswordName}</div> */}
        <div>{attempt.completedCorrectly ? "Correct" : "Incorrect"}</div>
        <div>{attempt.duration}</div>
        {/* <div>{attempt.startDate.toLocaleString()}</div>
     <div>{attempt.finishDate?.toLocaleString()}</div> */}
      </div>
    </>
  );
};

export default Attempt;
