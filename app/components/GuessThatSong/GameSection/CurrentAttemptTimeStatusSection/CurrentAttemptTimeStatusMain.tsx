import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React from "react";
import { useSelector } from "react-redux";

const CurrentAttemptTimeStatusMain = () => {
  const currentAttemptRemainedTime = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.timeRemained
  );
  const currentAttemptFullTime = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.attemptTime
  );

  const attemptData = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData
  );

  return (
    <div className=" flex justify-center items-center w-full flex-col">
      <div className=" flex justify-center items-center flex-col">
        <h1>Времени осталось</h1>
        <h1>{currentAttemptRemainedTime} сек</h1>
      </div>
      <div
        style={{
          background: ` ${currentAttemptRemainedTime && currentAttemptFullTime ? `linear-gradient(to right, rgba(22, 128, 204, 0.5 ) ${(currentAttemptRemainedTime * 100) / currentAttemptFullTime}%, #ccc ${(currentAttemptRemainedTime * 100) / currentAttemptFullTime}%` : ""}`,
        }}
        className="progress w-full h-10 rounded-md"
      ></div>
    </div>
  );
};

export default CurrentAttemptTimeStatusMain;
