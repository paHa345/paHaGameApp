import {
  getAvailableGTSGames,
  GTSGameFetchStatus,
  guessThatSongActions,
  IGuessThatSongSlice,
} from "@/app/store/guessThatSongSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { AppDispatch } from "@/app/store";
import { CSSTransition } from "react-transition-group";
import AvailableGTSGameCard from "./AvailableGTSGameCard";
import AvailableGRSGamePaginationMain from "./AvailableGRSGamePaginationMain";
import { crossworGamedActions, ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import LoadingAvailableGTSGameCards from "./LoadingAvailableGTSGameCards";
import LoadGTSGameNotification from "./LoadGTSGameNotification";

const AvailableGTSGamelistModalMain = () => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [toucLength, setToucLength] = useState(0);

  const isGTSListLastPage = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.isLastGTSGamesListPage
  );
  const GTSGamesListCurrentPage = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.GTSGamesListCurrentPage
  );
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
      if (isLeftSwipe && !isGTSListLastPage) {
        dispatch(crossworGamedActions.setCrosswordsListTransitionClasses("games-list-left"));
        dispatch(getAvailableGTSGames({ page: GTSGamesListCurrentPage + 1 }));
      }
      if (isRightSwipe && GTSGamesListCurrentPage > 1) {
        dispatch(crossworGamedActions.setCrosswordsListTransitionClasses("games-list-right"));
        dispatch(getAvailableGTSGames({ page: GTSGamesListCurrentPage - 1 }));
      }
    }
  };

  const nodeRef = useRef(null);

  const crosswordsListTransitionClasses = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordsListTransitionClasses
  );

  const fetchGTSGamesStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.fetchGTSGamesArrStatus
  );

  const isDesktop = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.browserType
  );
  const dispatch = useDispatch<AppDispatch>();

  const showGTSGameChooseModal = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.showChooseGTSModal
  );

  const availableGTSGamesArr = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.availableGTSGamesArr
  );

  const loadGTSGameStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.fetchAvailableGTSGameStatus
  );

  const showGTSGamesList = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.showHideGTSGamesList
  );

  const GTSGameCardsEl = availableGTSGamesArr.map((el, index) => {
    return (
      <div key={`${el._id}`} className=" pb-5">
        <AvailableGTSGameCard GTSGameData={el}></AvailableGTSGameCard>
      </div>
    );
  });

  const hideLoadCrosswordGameModalHandler = (
    e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    dispatch(guessThatSongActions.setShowChooseGTSModal(false));
  };

  const backdropVariant = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        delayChildren: 0.3,
      },
    },
  };

  const modalVariant = {
    hidden: {
      y: "-100vh",
    },
    visible: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
      },
    },
  };

  useEffect(() => {
    dispatch(getAvailableGTSGames({ page: 1 }));
  }, []);

  return (
    <AnimatePresence>
      {showGTSGameChooseModal && (
        <motion.div
          onClick={hideLoadCrosswordGameModalHandler}
          className=" modal-overlay "
          variants={backdropVariant}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className=" w-11/12 h-5/6 flex flex-col bg-modalMainColor rounded-lg"
            variants={modalVariant}
            // initial="hidden"
            // animate="visible"
            // exit="exit"
          >
            <div className="modal-header flex justify-start items-center w-full ">
              <div className=" w-full flex justify-around items-center">
                <LoadGTSGameNotification></LoadGTSGameNotification>

                <div
                  className={` transition-all  ${fetchGTSGamesStatus === GTSGameFetchStatus.Loading ? " opacity-100" : "opacity-0"} flex justify-center items-center h-5/6`}
                >
                  <LoadingAvailableGTSGameCards></LoadingAvailableGTSGameCards>
                </div>

                {loadGTSGameStatus === GTSGameFetchStatus.Ready && (
                  <a
                    className={` bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200`}
                    onClick={hideLoadCrosswordGameModalHandler}
                    href=""
                  >
                    <FontAwesomeIcon className=" fa-2x" icon={faXmark} />
                  </a>
                )}
              </div>
            </div>
            {fetchGTSGamesStatus === GTSGameFetchStatus.Resolve && GTSGameCardsEl.length === 0 && (
              <div className=" overflow-auto">
                <h1 className=" text-center">Нет доступных кроссвордов</h1>
              </div>
            )}
            <div className=" w-full rounded-lg my-3 flex flex-col justify-center items-center">
              <div className=" w-full flex flex-col justify-center items-center">
                <div className="   w-full  flex  justify-around items-center"></div>

                <div
                  style={{
                    transform: `translateX(${toucLength > 0 ? "10" : `${toucLength < 0 ? "-10" : "0"}`}%)`,
                  }}
                  className={` w-full swipeContainer transition-all duration-500  ease-in-out`}
                  onTouchStart={touchStartHandler}
                  onTouchMove={touchMoveHandler}
                  onTouchEnd={touchEndHandler}
                >
                  <div
                    className={`overflow-hidden overflow-y-scroll py-2 px-6 w-full  ${isDesktop === "desktop" ? " h-[50vh]  min-h-80 " : "  min-h-96 h-[50vh]  "}`}
                  >
                    <CSSTransition
                      nodeRef={nodeRef}
                      in={showGTSGamesList}
                      timeout={400}
                      unmountOnExit
                      classNames={crosswordsListTransitionClasses}
                    >
                      <div ref={nodeRef}>
                        {fetchGTSGamesStatus === GTSGameFetchStatus.Resolve ||
                        fetchGTSGamesStatus === GTSGameFetchStatus.Loading ? (
                          <div className=" pt-4 sm:grid lg:grid-cols-3 sm:grid-cols-2 gap-6 justify-center items-center overflow-auto h-full">
                            {GTSGameCardsEl}
                          </div>
                        ) : (
                          <div></div>
                        )}

                        {fetchGTSGamesStatus === GTSGameFetchStatus.Error && (
                          <div className=" flex justify-center items-center h-2/3 ">
                            <h1 className=" font-bold  text-center py-5 text-2xl transition-all rounded-lg ease-in-out delay-50 bg-gradient-to-tr from-secoundaryColor to-red-400 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow">
                              Не удалось загрузить список. Повторите попытку позднее
                            </h1>
                          </div>
                        )}
                      </div>
                    </CSSTransition>
                  </div>
                </div>
              </div>
              <AvailableGRSGamePaginationMain></AvailableGRSGamePaginationMain>
            </div>
          </motion.div>{" "}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AvailableGTSGamelistModalMain;
