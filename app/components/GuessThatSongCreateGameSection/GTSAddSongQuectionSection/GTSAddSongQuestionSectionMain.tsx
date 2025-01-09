import { AppDispatch } from "@/app/store";
import { IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const GTSAddSongQuestionSectionMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const gameValue = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGgameValue
  );
  const createdGameName = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGameName
  );

  const currentAddedSong = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.currentAddedSong
  );
  return (
    <div>
      <h1>
        Песня <span>{currentAddedSong}</span> из <span>{gameValue}</span>
      </h1>
    </div>
  );
};

export default GTSAddSongQuestionSectionMain;
