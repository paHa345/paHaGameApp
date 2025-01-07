"use client";

import { AppDispatch } from "@/app/store";
import {
  guessThatSongActions,
  IGuessThatSongSlice,
} from "@/app/store/guessThatSongSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface IDisplayTrackProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const DisplayTrack = ({ audioRef }: IDisplayTrackProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const songIsPlaying = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.songIsPlaying
  );

  const endSongHandler = () => {
    audioRef.current?.play();
    // dispatch(guessThatSongActions.setSongIsPlayingStatus(!songIsPlaying));
  };
  const onLoadedMetadata = () => {
    console.log(audioRef.current?.duration);
    dispatch(
      guessThatSongActions.setCurrentSongDuration(audioRef.current?.duration)
    );
  };

  return (
    <div>
      <audio
        onEnded={endSongHandler}
        onLoadedMetadata={onLoadedMetadata}
        ref={audioRef}
        src="https://rhjm8idplsgk4vxo.public.blob.vercel-storage.com/Black_Sabbath_-_Neon_Knights_47956657%20(mp3cut.net)-0o9CPiA4j34FNKCJbJAeynWTnLUDiZ.mp3"
      ></audio>
    </div>
  );
};

export default DisplayTrack;
