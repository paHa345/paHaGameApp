"use client";

import { AppDispatch } from "@/app/store";
import {
  GTSCreateGameActions,
  GTSCreateGameFetchStatus,
  IGTSCreateGameSlice,
} from "@/app/store/GTSCreateGameSlice";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GTSAddSongQuestionSectionMain from "./GTSAddSongQuectionSection/GTSAddSongQuestionSectionMain";
import QuestionsButtons from "./QuestionsButtons/QuestionsButtons";
import DeleteGTSQuestionModalMain from "./DeleteQuestionSection/DeleteQuestionModalMain";
import AddGTSGameButtonMain from "./AddGTSGameSection/AddGTSGameButtonMain";
import PublicGTSGameMain from "./PublicGTSGameSection/PublicGTSGameMain";
import CrateGTSQuestion from "./CrateGTSQuestion";
import DownloadGameButton from "./DownloadGameSection/DownloadGameButton";
import DownloadGameModalMain from "./DownloadGameSection/DownloadGameModalMain";

const GuessThatSongCreateGameMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const gameIsBeingCreated = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.gameIsBeingCreated
  );
  const currentGameAdded = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGTSGame
  );
  const deleteQuestionStatus = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.deleteQuestionStatus
  );
  const uploadGTSGameStatus = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.uploadCurrentGTSGameStatus
  );
  const uploadGTSGameErrorMessage = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.uploadCurrentGTSGameErrorMessage
  );

  const showDownloadGTSGameModal = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.showDownloadModalStatus
  );

  return (
    <div className=" pt-8 py-5 min-h-[70vh]">
      <CrateGTSQuestion></CrateGTSQuestion>
      {showDownloadGTSGameModal && <DownloadGameModalMain></DownloadGameModalMain>}

      {deleteQuestionStatus && <DeleteGTSQuestionModalMain></DeleteGTSQuestionModalMain>}
      {gameIsBeingCreated && <GTSAddSongQuestionSectionMain></GTSAddSongQuestionSectionMain>}
      {!gameIsBeingCreated && currentGameAdded.length > 0 && (
        <PublicGTSGameMain></PublicGTSGameMain>
      )}
      {!gameIsBeingCreated && currentGameAdded.length > 0 && (
        <AddGTSGameButtonMain></AddGTSGameButtonMain>
      )}

      <DownloadGameButton></DownloadGameButton>
      {uploadGTSGameStatus === GTSCreateGameFetchStatus.Error && (
        <div className=" flex justify-center items-center">
          <div className=" my-2 w-11/12 py-1 px-3 rounded-lg bg-red-300">
            <h1 className=" text-center">Ошибка загрузки игры. Повторите попытку позже.</h1>
            <p className=" text-center"> {uploadGTSGameErrorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuessThatSongCreateGameMain;
