import { IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import { div } from "framer-motion/client";
import React from "react";
import { useSelector } from "react-redux";

const UpdatedQuestionSong = () => {
  const updatedQuestionNumber = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.updatedQuestionNumber
  );
  const createdGame = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGTSGame
  );
  const updatedQuestionSongURL =
    updatedQuestionNumber !== undefined && createdGame[updatedQuestionNumber].songURL
      ? createdGame[updatedQuestionNumber].songURL
      : undefined;

  return (
    <div className=" my-3 py-3">
      {/* {updatedQuestionNumber !== undefined && <h1>{createdGame[updatedQuestionNumber].songURL}</h1>} */}
      {updatedQuestionSongURL ? (
        <audio src={updatedQuestionSongURL} controls></audio>
      ) : (
        <div>
          <h1>Песня не загружена</h1>
        </div>
      )}
    </div>
  );
};

export default UpdatedQuestionSong;
