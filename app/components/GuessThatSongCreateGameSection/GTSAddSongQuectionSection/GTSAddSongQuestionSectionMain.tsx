import { AppDispatch } from "@/app/store";
import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GTSAnswer from "./GTSAnswer";
import { div } from "framer-motion/client";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UploadSongMain from "../UploadSongSection/UploadSongMain";
import AddQuestion from "./AddQuestion";

const GTSAddSongQuestionSectionMain = () => {
  const gameValue = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGgameValue
  );
  const createdGameName = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGameName
  );

  const gameIsBeingCreated = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.gameIsBeingCreated
  );

  const currentAddedSong = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.currentAddedSong
  );
  return (
    <div>
      <h1 className=" text-center text-2xl pt-3">
        {/* Вопрос <span>{currentAddedSong}</span> из <span>{gameValue}</span> */}
      </h1>
      <AddQuestion></AddQuestion>
    </div>
  );
};

export default GTSAddSongQuestionSectionMain;
