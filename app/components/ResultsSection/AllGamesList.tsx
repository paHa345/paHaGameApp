import { AppDispatch } from "@/app/store";
import { attemptsFetchStatus, getAllGamesList, IAttemptsSlice } from "@/app/store/attemptsSlice";
import { useTelegram } from "@/app/telegramProvider";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GameListElement from "./GameListElement";
import LoadGameListElement from "./LoadGameListElement";

const AllGamesList = () => {
  const { user } = useTelegram();
  const dispatch = useDispatch<AppDispatch>();
  const gamesList = useSelector((state: IAttemptsSlice) => state.attemptsState.gamesList);
  const fetchGamesListStatus = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.setGamesListFetchStatus
  );

  const gamesElements = gamesList?.map((game) => {
    return <GameListElement gameData={game}></GameListElement>;
  });

  console.log(gamesElements);

  console.log(user);
  useEffect(() => {
    if (!user?.id) {
      dispatch(getAllGamesList(777777));
    } else {
      dispatch(getAllGamesList(user?.id));
    }
  }, []);

  return (
    <>
      {fetchGamesListStatus === attemptsFetchStatus.Loading && (
        <div>
          <div>
            <h1 className=" py-3 text-2xl">Список игр загружается ...</h1>
          </div>
          <LoadGameListElement></LoadGameListElement>
        </div>
      )}

      {fetchGamesListStatus === attemptsFetchStatus.Resolve && (
        <div className=" flex flex-col justify-center items-center">
          <div>
            <h1 className=" py-3 text-2xl">Список игр</h1>
          </div>
          <div className=" grid gap-2 grid-cols-1 sm:grid-cols-3">{gamesElements}</div>
        </div>
      )}
      {/* <div>{gamesElements}</div> */}
    </>
  );
};

export default AllGamesList;
