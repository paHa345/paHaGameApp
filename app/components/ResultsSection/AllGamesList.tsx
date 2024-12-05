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
  const fetchGamesListErrorMessage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.getAllGamesErrorMessage
  );

  const gamesElements = gamesList?.map((game) => {
    return <GameListElement key={game._id} gameData={game}></GameListElement>;
  });

  console.log(gamesElements);

  console.log(user?.photo_url);
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

      {fetchGamesListStatus === attemptsFetchStatus.Error && (
        <div>
          <div className=" flex justify-center items-center h-full ">
            <h1 className=" px-2 my-10  font-bold  transition-all rounded-lg ease-in-out delay-50 bg-gradient-to-tr from-secoundaryColor to-red-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow py-10 text-center text-2xl">
              Внимание... <span>{fetchGamesListErrorMessage}</span>
            </h1>
          </div>
        </div>
      )}
    </>
  );
};

export default AllGamesList;
