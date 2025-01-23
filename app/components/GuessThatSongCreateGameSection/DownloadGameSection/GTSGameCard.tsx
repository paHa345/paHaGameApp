import { AppDispatch } from "@/app/store";
import {
  downloadCurrentUserGTSGameAndAddInState,
  GTSCreateGameActions,
  GTSCreateGameFetchStatus,
  IGTSCreateGameSlice,
} from "@/app/store/GTSCreateGameSlice";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface IGTSGameProps {
  GTSGame: {
    _id: string;
    name: string;
    userID: string;
    changeDate: Date;
    isCompleted: boolean;
  };
}

const GTSGameCard = ({ GTSGame }: IGTSGameProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const fetchCurrentGTSGameStatus = useSelector(
    (state: IGTSCreateGameSlice) =>
      state.GTSCreateGameState.downloadCurrentUserGTSGameAndAddInStateStatus
  );

  const fetchCurrentGTSGameErrorMessage = useSelector(
    (state: IGTSCreateGameSlice) =>
      state.GTSCreateGameState.downloadCurrentUserGTSGameAndAddInStateErrorMessage
  );
  const fetchingGTSGameID = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.downloadedCurrentUserGTSGameID
  );

  const loadGTSGameHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(GTSGame._id);
    dispatch(downloadCurrentUserGTSGameAndAddInState(GTSGame._id));
    // TODO: Load GTS game
  };
  return (
    <article className=" mb-4  transition-shadow px-1 py-1 bg-gradient-to-tr from-secoundaryColor to-slate-200 rounded-lg shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow">
      <div className=" flex flex-col">
        <div className=" flex flex-col gap-2">
          <div className=" flex justify-center items-center">
            <h1 className=" text-center grow text-base text font-bold pl-1 pt-1">{GTSGame.name}</h1>
          </div>
          <div className=" flex flex-row justify-around">
            <p
              className={` ${GTSGame.isCompleted ? "bg-green-800" : "bg-isolatedColour"} self-center py-1 px-2 rounded-md text-cyan-50`}
            >
              {GTSGame.isCompleted ? "Опубликован" : "В работе"}
            </p>
          </div>
        </div>
        <div className=" flex flex-row justify-center"></div>
        <div className=" flex flex-col">
          <div className=" self-end pt-1">
            Изменено:{" "}
            <span className=" text-sm font-bold">
              {new Date(GTSGame.changeDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        {fetchCurrentGTSGameStatus === GTSCreateGameFetchStatus.Error &&
          fetchingGTSGameID === GTSGame._id && (
            <div>
              <h1>{fetchCurrentGTSGameErrorMessage}</h1>
            </div>
          )}
        <button
          disabled={
            fetchCurrentGTSGameStatus === GTSCreateGameFetchStatus.Loading ||
            fetchCurrentGTSGameStatus === GTSCreateGameFetchStatus.Error
              ? true
              : false
          }
          onClick={loadGTSGameHandler}
          className=" py-2 bg-mainColor hover:bg-mainGroupColour rounded-md"
        >
          {fetchCurrentGTSGameStatus === GTSCreateGameFetchStatus.Loading &&
            fetchingGTSGameID === GTSGame._id && (
              <FontAwesomeIcon className=" mr-4 animate-spin" icon={faSpinner}></FontAwesomeIcon>
            )}
          Загрузить
        </button>
      </div>
    </article>
  );
};

export default GTSGameCard;
