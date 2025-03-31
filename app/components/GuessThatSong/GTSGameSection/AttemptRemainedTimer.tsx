import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React from "react";
import { useSelector } from "react-redux";

const AttemptRemainedTimer = () => {
  const remainedTime = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.timeRemained
  );
  const attemptFullTime = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.attemptTime
  );
  const percentage = (remainedTime / attemptFullTime) * 100;

  return (
    <div className=" flex justify-center items-center w-full flex-col">
      <div className=" flex justify-center items-center flex-col text-2xl">
        <h1>Времени осталось</h1>
        <h1 className=" font-bold pb-2">{remainedTime} сек</h1>
      </div>
      <div
        style={{
          background: ` ${remainedTime && attemptFullTime ? `linear-gradient(to right, rgba(22, 128, 204, 0.5 ) ${(remainedTime * 100) / attemptFullTime}%, #ccc ${(remainedTime * 100) / attemptFullTime}%` : ""}`,
        }}
        className="progress w-full h-10 rounded-md"
      >
        {/* <input
          //   className=" w-full song-slider"
          // ref={progressBarRef}
          type="range"
          // defaultValue="0"
          // value={audioRef.current?.currentTime ? audioRef.current.currentTime * 100 : 0}
          min="0"
          max={attemptFullTime ? attemptFullTime * 100 : 0}
          // onChange={handleProgressChange}
        /> */}
      </div>
    </div>
  );
};

export default AttemptRemainedTimer;
