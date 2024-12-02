import { attemptsFetchStatus, IAttemptsSlice } from "@/app/store/attemptsSlice";
import React from "react";
import { useSelector } from "react-redux";
import Attempt from "./Attempt";
import AttemptLoadCard from "./AttemptLoadCard";

const CurrentGameAttempts = () => {
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
      {getGameAllAttemptsStatus === attemptsFetchStatus.Loading && (
        <div>
          <AttemptLoadCard></AttemptLoadCard>
        </div>
      )}

      {gameAllAttemptsEl?.length === 0 &&
        getGameAllAttemptsStatus !== attemptsFetchStatus.Loading && <h1>Нет попыток</h1>}
      {getGameAllAttemptsStatus !== attemptsFetchStatus.Loading && <div>{gameAllAttemptsEl}</div>}
    </>
  );
};

export default CurrentGameAttempts;
