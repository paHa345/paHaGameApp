import { AppDispatch } from "@/app/store";
import {
  checkGTSGameAnswerAndSetQuestion,
  guessThatSongActions,
  IGuessThatSongSlice,
} from "@/app/store/guessThatSongSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface IGTSGameAnswerProps {
  answerText: string;
  id: string;
}
const GTSGameAnswer = ({ answerText, id }: IGTSGameAnswerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const chosenGTSGameAnswerID = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.chosenGTSGameAnswerID
  );
  const stopAnswerTimeController = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.stopAnswerTimerController
  );
  const attemptID = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSGameAttemptID
  );

  const answerIsCorrect = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.answerIsCorrect
  );
  const chooseAnswerHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(guessThatSongActions.setChosenGTSGameAnswerID(id));
    stopAnswerTimeController?.abort();
    dispatch(checkGTSGameAnswerAndSetQuestion({ answerID: id, attemptID: attemptID }));
  };
  let answerStatus = null;

  if (chosenGTSGameAnswerID === id && answerIsCorrect === true) {
    answerStatus = true;
  }
  if (chosenGTSGameAnswerID === id && answerIsCorrect === false) {
    answerStatus = false;
  }

  // chosenGTSGameAnswerID === id && answerIsCorrect ? (answerStatus = true) : (answerStatus = false);
  return (
    <div
      onClick={chooseAnswerHandler}
      className={` ${answerStatus === true && "to-green-300"} ${answerStatus === false && "to-red-300"}  cursor-pointer py-2 w-full bg-gradient-to-tr rounded-lg from-secoundaryColor ${chosenGTSGameAnswerID === id ? "to-yellow-200 scale-110" : "to-cyan-200"}  hover:to-yellow-200 shadow-audioControlsButtonShadow hover:shadow-audioControlsButtonHoverShadow `}
    >
      <h1 className=" text-2xl text-center">{answerText}</h1>
    </div>
  );
};

export default GTSGameAnswer;
