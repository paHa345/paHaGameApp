import { AppDispatch } from "@/app/store";
import { guessThatSongActions, IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const FetchConyroller = ({ audioRef }: any) => {
  const abortController = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.abortController
  );
  const dispatch = useDispatch<AppDispatch>();

  const currentAttemptData = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData
  );

  const currentAttempt = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSGameAttemptID
  );

  useEffect(() => {
    if (abortController) {
      async function readData(url: string, { signal }: any) {
        const response = await fetch(url, signal);

        if (response.body) {
          const data: any = response.body;
          for await (const chunk of data) {
            if (signal?.aborted) break;

            const time = new TextDecoder().decode(chunk).split(" ");
            dispatch(guessThatSongActions.setCurrentAttemptTimeRemained(time[1]));
          }
        }
      }
      readData(`${process.env.NEXT_PUBLIC_EXPRESS_SERVER_HOST}GTSAttempts/${currentAttempt}`, {
        signal: abortController?.signal,
      });
      audioRef.current?.play();
      dispatch(guessThatSongActions.setCurrentAttemptSongIsPlaying(true));
    }
  }, [abortController]);

  return <></>;
};

export default FetchConyroller;
