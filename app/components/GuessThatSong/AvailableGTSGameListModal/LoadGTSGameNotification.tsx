import { AppDispatch } from "@/app/store";
import {
  GTSGameFetchStatus,
  guessThatSongActions,
  IGuessThatSongSlice,
} from "@/app/store/guessThatSongSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const LoadGTSGameNotification = () => {
  const dispatch = useDispatch<AppDispatch>();

  const errorMessage = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.getAvailableGTSGamesErrorMessage
  );

  const loadGTSGamesStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.fetchAvailableGTSGameStatus
  );

  useEffect(() => {
    if (
      loadGTSGamesStatus === GTSGameFetchStatus.Error ||
      loadGTSGamesStatus === GTSGameFetchStatus.Resolve
    ) {
      const timeoutId = setTimeout(() => {
        dispatch(guessThatSongActions.setFetchAvailableGTSGameStatus(GTSGameFetchStatus.Ready));
      }, 3000);
      return () => {
        dispatch(guessThatSongActions.setFetchAvailableGTSGameStatus(GTSGameFetchStatus.Ready));
      };
    }
  }, [loadGTSGamesStatus]);

  return (
    <>
      <div className=" absolute w-3/4">
        {loadGTSGamesStatus === GTSGameFetchStatus.Error && (
          <h1 className=" text-center rounded-md  opacity-60  px-3 py-3 bg-rose-500">
            {`Ошибка. ${errorMessage} Повторите попытку позднее`}
          </h1>
        )}
        {loadGTSGamesStatus === GTSGameFetchStatus.Loading && (
          <h1 className=" text-center rounded-md  opacity-60 px-3 py-3 bg-sky-500">
            {`Загрузка кроссворда`}
          </h1>
        )}
        {loadGTSGamesStatus === GTSGameFetchStatus.Resolve && (
          <h1 className=" text-center rounded-md opacity-60  px-3 py-3 bg-green-500">
            {`Кроссворд успешно загружен. Осуществляем переход ...`}
          </h1>
        )}
      </div>
    </>
  );
};

export default LoadGTSGameNotification;
