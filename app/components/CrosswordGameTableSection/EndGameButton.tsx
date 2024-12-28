import { AppDispatch } from "@/app/store";
import {
  crosswordGameFetchStatus,
  crossworGamedActions,
  finishAttempt,
  ICrosswordGameSlice,
} from "@/app/store/crosswordGameSlice";
import { faFlagCheckered, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const EndGameButton = () => {
  const dispatch = useDispatch<AppDispatch>();

  const finishAttemptHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    dispatch(crossworGamedActions.setShowEndGameModal(true));
  };

  // useEffect(() => {
  //   if (
  //     finishAttemptStatus === crosswordGameFetchStatus.Resolve ||
  //     finishAttemptStatus === crosswordGameFetchStatus.Error
  //   ) {
  //     setTimeout(() => {
  //       dispatch(crossworGamedActions.setFinishAttemptStatusToReady());
  //     }, 5000);
  //   }
  // }, [finishAttemptStatus]);
  return (
    <>
      <div className=" flex justify-center items-center">
        <div
          onClick={finishAttemptHandler}
          className={` cursor-pointer w-2/4 px-4 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
        >
          <div className=" flex flex-col">
            <div className=" flex flex-col gap-2">
              <div className=" flex flex-row justify-center items-center">
                <div className=" flex justify-center items-center">
                  <FontAwesomeIcon className="fa-fw fa-2x" icon={faFlagCheckered} />
                </div>
                <h1 className=" font-light text-2xl text-center grow pl-1 py-2 my-2">
                  Закончить попытку
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EndGameButton;
