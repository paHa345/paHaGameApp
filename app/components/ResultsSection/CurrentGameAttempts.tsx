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
import { faMedal, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import { AppDispatch } from "@/app/store";
import ResultPaginationMain from "./ResultPaginationMain";
import { CSSTransition } from "react-transition-group";
import { IAppSlice } from "@/app/store/appStateSlice";

const CurrentGameAttempts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

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

  const getAttemptsErrorMessage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.getGameAttemptsErrorMessage
  );

  const currentGameID = useSelector((state: IAttemptsSlice) => state.attemptsState.currentGameID);

  const gameAllAttemptsData = useSelector(
    (state: IAttemptsSlice) => state.attemptsState?.gameAllAttempts
  );

  const limitAttemptsOnPage = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.attemptsLimitOnPage
  );

  const gameAllAttemptsEl = gameAllAttemptsData?.map((attempt, index) => {
    return (
      <Attempt
        key={attempt._id}
        attempt={attempt}
        numberInLeaderBoard={
          limitAttemptsOnPage * attemptsListCurrentPage + index + 1 - limitAttemptsOnPage
        }
      ></Attempt>
    );
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
        dispatch(attemptsActions.setAttemptsListTransitionClasses("games-list-left"));
        dispatch(
          getGameAllAttempts({
            gameID: currentGameID,
            telegramUserID: telegramUser?.id,
            page: attemptsListCurrentPage + 1,
          })
        );
        // if (!user?.id) {
        //   dispatch(
        //     getGameAllAttempts({
        //       gameID: currentGameID,
        //       telegramUserID: 777777,
        //       page: attemptsListCurrentPage + 1,
        //     })
        //   );
        // } else {
        //   dispatch(
        //     getGameAllAttempts({
        //       gameID: currentGameID,
        //       telegramUserID: user?.id,
        //       page: attemptsListCurrentPage + 1,
        //     })
        //   );
        // }
      }
      if (isRightSwipe && attemptsListCurrentPage > 1 && currentGameID) {
        dispatch(attemptsActions.setAttemptsListTransitionClasses("games-list-right"));
        dispatch(
          getGameAllAttempts({
            gameID: currentGameID,
            telegramUserID: telegramUser?.id,
            page: attemptsListCurrentPage - 1,
          })
        );
        // if (!user?.id) {
        //   dispatch(
        //     getGameAllAttempts({
        //       gameID: currentGameID,
        //       telegramUserID: 777777,
        //       page: attemptsListCurrentPage - 1,
        //     })
        //   );
        // } else {
        //   dispatch(
        //     getGameAllAttempts({
        //       gameID: currentGameID,
        //       telegramUserID: user?.id,
        //       page: attemptsListCurrentPage - 1,
        //     })
        //   );
        // }
      }
    }
  };

  return (
    <>
      <div className=" w-full shadow-crosswordGameCellMenuButtonActive rounded-lg my-3 mx-3">
        {(getGameAllAttemptsStatus === attemptsFetchStatus.Resolve ||
          getGameAllAttemptsStatus === attemptsFetchStatus.Loading) && (
          // gameAllAttemptsEl?.length !== 0 &&
          <div className=" flex justify-center items-center ">
            <div className=" h-20 shadow-smallShadow  w-11/12 my-4 flex flex-row gap-3 justify-center items-center bg-gradient-to-tr  from-secoundaryColor to-crosswordSecoundaryColor rounded-sm px-4">
              {getGameAllAttemptsStatus === attemptsFetchStatus.Loading ? (
                <FontAwesomeIcon className=" animate-spin fa-fw fa-2x" icon={faSpinner} />
              ) : (
                <FontAwesomeIcon
                  // style={{ color: "#0b4905", backgroundColor: "#9af792" }}
                  className=" py-2 my-2 rounded-lg fa-fw fa-2xl"
                  icon={faMedal}
                />
              )}

              <h1 className="text-2xl font-bold ">Список лидеров</h1>
            </div>
          </div>
        )}
        {/* {getGameAllAttemptsStatus === attemptsFetchStatus.Loading && (
          <div className=" h-20 ">
            <AttemptLoadCard></AttemptLoadCard>
          </div>
        )} */}

        {getGameAllAttemptsStatus === attemptsFetchStatus.Error && (
          <div>
            <div className=" flex justify-center items-center h-full ">
              <h1 className=" px-2  font-bold  transition-all rounded-lg ease-in-out delay-50 bg-gradient-to-tr from-secoundaryColor to-red-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow py-10 text-center text-xl">
                Внимание... <span>{getAttemptsErrorMessage}</span>
              </h1>
            </div>
          </div>
        )}

        {gameAllAttemptsEl?.length === 0 &&
          getGameAllAttemptsStatus !== attemptsFetchStatus.Loading && (
            <h1 className=" text-center py-5 text-2xl font-bold underline underline-offset-4">
              Нет попыток
            </h1>
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
            <div className=" overflow-hidden overflow-y-scroll  px-3 w-full h-[60vh]  min-h-[60vh]">
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
                    <div className="justify-center pb-5 grid items-centergrid grid-cols-1 sm:gap-3 sm:grid-cols-3">
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
