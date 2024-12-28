import { AppDispatch } from "@/app/store/index";
import { getCurrentUserCrosswordAndSetInState } from "@/app/store/crosswordSlice";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessBoard, faTrophy } from "@fortawesome/free-solid-svg-icons";
import {
  crosswordGameFetchStatus,
  crosswordGameSlice,
  ICrosswordGameSlice,
  setAvailableCrosswordGame,
} from "@/app/store/crosswordGameSlice";
import { redirect } from "next/navigation";
import { IAppSlice } from "@/app/store/appStateSlice";

interface ICrosswordCard {
  crosswordData: {
    _id: string;
    name: string;
    iserId: string;
    changeDate: Date;
  };
}

const AvailableCrosswordGameCard = ({ crosswordData }: ICrosswordCard) => {
  const dispatch = useDispatch<AppDispatch>();

  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  const loadCrosswordGameStatus = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.fetchAvailableCrosswordGamesStatus
  );
  const crossword = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordGame
  );
  const loadCrosswordGameHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (loadCrosswordGameStatus !== crosswordGameFetchStatus.Ready) {
      return;
    }
    // dispatch(getCurrentUserCrosswordAndSetInState(crosswordData._id));
    dispatch(
      setAvailableCrosswordGame({
        telegramUserID: telegramUser?.id,
        crosswordID: String(crosswordData._id),
      })
    );
  };

  return (
    <div className=" flex flex-col justify-center items-center ">
      <article
        onClick={loadCrosswordGameHandler}
        className={` ${loadCrosswordGameStatus === crosswordGameFetchStatus.Ready ? "cursor-pointer" : ""} w-10/12  px-2 mx-4  hover:scale-105 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
      >
        <div className=" flex flex-col">
          <div className=" flex flex-col gap-2">
            <div className=" flex flex-col justify-center items-center">
              <div className=" text-slate-800 flex justify-center items-center pt-5 h-14 w-14">
                <FontAwesomeIcon className="fa-fw fa-2x" icon={faTrophy} />
              </div>
              <h1 className=" text-center grow text-2xl text font-bold pl-1 py-2 my-2 sm:py-8 sm:my-8">
                {crosswordData.name}
              </h1>
            </div>
            <div className=" flex flex-row justify-around">
              {/* <p
              className={` ${crosswordData.isCompleted ? "bg-green-800" : "bg-isolatedColour"} self-center py-1 px-2 rounded-md text-cyan-50`}
            >
              {crosswordData.isCompleted ? "Опубликован" : "В работе"}
            </p> */}
            </div>
          </div>
          <div className=" flex flex-row justify-center"></div>
          <div className=" flex flex-col">
            {/* <div className=" self-end pt-1">
            Изменено:{" "}
            <span className=" text-sm font-bold">
              {new Date(crosswordData.changeDate).toLocaleDateString()}
            </span>
          </div> */}
          </div>
          {/* <button
          onClick={loadCrosswordHandler}
          className=" mx-2 my-4 py-2 bg-mainColor hover:bg-mainGroupColour rounded-md"
        >
          Загрузить кроссворд
        </button> */}
        </div>
      </article>
    </div>
  );
};

export default AvailableCrosswordGameCard;
