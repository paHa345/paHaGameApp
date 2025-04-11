import { AppDispatch } from "@/app/store";
import {
  checkArtistAnswerAndSetNextQuestion,
  GTSGameFetchStatus,
  guessThatSongActions,
  IGuessThatSongSlice,
} from "@/app/store/guessThatSongSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface IArtistAnswerProps {
  text: string;
  artistAnswerID: string;
  isCorrect?: boolean | null | undefined;
  artistAnswerIsChosen: boolean;
}
const ArtistAnswer = ({
  text,
  artistAnswerID,
  isCorrect,
  artistAnswerIsChosen,
}: IArtistAnswerProps) => {
  const attemptID = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSGameAttemptID
  );

  const checkArtistAnswerStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.checkArtistAnswerStatus
  );

  console.log(checkArtistAnswerStatus);

  const dispatch = useDispatch<AppDispatch>();
  const getArtistAnswerHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (checkArtistAnswerStatus === GTSGameFetchStatus.Loading) {
      console.log("Not now");
      return;
    }
    dispatch(guessThatSongActions.setChosenArtistAnswerID(artistAnswerID));

    dispatch(
      checkArtistAnswerAndSetNextQuestion({
        answerID: artistAnswerID,
        attemptID: attemptID,
        userArtistAnserText: text,
      })
    );
  };
  let answerColor = "to-cyan-200";
  if (artistAnswerIsChosen) {
    answerColor = " to-yellow-200";
  }
  if (artistAnswerIsChosen && isCorrect === true) {
    answerColor = " to-green-200";
  }
  if (artistAnswerIsChosen && isCorrect === false) {
    answerColor = " to-red-200";
  }

  return (
    <div
      key={artistAnswerID}
      onClick={getArtistAnswerHandler}
      // ${isCorrect ? "to-green-200" : "to-red-200"}
      className={` ${artistAnswerIsChosen && "scale-110"} ${checkArtistAnswerStatus !== GTSGameFetchStatus.Loading && "cursor-pointer"}   py-2 w-full bg-gradient-to-tr rounded-lg from-secoundaryColor
      ${answerColor}
      shadow-audioControlsButtonShadow hover:shadow-audioControlsButtonHoverShadow `}
    >
      <h1 className={` text-2xl text-center`}>{text}</h1>
    </div>
  );
};

export default ArtistAnswer;
