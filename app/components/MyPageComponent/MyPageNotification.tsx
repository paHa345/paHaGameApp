import { AppDispatch } from "@/app/store";
// import { addWorkoutActions, IAddWorkoutSlice } from "@/app/store/addWorkoutSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const MyPageNotification = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const fetchCompleteExerciseStatus = useSelector(
  //   (state: IAddWorkoutSlice) => state.addWorkoutState.changeCompleteExerciseStatus
  // );

  // const errorMessage = useSelector(
  //   (state: IAddWorkoutSlice) => state.addWorkoutState.changeCompleteExerciseErrorMessage
  // );

  // useEffect(() => {
  //   if (fetchCompleteExerciseStatus === "error") {
  //     const timeoutId = setTimeout(() => {
  //       dispatch(addWorkoutActions.setChangeCompleteExerciseStatusToReady());
  //     }, 3000);
  //     return () => {
  //       dispatch(addWorkoutActions.setChangeCompleteExerciseStatusToReady());
  //     };
  //   }
  // }, [fetchCompleteExerciseStatus]);

  return (
    <>
      {/* {fetchCompleteExerciseStatus === "error" && (
        <div className=" flex flex-col items-center fixed top-10 left-1/2 w-72 opacity-60">
          <h1 className=" text-center rounded-md   px-3 py-3 bg-rose-500">
            {`Ошибка. ${errorMessage} Повторите попытку позднее`}
          </h1>
        </div>
      )} */}
    </>
  );
};

export default MyPageNotification;
