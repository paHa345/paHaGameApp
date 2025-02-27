import { AppDispatch } from "@/app/store";
import { guessThatSongActions, IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const FetchAnswerTimeStream = () => {
  const dispatch = useDispatch<AppDispatch>();

  const currentAttempt = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSGameAttemptID
  );
  const stopAnswerTimeController = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.stopAnswerTimerController
  );

  console.log(stopAnswerTimeController);

  useEffect(() => {
    if (stopAnswerTimeController) {
      async function readData(url: string, { signal }: any) {
        console.log("Srart stream");
        const response = await fetch(url, signal);

        if (response.body) {
          const data: any = response.body;
          for await (const chunk of data) {
            if (signal?.aborted) break;

            const time = new TextDecoder().decode(chunk).split(" ");
            console.log(time[1]);
            dispatch(guessThatSongActions.setCurrentAnswerTimeRemained(time[1]));
          }
          console.log("Finish stream");
        }
      }
      readData(`${process.env.NEXT_PUBLIC_EXPRESS_SERVER_HOST}answerTime/${currentAttempt}`, {
        signal: stopAnswerTimeController?.signal,
      });
    }
  }, [stopAnswerTimeController]);

  return <></>;
};

export default FetchAnswerTimeStream;
