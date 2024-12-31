import { AppDispatch } from "@/app/store";
import {
  createStartAttempt,
  crosswordGameFetchStatus,
  crossworGamedActions,
  ICrosswordGameSlice,
} from "@/app/store/crosswordGameSlice";
import { faClose, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StartGameLoadingCard from "./StartGameLoadingCard";
import { AnimatePresence } from "framer-motion";
import * as motion from "motion/react-client";
import { useRouter } from "next/navigation";
import { IAppSlice } from "@/app/store/appStateSlice";

const StartGameModalMain = () => {
  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  const dispatch = useDispatch<AppDispatch>();
  const crosswordID = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame._id
  );

  const router = useRouter();

  const createStartAttemptStatus = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.createStartAttemptStatus
  );
  const currentCrosswordID = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame._id
  );

  const currentCrosswordGame = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame
  );

  const currentAttemptID = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.attemptID
  );

  const isEndAttempt = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.endAttempt
  );

  const startGame = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.startGameStatus
  );

  const hadeStartGameModalHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(crossworGamedActions.setCrosswordGameID(""));
    localStorage.removeItem("currentCrosswordGame");
    // router.push("/game");
    // dispatch(crossworGamedActions.clearAttemptData());
    // dispatch(crossworGamedActions.clearCurrentUserCompletedAttempt());
  };

  const startGameHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    // if (!user) {
    //   alert("Вы не авторизованы в Telegram. Авторизуйтесь и попробуйте снова.");
    //   return;
    // }

    // заглушка временная
    dispatch(
      createStartAttempt({
        telegramUserName: telegramUser?.username,
        telegramID: telegramUser?.id,
        isCompleted: false,
        crosswordID: currentCrosswordID,
      })
    );
    // if (!user) {
    //   dispatch(
    //     createStartAttempt({
    //       telegramUserName: "paHa",
    //       telegramID: 777777,
    //       isCompleted: false,
    //       crosswordID: currentCrosswordID,
    //     })
    //   );
    // } else {
    //   dispatch(
    //     createStartAttempt({
    //       telegramUserName: user?.username,
    //       telegramID: user?.id,
    //       isCompleted: false,
    //       crosswordID: currentCrosswordID,
    //     })
    //   );
    // }
  };

  useEffect(() => {
    if (createStartAttemptStatus === crosswordGameFetchStatus.Error) {
      setTimeout(() => {
        dispatch(crossworGamedActions.setCreateStartAttemptStatusToReady());
      }, 5000);
    }
  }, [createStartAttemptStatus]);

  const backdropVariant = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        delayChildren: 0.3,
      },
    },
  };

  const modalVariant = {
    hidden: {
      y: "-100vh",
    },
    visible: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
      },
    },
  };

  return (
    <AnimatePresence>
      {!startGame && !isEndAttempt && (
        <motion.div
          onClick={hadeStartGameModalHandler}
          className=" modal-overlay "
          variants={backdropVariant}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className=" w-11/12 h-5/6 flex flex-col bg-modalMainColor rounded-lg"
            variants={modalVariant}
            // initial="hidden"
            // animate="visible"
            // exit="exit"
          >
            <div className="modal-header">
              {/* <LoadCrosswordGameNotification></LoadCrosswordGameNotification> */}

              {telegramUser?.username && (
                <div className=" font-semibold text-2xl pb-4">
                  <h2>Приветствуем, {telegramUser?.username}!</h2>
                  {/* <h3>Ваш Telegram ID: {user?.id}</h3> */}
                </div>
              )}

              {!telegramUser?.username && (
                <div className=" font-mono text-2xl pb-4">
                  <h2>Приветствуем!</h2>
                  {/* <h3>Ваш Telegram ID: ???????</h3> */}
                </div>
              )}
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
            {createStartAttemptStatus === crosswordGameFetchStatus.Loading && (
              <div className=" flex justify-center items-center h-5/6">
                <StartGameLoadingCard></StartGameLoadingCard>
              </div>
            )}
            {createStartAttemptStatus === crosswordGameFetchStatus.Error && (
              <div className="px-2 py-2 flex justify-center items-center rounded-lg bg-gradient-to-tr from-secoundaryColor to-red-400 shadow-exerciseCardShadow">
                <h1 className=" text-center">
                  Не удалось загрузить данные. Повторите попытку позже
                </h1>
              </div>
            )}

            {(createStartAttemptStatus === crosswordGameFetchStatus.Ready ||
              createStartAttemptStatus === crosswordGameFetchStatus.Error) && (
              <div className=" h-3/5 flex flex-col flex-wrap gap-3 justify-center items-center">
                <div
                  onClick={startGameHandler}
                  className={` w-10/12 cursor-pointer px-4 hover:scale-105 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
                >
                  <div className=" flex flex-col">
                    <div className=" flex flex-col gap-2">
                      <div className=" flex flex-col justify-center items-center">
                        <div className=" flex justify-center items-center pt-10 h-10 w-10">
                          <FontAwesomeIcon className="fa-fw fa-3x" icon={faTrophy} />
                        </div>
                        <h1 className=" font-light text-4xl text-center grow pl-1 py-2 my-2">
                          Начать попытку
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
                <a href="/game" className=" w-4/6">
                  <div
                    className={`px-4  hover:scale-105 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-red-400 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
                  >
                    <div className=" flex flex-col">
                      <div className=" flex flex-col gap-2">
                        <div className=" flex flex-col justify-center items-center">
                          <div className=" flex justify-center items-center pt-5 h-6 w-6">
                            <FontAwesomeIcon className="fa-fw fa-2x" icon={faClose} />
                          </div>
                          <h1 className=" text-2xl text-center grow font-bold pl-1 py-2 my-2 ">
                            Назад
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            )}

            {/* <AddExercisesSection></AddExercisesSection> */}
            <div className="modal-body"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartGameModalMain;
