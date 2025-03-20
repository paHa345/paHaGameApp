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
    <div className=" bg-cyan-50 bg-opacity-60 rounded-xl shadow-cardElementShadow px-5 py-5  flex justify-center items-center w-full flex-col">
      <div className=" flex justify-center items-center flex-col text-2xl">
        <h1>Времени осталось</h1>
        <h1 className=" font-bold pb-2">{currentAttemptRemainedTime} сек</h1>
      </div>
      <div
        style={{
          background: ` ${currentAttemptRemainedTime && currentAttemptFullTime ? `linear-gradient(to right, rgba(22, 128, 204, 0.5 ) ${(currentAttemptRemainedTime * 100) / currentAttemptFullTime}%, #ccc ${(currentAttemptRemainedTime * 100) / currentAttemptFullTime}%` : ""}`,
        }}
        className="progress w-full h-10 rounded-md shadow-timeBarShadow "
      ></div>
    </div>
  );
};

export default CurrentAttemptTimeStatusMain;
