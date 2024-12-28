import { AppDispatch } from "@/app/store";
import {
  crosswordGameFetchStatus,
  crossworGamedActions,
  finishAttempt,
  ICrosswordGameSlice,
} from "@/app/store/crosswordGameSlice";
import { faClose, faFlagCheckered, faSpinner, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isTelegramWebApp } from "../Layout/MainLayout";
import { useRouter } from "next/navigation";
import { IAppSlice } from "@/app/store/appStateSlice";

const EndGameModalMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  const attemptID = useSelector((state: ICrosswordGameSlice) => state.crosswordGameState.attemptID);
  const crosswordGameId = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame._id
  );

  const finishAttemptStatus = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.finishAttemptStatus
  );

  const currentAttemptCrossword = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame.crosswordObj
  );
  const finishAttemptHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const attemptData = {
      attemptID: attemptID,
      telegramUser: telegramUser?.username,
      telegramID: telegramUser?.id,
      crossword: currentAttemptCrossword,
      crosswordID: crosswordGameId,
      userPhoto: telegramUser?.photo_url,
      firstName: telegramUser?.first_name,
      lastName: telegramUser?.last_name,
    };
    dispatch(finishAttempt(attemptData));

    // if (!user) {
    //   const attemptData = {
    //     attemptID: attemptID,
    //     telegramUser: "paHa345",
    //     telegramID: 7777777,
    //     crossword: currentAttemptCrossword,
    //     crosswordID: crosswordGameId,
    //   };
    //   dispatch(finishAttempt(attemptData));

    //   //   window.localStorage.removeItem("currentCrosswordGame");
    //   //   window.localStorage.removeItem("currentAttemptID");
    // } else {
    //   const attemptData = {
    //     attemptID: attemptID,
    //     telegramUser: user?.username,
    //     telegramID: user?.id,
    //     crossword: currentAttemptCrossword,
    //     crosswordID: crosswordGameId,
    //     userPhoto: user.photo_url,
    //     firstName: user?.first_name,
    //     lastName: user?.last_name,
    //   };

    //   dispatch(finishAttempt(attemptData));

    // }
    setTimeout(() => {
      router.push("/results");
    }, 1000);

    // Dispatch action to finish the current attempt and update the state
    // Example: dispatch(searchExerciseActions.finishAttempt());
  };

  const hideEndGameModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(crossworGamedActions.setShowEndGameModal(false));
  };

  useEffect(() => {
    // console.log(isTelegramWebApp());
    // if (isTelegramWebApp()) {
    //   document.body.style.overflow = "hidden";
    // } else {
    //   document.body.style.overflow = "auto";
    // }

    if (
      finishAttemptStatus === crosswordGameFetchStatus.Resolve ||
      finishAttemptStatus === crosswordGameFetchStatus.Error
    ) {
      let timer = setTimeout(() => {
        dispatch(crossworGamedActions.setFinishAttemptStatusToReady());
      }, 5000);
      return () => {
        clearTimeout(timer);
        dispatch(crossworGamedActions.setFinishAttemptStatusToReady());
      };
    }
    if (finishAttemptStatus === crosswordGameFetchStatus.Loading) {
      return;
    }
    dispatch(crossworGamedActions.setFinishAttemptStatusToReady());
  }, [finishAttemptStatus]);

  return (
    <div
      // onClick={hideLoadCrosswordGameModalHandler}
      className="modal-overlay"
    >
      <div className=" small-modal-wrapper">
        <div className="modal justify-center items-center flex">
          <div className="small-modal-header ">
            {/* <LoadCrosswordGameNotification></LoadCrosswordGameNotification> */}

            <div className=" h-3/5 flex flex-col flex-wrap gap-3 justify-center items-center">
              {finishAttemptStatus === crosswordGameFetchStatus.Error && (
                <div
                  className={` px-4   bg-gradient-to-tr from-secoundaryColor to-red-400 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
                >
                  <div className=" flex flex-col">
                    <div className=" flex flex-col gap-2">
                      <div className=" flex flex-row justify-center items-center">
                        <h1 className=" text-base text-center grow font-bold pl-1 py-2 my-2 ">
                          Не удалось отправить данные. Повторите попытку позже
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {finishAttemptStatus === crosswordGameFetchStatus.Ready && (
                <div
                  onClick={finishAttemptHandler}
                  className={` cursor-pointer w-full px-4 hover:scale-105 duration-200 rounded-lg ease-in hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
                >
                  <div className=" flex flex-col">
                    <div className=" flex flex-col gap-2">
                      <div className=" flex flex-col justify-center items-center">
                        <h1 className=" font-light text-2xl text-center grow pl-1 py-2 my-2">
                          Закончить попытку
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {finishAttemptStatus === crosswordGameFetchStatus.Loading && (
                <div
                  className={` w-full px-4 hover:scale-105 duration-200 rounded-lg ease-in hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
                >
                  <div className=" flex flex-col">
                    <div className=" flex flex-col gap-2">
                      <div className=" py-4 flex justify-center items-center">
                        <FontAwesomeIcon className=" animate-spin fa-fw fa-3x" icon={faSpinner} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div
                onClick={hideEndGameModal}
                className={` cursor-pointer  px-4  hover:scale-105 duration-200 rounded-lg ease-in hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-red-400 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
              >
                <div className=" flex flex-col">
                  <div className=" flex flex-col gap-2">
                    <div className=" flex flex-row justify-center items-center">
                      <div className=" flex justify-center items-center">
                        <FontAwesomeIcon className="fa-fw fa-2x" icon={faClose} />
                      </div>
                      <h1 className=" text-xl text-center grow font-bold pl-1 py-2 my-2 ">
                        Отмена
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Resolve &&
          crosswordCardsEl.length === 0 && (
            <div className=" overflow-auto">
              <h1 className=" text-center">Нет доступных кроссвордов</h1>
            </div>
          )} */}
          {/* {createStartAttemptStatus === crosswordGameFetchStatus.Resolve && (
          <div className=" pt-4 sm:grid lg:grid-cols-3 sm:grid-cols-2 gap-6 justify-center items-center overflow-auto h-5/6">
            {crosswordCardsEl}
          </div>
        )} */}
          {/* {createStartAttemptStatus === crosswordGameFetchStatus.Loading && (
          <div className=" flex justify-center items-center h-5/6">
            <StartGameLoadingCard></StartGameLoadingCard>
          </div>
        )}
        {createStartAttemptStatus === crosswordGameFetchStatus.Error && (
          <div className="px-2 py-2 flex justify-center items-center rounded-lg bg-gradient-to-tr from-secoundaryColor to-red-400 shadow-exerciseCardShadow">
            <h1 className=" text-center">Не удалось загрузить данные. Повторите попытку позже</h1>
          </div>
        )} */}

          {/* <AddExercisesSection></AddExercisesSection> */}
          <div className="modal-body"></div>
        </div>
      </div>
    </div>
  );
};

export default EndGameModalMain;
