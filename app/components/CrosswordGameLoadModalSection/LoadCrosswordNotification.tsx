import { AppDispatch } from "@/app/store";
import {
  crosswordActions,
  crosswordFetchStatus,
  ICrosswordSlice,
} from "@/app/store/crosswordSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const LoadCrosswordNotification = () => {
  const dispatch = useDispatch<AppDispatch>();

  const loadCrosswordStatus = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.setCurrentUserCrosswordDataStatus
  );

  //   const errorMessage = useSelector(
  //     (state: IAddWorkoutSlice) => state.addWorkoutState.changeCompleteExerciseErrorMessage
  //   );

  useEffect(() => {
    if (
      loadCrosswordStatus === crosswordFetchStatus.Error ||
      loadCrosswordStatus === crosswordFetchStatus.Resolve
    ) {
      const timeoutId = setTimeout(() => {
        dispatch(crosswordActions.setLoadCrosswordStatusToReady());
      }, 3000);
      return () => {
        dispatch(crosswordActions.setLoadCrosswordStatusToReady());
      };
    }
  }, [loadCrosswordStatus]);

  return (
    <>
      {loadCrosswordStatus === crosswordFetchStatus.Error && (
        <div className=" flex flex-col items-center fixed top-10 left-1/2 w-72 opacity-60">
          <h1 className=" text-center rounded-md   px-3 py-3 bg-rose-500">
            {`Ошибка. Повторите попытку позднее`}
          </h1>
        </div>
      )}
      {loadCrosswordStatus === crosswordFetchStatus.Loading && (
        <div className=" flex flex-col items-center fixed top-10 left-1/2 w-72 opacity-60">
          <h1 className=" text-center rounded-md   px-3 py-3 bg-sky-500">
            {`Загрузка кроссворда`}
          </h1>
        </div>
      )}
      {loadCrosswordStatus === crosswordFetchStatus.Resolve && (
        <div className=" flex flex-col items-center fixed top-10 left-1/2 w-72 opacity-60">
          <h1 className=" text-center rounded-md   px-3 py-3 bg-green-500">
            {`Кроссворд успешно загружен`}
          </h1>
        </div>
      )}
    </>
  );
};

export default LoadCrosswordNotification;
