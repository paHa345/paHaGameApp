import { AppDispatch } from "@/app/store";
import { crossworGamedActions } from "@/app/store/crosswordGameSlice";
import { useTelegram } from "@/app/telegramProvider";
import { faClose, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch } from "react-redux";

const StartGameModalMain = () => {
  const { user, webApp } = useTelegram();
  const dispatch = useDispatch<AppDispatch>();

  const startGameHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("Start Game");
    if (!user) {
      alert("Вы не авторизованы в Telegram. Авторизуйтесь и попробуйте снова.");
      return;
    }
    dispatch(crossworGamedActions.setStartGameStatus(true));
  };

  return (
    <div
      // onClick={hideLoadCrosswordGameModalHandler}
      className="modal-overlay"
    >
      <div className=" modal-wrapper">
        <div className="modal">
          <div className="modal-header">
            {/* <LoadCrosswordGameNotification></LoadCrosswordGameNotification> */}

            {user && (
              <div className=" text-2xl pb-4">
                <h2>Welcome, {user?.username}!</h2>
                <h3>Your Telegram ID: {user?.id}</h3>
              </div>
            )}

            {!user && (
              <div className=" text-2xl pb-4">
                <h2>Приветствуем, anonimous!</h2>
                <h3>Ваш Telegram ID: ???????</h3>
              </div>
            )}

            {/* <a
              className={` ${loadCrosswordGameStatus === crosswordGameFetchStatus.Loading ? "opacity-0" : ""} bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200`}
              onClick={hideLoadCrosswordGameModalHandler}
              href=""
            >
              <FontAwesomeIcon className=" fa-2x" icon={faXmark} />
            </a> */}
          </div>

          {/* {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Resolve &&
            crosswordCardsEl.length === 0 && (
              <div className=" overflow-auto">
                <h1 className=" text-center">Нет доступных кроссвордов</h1>
              </div>
            )}
          {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Resolve && (
            <div className=" pt-4 sm:grid lg:grid-cols-3 sm:grid-cols-2 gap-6 justify-center items-center overflow-auto h-5/6">
              {crosswordCardsEl}
            </div>
          )}
          {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Loading && (
            <div className=" flex justify-center items-center h-5/6">
              <LoadindAvailableCrosswordGameCards></LoadindAvailableCrosswordGameCards>
            </div>
          )}
          {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Error && (
            <p>Не удалось загрузить список. Повторите попытку позднее</p>
          )} */}

          <div className=" h-3/5 flex flex-col flex-wrap gap-3 justify-center items-center">
            <div
              onClick={startGameHandler}
              className={` cursor-pointer w-full px-4 hover:scale-105 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
            >
              <div className=" flex flex-col">
                <div className=" flex flex-col gap-2">
                  <div className=" flex flex-col justify-center items-center">
                    <div className=" flex justify-center items-center pt-10 h-10 w-10">
                      <FontAwesomeIcon className="fa-fw fa-3x" icon={faTrophy} />
                    </div>
                    <h1 className=" text-4xl text-center grow font-bold pl-1 py-2 my-2">
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

          {/* <AddExercisesSection></AddExercisesSection> */}
          <div className="modal-body"></div>
        </div>
      </div>
    </div>
  );
};

export default StartGameModalMain;
