import { AppDispatch } from "@/app/store";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  crossworGamedActions,
  getAvailableCrosswords,
  ICrosswordGameSlice,
} from "@/app/store/crosswordGameSlice";
import { attemptsActions, getGameAllAttempts, IAttemptsSlice } from "@/app/store/attemptsSlice";
import { IAppSlice } from "@/app/store/appStateSlice";

const ResultPaginationMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  const attemptsListCurrentPage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.attemptsListCurrentPage
  );

  const currentGameID = useSelector((state: IAttemptsSlice) => state.attemptsState.currentGameID);

  const isAttemptsListLastPage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.isLastAttemptsListPage
  );
  const attemptsLimitOnPage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.attemptsLimitOnPage
  );

  const showPrevNextPageAttemptsHandler = function (
    this: {
      transition: string;
    },
    e: React.MouseEvent<HTMLDivElement>
  ) {
    e.preventDefault();
    if (this.transition === "next" && !isAttemptsListLastPage && currentGameID) {
      dispatch(attemptsActions.setAttemptsListTransitionClasses("games-list-left"));
      //   dispatch(getAvailableCrosswords({ page: attemptsListCurrentPage + 1 }));

      dispatch(
        getGameAllAttempts({
          gameID: currentGameID,
          telegramUserID: telegramUser?.id,
          page: attemptsListCurrentPage + 1,
          limit: attemptsLimitOnPage,
        })
      );
    }
    if (this.transition === "prev" && attemptsListCurrentPage > 1 && currentGameID) {
      dispatch(attemptsActions.setAttemptsListTransitionClasses("games-list-right"));
      dispatch(getAvailableCrosswords({ page: attemptsListCurrentPage - 1 }));
      dispatch(
        getGameAllAttempts({
          gameID: currentGameID,
          telegramUserID: telegramUser?.id,
          page: attemptsListCurrentPage - 1,
          limit: attemptsLimitOnPage,
        })
      );
    }
  };
  return (
    <div className=" my-5 flex w-full justify-around items-center">
      <div
        onClick={showPrevNextPageAttemptsHandler.bind({ transition: "prev" })}
        className={` transition-all  ${attemptsListCurrentPage === 1 ? "  opacity-20" : "hover:shadow-crosswordGameCellMenuButtonActive cursor-pointer hover:bg-slate-500 hover:text-slate-50"} shadow-crosswordGameCellMenuButton ml-5 bg-slate-300 px-3 py-1 rounded-lg  `}
      >
        <FontAwesomeIcon className="fa-2x" icon={faChevronLeft}></FontAwesomeIcon>
      </div>
      <div
        onClick={showPrevNextPageAttemptsHandler.bind({ transition: "next" })}
        className={` transition-all   shadow-crosswordGameCellMenuButton ${isAttemptsListLastPage ? " opacity-20" : "cursor-pointer  hover:shadow-crosswordGameCellMenuButtonActive  hover:bg-slate-500 hover:text-slate-50 "} mr-5 ml-5 bg-slate-300 px-3 py-1 rounded-lg`}
      >
        <FontAwesomeIcon className="fa-2x" icon={faChevronRight}></FontAwesomeIcon>
      </div>
    </div>
  );
};

export default ResultPaginationMain;
