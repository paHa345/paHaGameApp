import { AppDispatch } from "@/app/store";
import { attemptsActions, getAllGamesList, IAttemptsSlice } from "@/app/store/attemptsSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  crossworGamedActions,
  getAvailableCrosswords,
  ICrosswordGameSlice,
} from "@/app/store/crosswordGameSlice";

const AvailableCrosswordPaginationMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const crosswordsListCurrentPage = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordsListCurrentPage
  );

  const iscrosswordsListLastPage = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.isLastCrosswordsListPage
  );

  const showPrevNextPageCrosswordsHandler = function (
    this: {
      transition: string;
    },
    e: React.MouseEvent<HTMLDivElement>
  ) {
    e.preventDefault();
    if (this.transition === "next" && !iscrosswordsListLastPage) {
      dispatch(crossworGamedActions.setCrosswordsListTransitionClasses("games-list-left"));
      dispatch(getAvailableCrosswords({ page: crosswordsListCurrentPage + 1 }));
    }
    if (this.transition === "prev" && crosswordsListCurrentPage > 1) {
      dispatch(crossworGamedActions.setCrosswordsListTransitionClasses("games-list-right"));
      dispatch(getAvailableCrosswords({ page: crosswordsListCurrentPage - 1 }));
    }
  };

  return (
    <div className=" my-5 flex w-full justify-around items-center">
      <div
        onClick={showPrevNextPageCrosswordsHandler.bind({ transition: "prev" })}
        className={` transition-all  ${crosswordsListCurrentPage === 1 ? "  opacity-20" : "hover:shadow-crosswordGameCellMenuButtonActive cursor-pointer hover:bg-slate-500 hover:text-slate-50"} shadow-crosswordGameCellMenuButton ml-5 bg-slate-300 px-3 py-1 rounded-lg  `}
      >
        <FontAwesomeIcon className="fa-2x" icon={faChevronLeft}></FontAwesomeIcon>
      </div>
      <div
        onClick={showPrevNextPageCrosswordsHandler.bind({ transition: "next" })}
        className={` transition-all   shadow-crosswordGameCellMenuButton ${iscrosswordsListLastPage ? " opacity-20" : "cursor-pointer  hover:shadow-crosswordGameCellMenuButtonActive  hover:bg-slate-500 hover:text-slate-50 "} mr-5 ml-5 bg-slate-300 px-3 py-1 rounded-lg`}
      >
        <FontAwesomeIcon className="fa-2x" icon={faChevronRight}></FontAwesomeIcon>
      </div>
    </div>
  );
};

export default AvailableCrosswordPaginationMain;
