import { AppDispatch } from "@/app/store";
import { attemptsActions, getGameAllAttempts } from "@/app/store/attemptsSlice";
import { useTelegram } from "@/app/telegramProvider";
import React from "react";
import { useDispatch } from "react-redux";

interface IGameDataProps {
  gameData: {
    _id: string;
    name: string;
    changeDate: Date;
  };
}

const GameListElement = ({ gameData }: IGameDataProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useTelegram();
  const loadGameAttemptsHandler = (e: React.MouseEvent<HTMLElement>) => {
    // Add your code here to load game attempts
    // Example: dispatch(loadGameAttempts(gameData.id));
    console.log(gameData);
    if (!user?.id) {
      dispatch(
        getGameAllAttempts({
          gameID: gameData._id,
          telegramUserID: 777777,
        })
      );
    } else {
      dispatch(
        getGameAllAttempts({
          gameID: gameData._id,
          telegramUserID: user?.id,
        })
      );
    }
  };
  return (
    <article
      onClick={loadGameAttemptsHandler}
      // ${loadCrosswordGameStatus === crosswordGameFetchStatus.Ready ? "cursor-pointer" : ""}
      className={` cursor-pointer
    px-4 mx-4  hover:scale-105 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
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
