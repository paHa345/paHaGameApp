import { AppDispatch } from "@/app/store";
import { crossworGamedActions } from "@/app/store/crosswordGameSlice";
import { getAvailableGTSGames, IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { IUserSlice } from "@/app/store/userSlice";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const AvailableGRSGamePaginationMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const GTSGameListCurrentPage = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.GTSGamesListCurrentPage
  );

  const isGTSGamesListLastPage = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.isLastGTSGamesListPage
  );

  const gameData = useSelector((state: IUserSlice) => state.userState.gamesData);

  const showPrevNextPageCrosswordsHandler = function (
    this: {
      transition: string;
    },
    e: React.MouseEvent<HTMLDivElement>
  ) {
    e.preventDefault();
    if (this.transition === "next" && !isGTSGamesListLastPage && gameData) {
      dispatch(crossworGamedActions.setCrosswordsListTransitionClasses("games-list-left"));
      dispatch(
        getAvailableGTSGames({
          page: GTSGameListCurrentPage + 1,
          gameType: gameData[window.location.pathname].gameType,
        })
      );
    }
    if (this.transition === "prev" && GTSGameListCurrentPage > 1 && gameData) {
      dispatch(crossworGamedActions.setCrosswordsListTransitionClasses("games-list-right"));
      dispatch(
        getAvailableGTSGames({
          page: GTSGameListCurrentPage - 1,
          gameType: gameData[window.location.pathname].gameType,
        })
      );
    }
  };
  return (
    <div className=" my-5 flex w-full justify-around items-center">
      <div
        onClick={showPrevNextPageCrosswordsHandler.bind({ transition: "prev" })}
        className={` transition-all  ${GTSGameListCurrentPage === 1 ? "  opacity-20" : "hover:shadow-crosswordGameCellMenuButtonActive cursor-pointer hover:bg-slate-500 hover:text-slate-50"} shadow-crosswordGameCellMenuButton ml-5 bg-slate-300 px-3 py-1 rounded-lg  `}
      >
        <FontAwesomeIcon className="fa-2x" icon={faChevronLeft}></FontAwesomeIcon>
      </div>
      <div
        onClick={showPrevNextPageCrosswordsHandler.bind({ transition: "next" })}
        className={` transition-all   shadow-crosswordGameCellMenuButton ${isGTSGamesListLastPage ? " opacity-20" : "cursor-pointer  hover:shadow-crosswordGameCellMenuButtonActive  hover:bg-slate-500 hover:text-slate-50 "} mr-5 ml-5 bg-slate-300 px-3 py-1 rounded-lg`}
      >
        <FontAwesomeIcon className="fa-2x" icon={faChevronRight}></FontAwesomeIcon>
      </div>
    </div>
  );
};

export default AvailableGRSGamePaginationMain;
