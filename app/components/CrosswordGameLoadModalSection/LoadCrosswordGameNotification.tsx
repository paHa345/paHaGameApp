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

  const loadCrosswordGameStatus = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.fetchAvailableCrosswordGamesStatus
  );

  //   const errorMessage = useSelector(
  //     (state: IAddWorkoutSlice) => state.addWorkoutState.changeCompleteExerciseErrorMessage
  //   );

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
      {loadCrosswordGameStatus === crosswordGameFetchStatus.Error && (
        <div className=" py-3 my-3 flex flex-col items-center fixed top-20 w-72 opacity-60">
          <h1 className=" text-center rounded-md   px-3 py-3 bg-rose-500">
            {`Ошибка. Повторите попытку позднее`}
          </h1>
        </div>
      )}
      {loadCrosswordGameStatus === crosswordGameFetchStatus.Loading && (
        <div className=" py-3 my-3 flex flex-col items-center fixed top-20 w-72 opacity-60">
          <h1 className=" text-center rounded-md   px-3 py-3 bg-sky-500">
            {`Загрузка кроссворда`}
          </h1>
        </div>
      )}
      {loadCrosswordGameStatus === crosswordGameFetchStatus.Resolve && (
        <div className=" py-3 my-3 flex flex-col items-center fixed top-20 w-72 opacity-60">
          <h1 className=" text-center rounded-md   px-3 py-3 bg-green-500">
            {`Кроссворд успешно загружен`}
          </h1>
        </div>
      )}
    </>
  );
};

export default LoadCrosswordGameNotification;
