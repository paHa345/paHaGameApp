import { IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import React from "react";
import { useSelector } from "react-redux";

const UpdatedQuestionImage = () => {
  const updatedQuestionNumber = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.updatedQuestionNumber
  );
  const createdGame = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGTSGame
  );
  const updatedQuestionImageURL =
    updatedQuestionNumber !== undefined && createdGame[updatedQuestionNumber].songURL
      ? createdGame[updatedQuestionNumber].imageURL
      : undefined;

  //   console.log(updatedQuestionImageURL);

  return (
    <div>
      {updatedQuestionImageURL && <img src={updatedQuestionImageURL} alt="Question Image" />}
    </div>
  );
};

export default UpdatedQuestionImage;
