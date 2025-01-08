import { AppDispatch } from "@/app/store";
import {
  guessThatSongActions,
  IGuessThatSongSlice,
} from "@/app/store/guessThatSongSlice";
import { div } from "framer-motion/client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface IProgressBarProps {
  progressBarRef: React.RefObject<HTMLInputElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
  timeProgress: number;
}
const ProgressBar = ({
  progressBarRef,
  audioRef,
  timeProgress,
}: IProgressBarProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleProgressChange = () => {
    let songCurrentTime: string | undefined = String(
      audioRef.current?.currentTime
    );
    // console.log(progressBarRef.current?.value / 100);
    dispatch(guessThatSongActions.setPlayingSongCurrentTime(10));
  };

  const playingSongCurrentTime = useSelector(
    (state: IGuessThatSongSlice) =>
      state.guessThatSongState.playingSongCurrentTime
  );

  const duration = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentSongDuration
  );

  const formatTime = (time: number | undefined) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
  };

  return (
    <div className=" flex justify-center items-center  w-full">
      <div className=" w-full flex justify-center items-center gap-7 shadow-smallShadow py-4 px-4 my-4 rounded-lg">
        {/* <h1>
          {playingSongCurrentTime ? Math.trunc(playingSongCurrentTime) : ""}
        </h1> */}
        <div>
          {" "}
          <span className="time current">
            {formatTime(playingSongCurrentTime)}
          </span>
        </div>
        <div
          style={{
            background: ` ${playingSongCurrentTime && duration ? `linear-gradient(to right, rgba(132, 204, 22, 0.5 ) ${(playingSongCurrentTime * 100) / duration}%, #ccc ${(playingSongCurrentTime * 100) / duration}%` : ""}`,
          }}
          className="progress w-full rounded-md"
        >
          <input
            className=" w-full song-slider"
            ref={progressBarRef}
            type="range"
            defaultValue="0"
            value={playingSongCurrentTime}
            min="0"
            max={duration ? duration * 100 : 0}
            onChange={handleProgressChange}
          />
        </div>
        <div>
          {" "}
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
