import { AppDispatch } from "@/app/store";
import { guessThatSongActions, IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface IDisplayCurrentTrackProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  abortController: AbortController;
}

const DisplayCurrentTrack = ({ audioRef, abortController }: IDisplayCurrentTrackProps) => {
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

  const audioCanLoadHandler = (e: any) => {
    console.log("Audio can load");
    abortController = new AbortController();

    async function readData(url: string, { signal }: any) {
      console.log("Srart stream");
      const response = await fetch(url, signal);

      if (response.body) {
        const data: any = response.body;
        for await (const chunk of data) {
          if (signal.aborted) break;
          console.log(new TextDecoder().decode(chunk));
        }
        console.log("Finish stream");
      }
    }
    readData(`${process.env.NEXT_PUBLIC_EXPRESS_SERVER_HOST}GTSAttempts/${currentAttempt}`, {
      signal: abortController.signal,
    });
    audioRef.current?.play();
    dispatch(guessThatSongActions.setCurrentAttemptSongIsPlaying(true));
  };

  const startReadableStreamHandler = async function (
    this: string,
    e: React.MouseEvent<HTMLDivElement>
  ) {
    abortController = new AbortController();

    async function readData(url: string, { signal }: any) {
      console.log("Srart stream");
      const response = await fetch(url, signal);

      if (response.body) {
        const data: any = response.body;
        for await (const chunk of data) {
          if (signal.aborted) break;
          console.log(new TextDecoder().decode(chunk));
        }
        console.log("Finish stream");
      }
    }
    readData(`${process.env.NEXT_PUBLIC_EXPRESS_SERVER_HOST}GTSAttempts/${currentAttempt}`, {
      signal: abortController.signal,
    });
  };

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
    </div>
  );
};

export default DisplayCurrentTrack;
