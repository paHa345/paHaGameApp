import { AppDispatch } from "@/app/store";
import {
  crosswordGameFetchStatus,
  crossworGamedActions,
  ICrosswordGameSlice,
} from "@/app/store/crosswordGameSlice";
import {
  crosswordActions,
  crosswordFetchStatus,
  ICrosswordSlice,
} from "@/app/store/crosswordSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const LoadCrosswordGameNotification = () => {
  const dispatch = useDispatch<AppDispatch>();

  const errorMessage = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.availableCrosswordGameErrorMessage
  );

  const loadCrosswordGameStatus = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.fetchAvailableCrosswordGamesStatus
  );

  useEffect(() => {
    if (
      loadCrosswordGameStatus === crosswordGameFetchStatus.Error ||
      loadCrosswordGameStatus === crosswordGameFetchStatus.Resolve
    ) {
      const timeoutId = setTimeout(() => {
        dispatch(
          crossworGamedActions.setFetchAvailableCrosswordGamesStatus(crosswordGameFetchStatus.Ready)
        );
      }, 3000);
      return () => {
        dispatch(
          crossworGamedActions.setFetchAvailableCrosswordGamesStatus(crosswordGameFetchStatus.Ready)
        );
      };
    }
  }, [loadCrosswordGameStatus]);

  return (
    <>
      <div className=" absolute w-3/4">
        {loadCrosswordGameStatus === crosswordGameFetchStatus.Error && (
          <h1 className=" text-center rounded-md  opacity-60  px-3 py-3 bg-rose-500">
            {`Ошибка. ${errorMessage} Повторите попытку позднее`}
          </h1>
        )}
        {loadCrosswordGameStatus === crosswordGameFetchStatus.Loading && (
          <h1 className=" text-center rounded-md  opacity-60 px-3 py-3 bg-sky-500">
            {`Загрузка кроссворда`}
          </h1>
        )}
        {loadCrosswordGameStatus === crosswordGameFetchStatus.Resolve && (
          <h1 className=" text-center rounded-md opacity-60  px-3 py-3 bg-green-500">
            {`Кроссворд успешно загружен. Осуществляем переход ...`}
          </h1>
        )}
      </div>
    </>
  );
};

export default LoadCrosswordGameNotification;
