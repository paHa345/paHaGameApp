import { AppDispatch } from "@/app/store";
import {
  attemptsActions,
  attemptsFetchStatus,
  getAllGamesList,
  getGameAllAttempts,
  IAttemptsSlice,
} from "@/app/store/attemptsSlice";
import { useTelegram } from "@/app/telegramProvider";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GameListElement from "./GameListElement";
import LoadGameListElement from "./LoadGameListElement";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";

import { CSSTransition } from "react-transition-group";
import GamesListPaginationMain from "./GamesListPaginationMain";

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

  const showHideGamesList = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.showHideGamesList
  );

  const nodeRef = useRef(null);

  const gameAllAttemptsData = useSelector(
    (state: IAttemptsSlice) => state.attemptsState?.gameAllAttempts
  );

  const selectedGameListID =
    gameAllAttemptsData && gameAllAttemptsData.length > 0
      ? gameAllAttemptsData[0].crosswordID
      : undefined;

  const gamesElements = gamesList?.map((game) => {
    const isSelected = game._id === selectedGameListID;
    return (
      <GameListElement isSelected={isSelected} key={game._id} gameData={game}></GameListElement>
    );
  });
  const currentUserCompletedAttempt = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.currentUserCompletedAttempt
  );

  const gamesListTransitionClasses = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.gamesListTransitionClasses
  );

  useEffect(() => {
    if (!user?.id) {
      dispatch(getAllGamesList({ telegramID: 777777, page: 1 }));
    } else {
      dispatch(getAllGamesList({ telegramID: user?.id, page: 1 }));
    }
  }, []);

  useEffect(() => {
    if (currentUserCompletedAttempt) {
      if (!user?.id) {
        dispatch(
          getGameAllAttempts({
            gameID: currentUserCompletedAttempt.crosswordID,
            telegramUserID: 777777,
          })
        );
      } else {
        dispatch(
          getGameAllAttempts({
            gameID: currentUserCompletedAttempt.crosswordID,
            telegramUserID: user?.id,
          })
        );
      }
    }
  }, [currentUserCompletedAttempt]);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const [swipeNotification, setSwipeNotification] = useState("Start");
  const minSwipeDistance = 50;

  const touchStartHandler = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log("start");
    setTouchEnd(0); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };
  const touchMoveHandler = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log("Move");
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const touchEndHandler = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log("End");
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe) {
      setSwipeNotification(`swipe, ${isLeftSwipe ? "left" : "right"}`);
    }
  };

  return (
    <>
      {/* {fetchGamesListStatus === attemptsFetchStatus.Resolve && ( */}
      <div className=" w-full shadow-crosswordGameCellMenuButtonActive rounded-lg my-3">
        <div className=" w-full flex flex-col justify-center items-center">
          <div className="   w-full  flex  justify-around items-center">
            <h1 className=" py-3 text-2xl">Список игр</h1>
            <div
              className={` transition-all ${fetchGamesListStatus === attemptsFetchStatus.Loading ? " opacity-100 " : "  opacity-0 "} flex justify-center items-center`}
            >
              <LoadGameListElement></LoadGameListElement>
            </div>
          </div>

          <div className=" overflow-hidden py-4 px-6 w-full min-h-56">
            <div
              className=" swipeContainer"
              onTouchStart={touchStartHandler}
              onTouchMove={touchMoveHandler}
              onTouchEnd={touchEndHandler}
            >
              <h1>{swipeNotification}</h1>
              <CSSTransition
                nodeRef={nodeRef}
                in={showHideGamesList}
                timeout={400}
                unmountOnExit
                classNames={gamesListTransitionClasses}
              >
                <div ref={nodeRef}>
                  {fetchGamesListStatus === attemptsFetchStatus.Resolve ||
                  fetchGamesListStatus === attemptsFetchStatus.Loading ? (
                    <div className="justify-center grid items-centergrid gap-4 grid-cols-1 sm:grid-cols-3">
                      {gamesElements}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {fetchGamesListStatus === attemptsFetchStatus.Error && (
                    <div>
                      <div className=" flex justify-center items-center h-full ">
                        <h1 className=" px-2  font-bold  transition-all rounded-lg ease-in-out delay-50 bg-gradient-to-tr from-secoundaryColor to-red-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow py-10 text-center text-xl">
                          Внимание... <span>{fetchGamesListErrorMessage}</span>
                        </h1>
                      </div>
                    </div>
                  )}
                </div>
              </CSSTransition>
            </div>
          </div>
        </div>
        <GamesListPaginationMain></GamesListPaginationMain>
      </div>
      {/* )} */}

      {/* <div>{gamesElements}</div> */}
    </>
  );
};

export default AllGamesList;
