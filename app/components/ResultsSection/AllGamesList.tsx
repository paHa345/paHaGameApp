import { AppDispatch } from "@/app/store";
import {
  attemptsActions,
  attemptsFetchStatus,
  getAllGamesList,
  getGameAllAttempts,
  IAttemptsSlice,
} from "@/app/store/attemptsSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GameListElement from "./GameListElement";
import LoadGameListElement from "./LoadGameListElement";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";

import { CSSTransition } from "react-transition-group";
import GamesListPaginationMain from "./GamesListPaginationMain";
import { IAppSlice } from "@/app/store/appStateSlice";
import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { IUserSlice } from "@/app/store/userSlice";

const AllGamesList = () => {
  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  const dispatch = useDispatch<AppDispatch>();
  const gamesList = useSelector((state: IAttemptsSlice) => state.attemptsState.gamesList);
  const fetchGamesListStatus = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.setGamesListFetchStatus
  );
  const fetchGamesListErrorMessage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.getAllGamesErrorMessage
  );
  const gamesName = useSelector((state: IAttemptsSlice) => state.attemptsState.selectedGamesName);

  const showHideGamesList = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.showHideGamesList
  );

  const gameData = useSelector((state: IUserSlice) => state.userState.currentGameType);

  const nodeRef = useRef(null);

  const gameAllAttemptsData = useSelector(
    (state: IAttemptsSlice) => state.attemptsState?.gameAllAttempts
  );

  let selectedGameListID: string | undefined;

  if (gameAllAttemptsData && gameAllAttemptsData.length > 0) {
    gamesName === "Crossword"
      ? (selectedGameListID = gameAllAttemptsData[0].crosswordID)
      : (selectedGameListID = gameAllAttemptsData[0].GTSGameID);
  }

  // gameAllAttemptsData && gameAllAttemptsData.length > 0
  //   ? gameAllAttemptsData[0].GTSGameID
  //   : undefined;

  const gamesElements = gamesList?.map((game) => {
    const isSelected = game._id === selectedGameListID;
    return (
      <GameListElement isSelected={isSelected} key={game._id} gameData={game}></GameListElement>
    );
  });
  const currentUserCompletedCrosswordAttempt = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.currentUserCompletedAttempt
  );

  const currentUserCompletedGTSGameAttempt = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentUserCompletedGTSAttempt
  );

  const gamesListTransitionClasses = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.gamesListTransitionClasses
  );

  const attemptsLimitOnPage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.attemptsLimitOnPage
  );

  useEffect(() => {
    dispatch(getAllGamesList({ telegramID: telegramUser?.id, page: 1, gamesName: gameData }));

    // if (!user?.id) {
    //   dispatch(getAllGamesList({ telegramID: 777777, page: 1 }));
    // } else {
    //   dispatch(getAllGamesList({ telegramID: user?.id, page: 1 }));
    // }
    dispatch(attemptsActions.setCurrentGameID(undefined));
  }, []);

  useEffect(() => {
    if (currentUserCompletedCrosswordAttempt) {
      dispatch(
        getGameAllAttempts({
          gameID: currentUserCompletedCrosswordAttempt.crosswordID,
          telegramUserID: telegramUser?.id,
          page: 1,
          limit: attemptsLimitOnPage,
          gamesName: gamesName,
        })
      );
    }

    if (currentUserCompletedGTSGameAttempt) {
      dispatch(
        getGameAllAttempts({
          gameID: currentUserCompletedGTSGameAttempt.GTSGameID,
          telegramUserID: telegramUser?.id,
          page: 1,
          limit: attemptsLimitOnPage,
          gamesName: gameData,
        })
      );
    }
  }, [currentUserCompletedCrosswordAttempt, currentUserCompletedGTSGameAttempt]);
  useEffect(() => {
    console.log(gameData);
  }, []);

  const gamesListCurrentPage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.gamesListCurrentPage
  );

  const isGamesListLastPage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.isLastGamesListPage
  );

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [toucLength, setToucLength] = useState(0);

  const minSwipeDistance = 25;

  const touchStartHandler = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const touchMoveHandler = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setToucLength(touchEnd - touchStart);
  };
  const touchEndHandler = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart || !touchEnd) return;
    setToucLength(0);

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe) {
      if (isLeftSwipe && !isGamesListLastPage) {
        dispatch(attemptsActions.setGamesListTransitionClasses("games-list-left"));
        dispatch(
          getAllGamesList({
            telegramID: telegramUser?.id,
            page: gamesListCurrentPage + 1,
            gamesName: gamesName,
          })
        );

        // if (!user?.id) {
        //   dispatch(getAllGamesList({ telegramID: 777777, page: gamesListCurrentPage + 1 }));
        // } else {
        //   dispatch(getAllGamesList({ telegramID: user?.id, page: gamesListCurrentPage + 1 }));
        // }
      }
      if (isRightSwipe && gamesListCurrentPage > 1) {
        dispatch(attemptsActions.setGamesListTransitionClasses("games-list-right"));
        dispatch(
          getAllGamesList({
            telegramID: telegramUser?.id,
            page: gamesListCurrentPage - 1,
            gamesName: gamesName,
          })
        );

        // if (!user?.id) {
        //   dispatch(getAllGamesList({ telegramID: 777777, page: gamesListCurrentPage - 1 }));
        // } else {
        //   dispatch(getAllGamesList({ telegramID: user?.id, page: gamesListCurrentPage - 1 }));
        // }
      }
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
          <div
            style={{
              transform: `translateX(${toucLength > 0 ? "5" : `${toucLength < 0 ? "-5" : "0"}`}%)`,
            }}
            className=" w-full swipeContainer transition-all duration-500  ease-in-out"
            onTouchStart={touchStartHandler}
            onTouchMove={touchMoveHandler}
            onTouchEnd={touchEndHandler}
          >
            <div className=" overflow-hidden py-4 px-6 w-full min-h-56">
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
                    <div className="justify-center grid items-centergrid gap-4 grid-cols-1 sm:grid-cols-3 pb-5">
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
