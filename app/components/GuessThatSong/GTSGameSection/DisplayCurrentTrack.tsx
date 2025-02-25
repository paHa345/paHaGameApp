import { AppDispatch } from "@/app/store";
import { guessThatSongActions, IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { Dispatch } from "@reduxjs/toolkit";
import React, { SetStateAction, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FetchConyroller from "./FetchConyroller";

interface IDisplayCurrentTrackProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const DisplayCurrentTrack = ({ audioRef }: IDisplayCurrentTrackProps) => {
  const currentAttempt = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSGameAttemptID
  );
  const dispatch = useDispatch<AppDispatch>();

  const currentAttemptData = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData
  );

  const endSongHandler = () => {
    audioRef.current?.play();
    // dispatch(guessThatSongActions.setSongIsPlayingStatus(!songIsPlaying));
  };

  const abortController = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.abortController
  );

  const audioCanLoadHandler = (e: any) => {
    console.log("Audio can load");
    if (!abortController) {
      dispatch(guessThatSongActions.setAbortController(new AbortController()));
    }
  };

  // const startReadableStreamHandler = async function (
  //   this: string,
  //   e: React.MouseEvent<HTMLDivElement>
  // ) {
  //   setAborter(new AbortController());

  //   async function readData(url: string, { signal }: any) {
  //     console.log("Srart stream");
  //     const response = await fetch(url, signal);

  //     if (response.body) {
  //       const data: any = response.body;
  //       for await (const chunk of data) {
  //         if (signal.aborted) break;
  //         console.log(new TextDecoder().decode(chunk));
  //       }
  //       console.log("Finish stream");
  //     }
  //   }
  //   readData(`${process.env.NEXT_PUBLIC_EXPRESS_SERVER_HOST}GTSAttempts/${currentAttempt}`, {
  //     signal: abortController?.signal,
  //   });
  // };

  // const stopRedableStream = () => {
  //     abortController.abort();
  // };

  return (
    <div>
      <audio
        onEnded={endSongHandler}
        ref={audioRef}
        onCanPlayThrough={audioCanLoadHandler}
        src={`${currentAttemptData.songURL}`}
        // controls
      ></audio>
      <FetchConyroller audioRef={audioRef}></FetchConyroller>
    </div>
  );
};

export default DisplayCurrentTrack;
