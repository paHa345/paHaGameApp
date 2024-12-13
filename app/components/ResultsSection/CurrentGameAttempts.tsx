import { attemptsFetchStatus, getGameAllAttempts, IAttemptsSlice } from "@/app/store/attemptsSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Attempt from "./Attempt";
import AttemptLoadCard from "./AttemptLoadCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal } from "@fortawesome/free-solid-svg-icons";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import { useTelegram } from "@/app/telegramProvider";
import { AppDispatch } from "@/app/store";

const CurrentGameAttempts = () => {
  const { user } = useTelegram();
  const dispatch = useDispatch<AppDispatch>();

  const getGameAllAttemptsStatus = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.getGameAllAttemptsFetchStatus
  );

  const gameAllAttemptsData = useSelector(
    (state: IAttemptsSlice) => state.attemptsState?.gameAllAttempts
  );

  const gameAllAttemptsEl = gameAllAttemptsData?.map((attempt) => {
    return <Attempt key={attempt._id} attempt={attempt}></Attempt>;
  });

  return (
    <>
      {getGameAllAttemptsStatus === attemptsFetchStatus.Resolve &&
        gameAllAttemptsEl?.length !== 0 && (
          <div className=" w-full my-4 flex flex-row gap-3 justify-center items-center bg-gradient-to-tr  from-secoundaryColor to-crosswordSecoundaryColor rounded-sm px-4 shadow-exerciseCardHowerShadow">
            <FontAwesomeIcon
              // style={{ color: "#0b4905", backgroundColor: "#9af792" }}
              className=" py-2 my-2 rounded-lg fa-fw fa-2xl"
              icon={faMedal}
            />
            <h1 className="text-2xl font-bold ">Список лидеров</h1>
          </div>
        )}
      {getGameAllAttemptsStatus === attemptsFetchStatus.Loading && (
        <div className=" py-5">
          <AttemptLoadCard></AttemptLoadCard>
        </div>
      )}

      {gameAllAttemptsEl?.length === 0 &&
        getGameAllAttemptsStatus !== attemptsFetchStatus.Loading && (
          <h1 className=" py-5 text-2xl font-bold underline underline-offset-4">Нет попыток</h1>
        )}
      {getGameAllAttemptsStatus === attemptsFetchStatus.Resolve && (
        <div className=" w-full sm:w-2/3">{gameAllAttemptsEl}</div>
      )}
    </>
  );
};

export default CurrentGameAttempts;
