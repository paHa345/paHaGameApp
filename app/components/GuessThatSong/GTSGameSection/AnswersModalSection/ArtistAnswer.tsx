import { AppDispatch } from "@/app/store";
import {
  checkArtistAnswerAndSetNextQuestion,
  IGuessThatSongSlice,
} from "@/app/store/guessThatSongSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface IArtistAnswerProps {
  text: string;
  artistAnswerID: string;
  isCorrect?: boolean;
}
const ArtistAnswer = ({ text, artistAnswerID, isCorrect }: IArtistAnswerProps) => {
  const attemptID = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSGameAttemptID
  );
  const dispatch = useDispatch<AppDispatch>();
  const getArtistAnswerHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    dispatch(
      checkArtistAnswerAndSetNextQuestion({
        answerID: artistAnswerID,
        attemptID: attemptID,
        userArtistAnserText: text,
      })
    );
  };
  return (
    <div
      key={artistAnswerID}
      onClick={getArtistAnswerHandler}
      // ${isCorrect ? "to-green-200" : "to-red-200"}
      className={` cursor-pointer py-2 w-full bg-gradient-to-tr rounded-lg from-secoundaryColor
       
      shadow-audioControlsButtonShadow hover:shadow-audioControlsButtonHoverShadow `}
    >
      <h1 className=" text-2xl text-center">{text}</h1>
    </div>
  );
};

export default ArtistAnswer;
