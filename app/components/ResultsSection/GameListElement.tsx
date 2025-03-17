import { AppDispatch } from "@/app/store";
import { IAppSlice } from "@/app/store/appStateSlice";
import { attemptsActions, getGameAllAttempts, IAttemptsSlice } from "@/app/store/attemptsSlice";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface IGameDataProps {
  gameData: {
    _id: string;
    name: string;
    changeDate: Date;
  };
  isSelected: boolean;
}

const GameListElement = ({ gameData, isSelected }: IGameDataProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const ganesName = useSelector((state: IAttemptsSlice) => state.attemptsState.selectedGamesName);

  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  const attemptsLimitOnPage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.attemptsLimitOnPage
  );

  const loadGameAttemptsHandler = (e: React.MouseEvent<HTMLElement>) => {
    // Add your code here to load game attempts
    // Example: dispatch(loadGameAttempts(gameData.id));
    console.log(ganesName);
    dispatch(
      getGameAllAttempts({
        gameID: gameData._id,
        telegramUserID: telegramUser?.id,
        page: 1,
        limit: attemptsLimitOnPage,
        gamesName: ganesName,
      })
    );
    // if (!user?.id) {
    //   dispatch(
    //     getGameAllAttempts({
    //       gameID: gameData._id,
    //       telegramUserID: 777777,
    //       page: 1,
    //       limit: attemptsLimitOnPage,
    //     })
    //   );
    // } else {
    //   dispatch(
    //     getGameAllAttempts({
    //       gameID: gameData._id,
    //       telegramUserID: user?.id,
    //       page: 1,
    //       limit: attemptsLimitOnPage,
    //     })
    //   );
    // }
  };

  return (
    <article
      onClick={loadGameAttemptsHandler}
      // ${loadCrosswordGameStatus === crosswordGameFetchStatus.Ready ? "cursor-pointer" : ""}
      className={` cursor-pointer
     w-11/12 px-4 mx-4 ${isSelected ? " scale-110 shadow-crosswordGameCellMenuButtonActive" : "shadow-exerciseCardHowerShadow"} sm:hover:scale-105 transition-all  rounded-lg ease-in-out duration-300 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor ${ganesName === "GTS" ? " to-cyan-200" : "to-lime-200"}  sm:hover:shadow-crosswordGameCellMenuButtonActive`}
    >
      <div className=" flex flex-col">
        <div className=" flex flex-col gap-2">
          <div className=" flex flex-col justify-center items-center">
            <h1 className=" text-center grow text-base text font-bold pl-1 py-1 my-1 sm:py-2 sm:my-2">
              {gameData.name}
            </h1>
          </div>
          <div className=" flex flex-row justify-around"></div>
        </div>
        <div className=" flex flex-row justify-center"></div>
        <div className=" flex flex-col"></div>
      </div>
    </article>
  );
};

export default GameListElement;
