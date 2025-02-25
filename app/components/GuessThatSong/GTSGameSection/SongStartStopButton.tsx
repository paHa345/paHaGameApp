"use client";
import { AppDispatch } from "@/app/store";
import { guessThatSongActions, IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { faCirclePlay, faCircleStop, faForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ISongStartStopButtonProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}
const SongStartStopButton = ({ audioRef }: ISongStartStopButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const songIsPlaying = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentAttemptSongIsPlaying
  );

  const abortController = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.abortController
  );

  const stopStartSongHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    // console.log(audioRef.current);
    if (songIsPlaying) {
      audioRef.current?.pause();
      dispatch(guessThatSongActions.setCurrentAttemptSongIsPlaying(false));

      abortController?.abort();
      dispatch(guessThatSongActions.setAbortController(undefined));
      console.log("Stop song");
      dispatch(guessThatSongActions.setShowGTSAnswersModal(true));
    } else {
      audioRef.current?.play();
      if (!abortController) {
        dispatch(guessThatSongActions.setAbortController(new AbortController()));
      }
      dispatch(guessThatSongActions.setCurrentAttemptSongIsPlaying(true));
    }
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

  return (
    <div className=" flex justify-center items-center flex-col">
      <div
        className=" cursor-pointer transition-all ease-in duration-200   hover:underline  my-6 mx-6 py-8 px-8 rounded-3xl bg-gradient-to-tr from-secoundaryColor to-cyan-200 shadow-audioControlsButtonShadow hover:shadow-audioControlsButtonHoverShadow"
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
      {/* <div
              onClick={skipSongHandler}
              className=" cursor-pointer transition-all ease-in duration-200   hover:underline  my-6 mx-6 py-8 px-8 rounded-3xl bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-audioControlsButtonShadow hover:shadow-audioControlsButtonHoverShadow"
            >
              <FontAwesomeIcon className="fa-fw fa-6x" icon={faForward} />
              <div>
                <h1 className=" text-center text-xl font-bold">Пропустить</h1>
              </div>
            </div> */}
    </div>
  );
};

export default SongStartStopButton;
