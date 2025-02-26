import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React from "react";
import { useSelector } from "react-redux";

const RemainedTimeAnswerModal = () => {
  const answerTime = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.answerTime
  );
  return (
    <div>
      <div
        style={{
          background: ` ${answerTime > 0 ? `linear-gradient(to right, rgba(22, 128, 204, 0.5 ) ${(answerTime * 100) / 10}%, #ccc ${(answerTime * 100) / 10}%` : ""}`,
        }}
        className="progress w-full h-10 rounded-md flex jus items-center"
      >
        <h1 className=" w-full text-center text-3xl font-semibold">{answerTime}</h1>
      </div>
    </div>
  );
};

export default RemainedTimeAnswerModal;
