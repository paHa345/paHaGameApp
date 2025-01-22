"use client";
import { AppDispatch } from "@/app/store";
import {
  downloadCurrentUserAllGTSGame,
  GTSCreateGameActions,
  GTSCreateGameFetchStatus,
  IGTSCreateGameSlice,
} from "@/app/store/GTSCreateGameSlice";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingGTSGameCards from "./LoadingGTSGameCards";
import GTSGameCard from "./GTSGameCard";

const DownloadGameModalMain = () => {
  const downloadGTSGamesStatus = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.downloadCurrentUserAllGTSGameStatus
  );

  const dispatch = useDispatch<AppDispatch>();
  const hideDownloadGTSGameModalHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(GTSCreateGameActions.setDownloadModalStatus(false));
  };

  const downloadedCurrentUserGTSGames = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.currentUserDownloadedAllGTSGame
  );

  const GTSGameCardsEl = downloadedCurrentUserGTSGames?.map((GTSGame) => {
    return <GTSGameCard key={GTSGame._id} GTSGame={GTSGame}></GTSGameCard>;
  });

  console.log(GTSGameCardsEl);

  useEffect(() => {
    dispatch(downloadCurrentUserAllGTSGame());
    // return () => {
    //   dispatch(crosswordActions.resetCurrentUserCrosswordsArr());
    // };
  }, []);
  return (
    <div className="modal-overlay">
      <div className=" modal-wrapper">
        <div className="modal">
          <div className="modal-header">
            {/* <LoadCrosswordNotification></LoadCrosswordNotification> */}
            <a
              className=" bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
              onClick={hideDownloadGTSGameModalHandler}
              href=""
            >
              <FontAwesomeIcon icon={faXmark} />
            </a>
          </div>
          {downloadGTSGamesStatus === GTSCreateGameFetchStatus.Resolve &&
            GTSGameCardsEl &&
            GTSGameCardsEl.length === 0 && (
              <div className=" overflow-auto">
                <h1 className=" pt-10 text-center text-2xl">Нет сохранённых игр</h1>
              </div>
            )}

          {downloadGTSGamesStatus === GTSCreateGameFetchStatus.Resolve && (
            <div className=" overflow-auto h-5/6">{GTSGameCardsEl}</div>
          )}

          {downloadGTSGamesStatus === GTSCreateGameFetchStatus.Loading && (
            <LoadingGTSGameCards></LoadingGTSGameCards>
          )}

          {downloadGTSGamesStatus === GTSCreateGameFetchStatus.Error && (
            <p>Не удалось загрузить список. Повторите попытку позднее</p>
          )}

          {/* <AddExercisesSection></AddExercisesSection> */}
          <div className="modal-body"></div>
        </div>
      </div>
    </div>
  );
};

export default DownloadGameModalMain;
