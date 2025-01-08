"use client";

import { AppDispatch } from "@/app/store";
import {
  guessThatSongActions,
  IGuessThatSongSlice,
} from "@/app/store/guessThatSongSlice";
import {
  faCirclePlay,
  faCircleStop,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChessBoard,
  faCircle,
  faForward,
  faForwardFast,
  faForwardStep,
  faStepForward,
  faVolumeHigh,
  faVolumeLow,
  faVolumeOff,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { audio, div } from "framer-motion/client";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

interface IAudioPlayerControlsProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  progressBarRef: React.MutableRefObject<null>;
}
const AudioPlayerControls = ({
  audioRef,
  progressBarRef,
}: IAudioPlayerControlsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const songIsPlaying = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.songIsPlaying
  );

  const isSongMuted = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.mutedSongVolume
  );

  const playAnimationRef: any = useRef();

  const songVolume = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.songVolume
  );
  const stopStartSongHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(guessThatSongActions.setSongIsPlayingStatus(!songIsPlaying));
  };
  const skipSongHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("skipsongIsPlaying");
  };
  const playingSongCurrentTime = useSelector(
    (state: IGuessThatSongSlice) =>
      state.guessThatSongState.playingSongCurrentTime
  );

  const changeVolumeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(guessThatSongActions.setSongVolume(e.target.value));
  };

  const muteSongValueHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("muteSongValueHandler");
    dispatch(guessThatSongActions.setMutedSongVolume(!isSongMuted));
  };

  useEffect(() => {
    if (audioRef.current !== null) {
      if (songIsPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [songIsPlaying, audioRef]);

  useEffect(() => {
    if (audioRef.current !== null) {
      if (audioRef) {
        audioRef.current.volume = songVolume / 100;
        audioRef.current.muted = isSongMuted;
      }
    }
  }, [songVolume, audioRef, isSongMuted]);

  const repeat = useCallback(() => {
    // console.log(audioRef.current?.currentTime);
    // console.log(progressBarRef.current?.value);

    if (audioRef.current?.currentTime) {
      dispatch(
        guessThatSongActions.setPlayingSongCurrentTime(
          audioRef.current?.currentTime
        )
      );
      // progressBarRef.current.value = playingSongCurrentTime;
      // let time = progressBarRef.current?.value;
      // time = playingSongCurrentTime;
    }

    playAnimationRef.current = requestAnimationFrame(repeat);
  }, []);

  useEffect(() => {
    if (songIsPlaying) {
      audioRef.current?.play();
      playAnimationRef.current = requestAnimationFrame(repeat);
    } else {
      audioRef.current?.pause();
      cancelAnimationFrame(playAnimationRef.current);
    }
  }, [songIsPlaying, audioRef, repeat]);

  return (
    <div>
      <div className="">
        <div>
          <div className=" flex justify-center items-center gap-7 shadow-smallShadow py-4 px-4 my-4 rounded-lg">
            <div
              style={{
                background: `linear-gradient(to top right, rgba(132, 204, 22, ${songVolume < 20 ? 0.2 : songVolume / 100} ),#E7F9FF )`,
              }}
              className=" py-1 px-1 flex-none cursor-pointer w-fit border-2 border-solid border-stone-400 rounded-xl bg-gradient-to-tr from-secoundaryColor to-cyan-100"
              onClick={muteSongValueHandler}
            >
              {isSongMuted && (
                <FontAwesomeIcon className="fa-fw fa-3x" icon={faVolumeXmark} />
              )}
              {songVolume > 80 && !isSongMuted && (
                <FontAwesomeIcon className="fa-fw fa-3x" icon={faVolumeHigh} />
              )}
              {songVolume < 20 && !isSongMuted && (
                <FontAwesomeIcon className="fa-fw fa-3x" icon={faVolumeOff} />
              )}
              {songVolume >= 20 && songVolume <= 80 && !isSongMuted && (
                <FontAwesomeIcon className="fa-fw fa-3x" icon={faVolumeLow} />
              )}
            </div>

            <div className=" grow">
              <input
                style={{
                  background: `linear-gradient(to right, rgba(132, 204, 22, ${songVolume < 20 ? 0.2 : songVolume / 100} ) ${songVolume}%, #ccc ${songVolume}%)`,
                }}
                className=" volume-slider cursor-pointer h-2 rounded-md w-full border-2 border-solid border-stone-600"
                type="range"
                min={0}
                max={100}
                value={songVolume}
                onChange={changeVolumeHandler}
              />
            </div>
          </div>
        </div>
        <div className=" flex justify-center items-center flex-col">
          <div
            className=" cursor-pointer transition-all ease-in duration-200   hover:underline  my-6 mx-6 py-8 px-8 rounded-3xl bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-audioControlsButtonShadow hover:shadow-audioControlsButtonHoverShadow"
            onClick={stopStartSongHandler}
          >
            {!songIsPlaying ? (
              <div>
                <FontAwesomeIcon className="fa-fw fa-6x" icon={faCirclePlay} />
                <div>
                  <h1 className=" pt-4 text-center text-xl font-bold">Старт</h1>
                </div>
              </div>
            ) : (
              <div>
                <FontAwesomeIcon className="fa-fw fa-6x" icon={faCircleStop} />
                <div>
                  <h1 className=" pt-4 text-center text-xl font-bold">Стоп</h1>
                </div>
              </div>
            )}
          </div>
          <div
            onClick={skipSongHandler}
            className=" cursor-pointer transition-all ease-in duration-200   hover:underline  my-6 mx-6 py-8 px-8 rounded-3xl bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-audioControlsButtonShadow hover:shadow-audioControlsButtonHoverShadow"
          >
            <FontAwesomeIcon className="fa-fw fa-6x" icon={faForward} />
            <div>
              <h1 className=" text-center text-xl font-bold">Пропустить</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerControls;
