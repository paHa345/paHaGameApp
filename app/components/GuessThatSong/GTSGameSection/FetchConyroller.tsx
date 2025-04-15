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
            // console.log(time[0]);
            // console.log(time[1]);
            if (time[0] === "AttemptTimeIsUp:") {
              audioRef.current?.pause();
              dispatch(guessThatSongActions.setCurrentAttemptSongIsPlaying(false));

              abortController?.abort();
              dispatch(guessThatSongActions.setAbortController(undefined));
              console.log("Stop song");
              dispatch(guessThatSongActions.setShowGTSAnswersModal(true));
              dispatch(guessThatSongActions.setStopAnswerTimerController(new AbortController()));
              break;
            }
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
