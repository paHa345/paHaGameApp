import { AppDispatch } from "@/app/store";
import {
  crosswordActions,
  crosswordFetchStatus,
  ICrosswordSlice,
} from "@/app/store/crosswordSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const SaveCrosswordNotification = () => {
  const dispatch = useDispatch<AppDispatch>();

  const saveCrosswordStatus = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.saveCurrentCrosswordInDBStatus
  );

  //   const errorMessage = useSelector(
  //     (state: IAddWorkoutSlice) => state.addWorkoutState.changeCompleteExerciseErrorMessage
  //   );

  useEffect(() => {
    if (
      saveCrosswordStatus === crosswordFetchStatus.Error ||
      saveCrosswordStatus === crosswordFetchStatus.Resolve
    ) {
      const timeoutId = setTimeout(() => {
        dispatch(crosswordActions.setSaveCrosswordStatusToReady());
      }, 3000);
      return () => {
        dispatch(crosswordActions.setSaveCrosswordStatusToReady());
      };
    }
  }, [saveCrosswordStatus]);

  return (
    <>
      {saveCrosswordStatus === crosswordFetchStatus.Error && (
        <div className=" flex flex-col items-center fixed top-10 left-1/2 w-72 opacity-60">
          <h1 className=" text-center rounded-md   px-3 py-3 bg-rose-500">
            {`Ошибка. Повторите попытку позднее`}
          </h1>
        </div>
      )}
      {saveCrosswordStatus === crosswordFetchStatus.Loading && (
        <div className=" flex flex-col items-center fixed top-10 left-1/2 w-72 opacity-60">
          <h1 className=" text-center rounded-md   px-3 py-3 bg-sky-500">
            {`Сохранение кроссворда`}
          </h1>
        </div>
      )}
      {saveCrosswordStatus === crosswordFetchStatus.Resolve && (
        <div className=" flex flex-col items-center fixed top-10 left-1/2 w-72 opacity-60">
          <h1 className=" text-center rounded-md   px-3 py-3 bg-green-500">
            {`Кроссворд успешно сохранён`}
          </h1>
        </div>
      )}
    </>
  );
};

export default SaveCrosswordNotification;
