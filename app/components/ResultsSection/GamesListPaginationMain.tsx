import { AppDispatch } from "@/app/store";
import { attemptsActions, getAllGamesList, IAttemptsSlice } from "@/app/store/attemptsSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { IAppSlice } from "@/app/store/appStateSlice";

const GamesListPaginationMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  const gamesName = useSelector((state: IAttemptsSlice) => state.attemptsState.selectedGamesName);

  const gamesListCurrentPage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.gamesListCurrentPage
  );

  const isGamesListLastPage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.isLastGamesListPage
  );

  const showPrevNextPageGamesHandler = function (
    this: {
      transition: string;
    },
    e: React.MouseEvent<HTMLDivElement>
  ) {
    e.preventDefault();
    if (this.transition === "next" && !isGamesListLastPage) {
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
      //   dispatch(getAllGamesList({ telegramID: telegramUser?.id, page: gamesListCurrentPage + 1 }));
      // }
    }
    if (this.transition === "prev" && gamesListCurrentPage > 1) {
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
      //   dispatch(getAllGamesList({ telegramID: telegramUser?.id, page: gamesListCurrentPage - 1 }));
      // }
    }
  };
  return (
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
  );
};

export default GamesListPaginationMain;
