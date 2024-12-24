import {
  attemptsActions,
  attemptsFetchStatus,
  getGameAllAttempts,
  IAttemptsSlice,
} from "@/app/store/attemptsSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Attempt from "./Attempt";
import AttemptLoadCard from "./AttemptLoadCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal } from "@fortawesome/free-solid-svg-icons";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import { useTelegram } from "@/app/telegramProvider";
import { AppDispatch } from "@/app/store";
import ResultPaginationMain from "./ResultPaginationMain";
import { CSSTransition } from "react-transition-group";

const CurrentGameAttempts = () => {
  const { user } = useTelegram();
  const dispatch = useDispatch<AppDispatch>();

  const attemptsRef = useRef(null);

  const getGameAllAttemptsStatus = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.getGameAllAttemptsFetchStatus
  );
  const showHideAttemptsList = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.showHideAttemptsList
  );

  const attemptsListCurrentPage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.attemptsListCurrentPage
  );

  const attemptsListTransitionClasses = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.attemptsListTransitionClasses
  );

  const isAttemptsListLastPage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.isLastAttemptsListPage
  );

  const currentGameID = useSelector((state: IAttemptsSlice) => state.attemptsState.currentGameID);

  const gameAllAttemptsData = useSelector(
    (state: IAttemptsSlice) => state.attemptsState?.gameAllAttempts
  );

  const gameAllAttemptsEl = gameAllAttemptsData?.map((attempt) => {
    return <Attempt key={attempt._id} attempt={attempt}></Attempt>;
  });

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
      if (isLeftSwipe && !isAttemptsListLastPage && currentGameID) {
        dispatch(attemptsActions.setGamesListTransitionClasses("games-list-left"));
        if (!user?.id) {
          dispatch(
            getGameAllAttempts({
              gameID: currentGameID,
              telegramUserID: 777777,
              page: attemptsListCurrentPage + 1,
            })
          );
        } else {
          dispatch(
            getGameAllAttempts({
              gameID: currentGameID,
              telegramUserID: user?.id,
              page: attemptsListCurrentPage + 1,
            })
          );
        }
      }
      if (isRightSwipe && isAttemptsListLastPage && currentGameID) {
        dispatch(attemptsActions.setGamesListTransitionClasses("games-list-right"));
        if (!user?.id) {
          dispatch(
            getGameAllAttempts({
              gameID: currentGameID,
              telegramUserID: 777777,
              page: attemptsListCurrentPage - 1,
            })
          );
        } else {
          dispatch(
            getGameAllAttempts({
              gameID: currentGameID,
              telegramUserID: user?.id,
              page: attemptsListCurrentPage - 1,
            })
          );
        }
      }
    }
  };

  return (
    <>
      <div className=" w-full shadow-crosswordGameCellMenuButtonActive rounded-lg my-3 mx-3">
        {getGameAllAttemptsStatus === attemptsFetchStatus.Resolve &&
          gameAllAttemptsEl?.length !== 0 && (
            <div className=" h-20 shadow-innerLandShadow  w-full my-4 flex flex-row gap-3 justify-center items-center bg-gradient-to-tr  from-secoundaryColor to-crosswordSecoundaryColor rounded-sm px-4">
              <FontAwesomeIcon
                // style={{ color: "#0b4905", backgroundColor: "#9af792" }}
                className=" py-2 my-2 rounded-lg fa-fw fa-2xl"
                icon={faMedal}
              />
              <h1 className="text-2xl font-bold ">Список лидеров</h1>
            </div>
          )}
        {getGameAllAttemptsStatus === attemptsFetchStatus.Loading && (
          <div className=" h-20 ">
            <AttemptLoadCard></AttemptLoadCard>
          </div>
        )}

        {gameAllAttemptsEl?.length === 0 &&
          getGameAllAttemptsStatus !== attemptsFetchStatus.Loading && (
            <h1 className=" py-5 text-2xl font-bold underline underline-offset-4">Нет попыток</h1>
          )}

        {currentGameID && (
          <div
            style={{
              transform: `translateX(${toucLength > 0 ? "5" : `${toucLength < 0 ? "-5" : "0"}`}%)`,
            }}
            className=" w-full swipeContainer transition-all duration-500  ease-in-out"
            onTouchStart={touchStartHandler}
            onTouchMove={touchMoveHandler}
            onTouchEnd={touchEndHandler}
          >
            {" "}
            <div className=" overflow-hidden overflow-y-scroll  px-3 w-full sm:w-2/3 h-[60vh]  min-h-[60vh]">
              <CSSTransition
                nodeRef={attemptsRef}
                in={showHideAttemptsList}
                timeout={400}
                unmountOnExit
                classNames={attemptsListTransitionClasses}
              >
                <div ref={attemptsRef}>
                  {getGameAllAttemptsStatus === attemptsFetchStatus.Resolve ||
                  getGameAllAttemptsStatus === attemptsFetchStatus.Loading ? (
                    <div className="justify-center grid items-centergrid grid-cols-1 sm:grid-cols-3">
                      {gameAllAttemptsEl}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </CSSTransition>
            </div>
            <ResultPaginationMain></ResultPaginationMain>
          </div>
        )}
      </div>
    </>
  );
};

export default CurrentGameAttempts;
