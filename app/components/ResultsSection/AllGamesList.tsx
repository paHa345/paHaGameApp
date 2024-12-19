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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";

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
  const gamesListCurrentPage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.gamesListCurrentPage
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
  const isGamesListLastPage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.isLastGamesListPage
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

  const showPrevNextPageGamesHandler = function (
    this: {
      transition: string;
    },
    e: React.MouseEvent<HTMLDivElement>
  ) {
    e.preventDefault();
    if (this.transition === "next" && !isGamesListLastPage) {
      setgamesListClasses("games-list-left");
      if (!user?.id) {
        dispatch(getAllGamesList({ telegramID: 777777, page: gamesListCurrentPage + 1 }));
      } else {
        dispatch(getAllGamesList({ telegramID: user?.id, page: gamesListCurrentPage + 1 }));
      }
    }
    if (this.transition === "prev" && gamesListCurrentPage > 1) {
      setgamesListClasses("games-list-right");

      if (!user?.id) {
        dispatch(getAllGamesList({ telegramID: 777777, page: gamesListCurrentPage - 1 }));
      } else {
        dispatch(getAllGamesList({ telegramID: user?.id, page: gamesListCurrentPage - 1 }));
      }
    }
  };

  const [gamesListClasses, setgamesListClasses] = useState("games-list-left");

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
          {fetchGamesListStatus === attemptsFetchStatus.Error && (
            <div>
              <div className=" flex justify-center items-center h-full ">
                <h1 className=" px-2 my-10  font-bold  transition-all rounded-lg ease-in-out delay-50 bg-gradient-to-tr from-secoundaryColor to-red-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow py-10 text-center text-2xl">
                  Внимание... <span>{fetchGamesListErrorMessage}</span>
                </h1>
              </div>
            </div>
          )}
          <div className=" overflow-hidden py-4 px-6 w-full min-h-56">
            <CSSTransition
              nodeRef={nodeRef}
              in={showHideGamesList}
              timeout={400}
              unmountOnExit
              classNames={gamesListClasses}
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
              </div>
            </CSSTransition>
          </div>
        </div>
        <div className=" my-5 flex w-full justify-around items-center">
          <div
            onClick={showPrevNextPageGamesHandler.bind({ transition: "prev" })}
            className={` transition-all  ${gamesListCurrentPage === 1 ? "  opacity-20" : "hover:shadow-crosswordGameCellMenuButtonActive cursor-pointer hover:bg-slate-500 hover:text-slate-50"} shadow-crosswordGameCellMenuButton ml-5 bg-slate-300 px-3 py-1 rounded-lg  `}
          >
            <FontAwesomeIcon className="fa-2x" icon={faChevronLeft}></FontAwesomeIcon>
          </div>
          <div
            onClick={showPrevNextPageGamesHandler.bind({ transition: "next" })}
            className={` transition-all   shadow-crosswordGameCellMenuButton ${isGamesListLastPage ? " opacity-20" : "cursor-pointer  hover:shadow-crosswordGameCellMenuButtonActive  hover:bg-slate-500 hover:text-slate-50 "} mr-5 ml-5 bg-slate-300 px-3 py-1 rounded-lg`}
          >
            <FontAwesomeIcon className="fa-2x" icon={faChevronRight}></FontAwesomeIcon>
          </div>
        </div>
      </div>
      {/* )} */}

      {/* <div>{gamesElements}</div> */}
    </>
  );
};

export default AllGamesList;
