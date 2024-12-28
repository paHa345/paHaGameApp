import { AppDispatch } from "@/app/store";
import {
  crosswordActions,
  crosswordFetchStatus,
  getCurrentUserAllCrosswords,
  getCurrentUserCrosswordAndSetInState,
  ICrosswordSlice,
} from "@/app/store/crosswordSlice";
import { faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadindAvailableCrosswordGameCards from "./LoadindAvailableCrosswordGameCards";
import LoadCrosswordGameNotification from "./LoadCrosswordGameNotification";
import {
  crosswordGameFetchStatus,
  crossworGamedActions,
  getAvailableCrosswords,
  ICrosswordGameSlice,
} from "@/app/store/crosswordGameSlice";
import AvailableCrosswordGameCard from "./AvailableCrosswordGameCard";
import AvailableCrosswordPaginationMain from "./AvailableCrosswordPaginationMain";
import { CSSTransition } from "react-transition-group";
import { div } from "framer-motion/client";

import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";

const LoadCrosswordGameModalMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const hideLoadCrosswordGameModalHandler = (
    e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    // const target: React.ChangeEvent<HTMLInputElement> = e.target
    // console.log(target.);
    dispatch(crossworGamedActions.setShowChooseCrosswordModal(false));
  };

  const availableCrosswordGamesArr = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.availableCrosswordGamesArr
  );

  const fetchCrosswordsGameStatus = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.fetchCrosswordsArrStatus
  );

  const loadCrosswordGameStatus = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.fetchAvailableCrosswordGamesStatus
  );

  const isDesktop = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.browserType
  );

  const crosswordCardsEl = availableCrosswordGamesArr.map((el, index) => {
    return (
      <div key={`${el._id}`} className=" pb-5">
        <AvailableCrosswordGameCard crosswordData={el}></AvailableCrosswordGameCard>
      </div>
    );
  });

  const showCrosswordsList = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.showHideCrosswordsList
  );

  const nodeRef = useRef(null);

  const crosswordsListTransitionClasses = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordsListTransitionClasses
  );

  useEffect(() => {
    dispatch(getAvailableCrosswords({ page: 1 }));
  }, []);

  const crosswordsListCurrentPage = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordsListCurrentPage
  );

  const iscrosswordsListLastPage = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.isLastCrosswordsListPage
  );

  const showCrosswordGameChooseModal = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.showChooseCrosswordModal
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
      if (isLeftSwipe && !iscrosswordsListLastPage) {
        dispatch(crossworGamedActions.setCrosswordsListTransitionClasses("games-list-left"));
        dispatch(getAvailableCrosswords({ page: crosswordsListCurrentPage + 1 }));
      }
      if (isRightSwipe && crosswordsListCurrentPage > 1) {
        dispatch(crossworGamedActions.setCrosswordsListTransitionClasses("games-list-right"));
        dispatch(getAvailableCrosswords({ page: crosswordsListCurrentPage - 1 }));
      }
    }
  };

  const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        damping: 25,
        stiffness: 400,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };

  const newspaper = {
    hidden: {
      transform: "scale(0) rotate(720deg)",
      opacity: 0,
      transition: {
        delay: 0.3,
      },
    },
    visible: {
      transform: " scale(1) rotate(0deg)",
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      transform: "scale(0) rotate(-720deg)",
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
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

  return (
    <AnimatePresence>
      {showCrosswordGameChooseModal && (
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
                <LoadCrosswordGameNotification></LoadCrosswordGameNotification>

                <div
                  className={` transition-all  ${fetchCrosswordsGameStatus === crosswordGameFetchStatus.Loading ? " opacity-100" : "opacity-0"} flex justify-center items-center h-5/6`}
                >
                  <LoadindAvailableCrosswordGameCards></LoadindAvailableCrosswordGameCards>
                </div>

                {loadCrosswordGameStatus === crosswordGameFetchStatus.Ready && (
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
            {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Resolve &&
              crosswordCardsEl.length === 0 && (
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
                      in={showCrosswordsList}
                      timeout={400}
                      unmountOnExit
                      classNames={crosswordsListTransitionClasses}
                    >
                      <div ref={nodeRef}>
                        {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Resolve ||
                        fetchCrosswordsGameStatus === crosswordGameFetchStatus.Loading ? (
                          <div className=" pt-4 sm:grid lg:grid-cols-3 sm:grid-cols-2 gap-6 justify-center items-center overflow-auto h-full">
                            {crosswordCardsEl}
                          </div>
                        ) : (
                          <div></div>
                        )}

                        {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Error && (
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
              <AvailableCrosswordPaginationMain></AvailableCrosswordPaginationMain>
            </div>
          </motion.div>{" "}
        </motion.div>
      )}
    </AnimatePresence>

    // <Suspense
    //   fallback={
    //     <>
    //       <div className=" min-h-[70vh] py-6">
    //         <div className="flex justify-center items-center">
    //           <div className=" pt-10 flex flex-col justify-center items-center">
    //             <h1 className=" py-5 text-2xl text-center font-bold">Страница загружается ...</h1>
    //             <FontAwesomeIcon className=" animate-spin fa-fw fa-2x" icon={faSpinner} />
    //           </div>
    //         </div>
    //       </div>
    //     </>
    //   }
    // >
    //   <div className={`modal-overlay `}>
    //       <div className=" modal-wrapper">
    //         <div className="modal flex flex-col justify-center items-center">
    //           <div className="modal-header flex justify-start items-center w-full ">
    //             <div className=" w-full flex justify-around items-center">
    //               <LoadCrosswordGameNotification></LoadCrosswordGameNotification>

    //               <div
    //                 className={` transition-all  ${fetchCrosswordsGameStatus === crosswordGameFetchStatus.Loading ? " opacity-100" : "opacity-0"} flex justify-center items-center h-5/6`}
    //               >
    //                 <LoadindAvailableCrosswordGameCards></LoadindAvailableCrosswordGameCards>
    //               </div>

    //               {loadCrosswordGameStatus === crosswordGameFetchStatus.Ready && (
    //                 <a
    //                   className={` bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200`}
    //                   onClick={hideLoadCrosswordGameModalHandler}
    //                   href=""
    //                 >
    //                   <FontAwesomeIcon className=" fa-2x" icon={faXmark} />
    //                 </a>
    //               )}
    //             </div>
    //           </div>
    //           {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Resolve &&
    //             crosswordCardsEl.length === 0 && (
    //               <div className=" overflow-auto">
    //                 <h1 className=" text-center">Нет доступных кроссвордов</h1>
    //               </div>
    //             )}
    //           <div className=" w-full rounded-lg my-3 flex flex-col justify-center items-center">
    //             <div className=" w-full flex flex-col justify-center items-center">
    //               <div className="   w-full  flex  justify-around items-center"></div>

    //               <div
    //                 style={{
    //                   transform: `translateX(${toucLength > 0 ? "10" : `${toucLength < 0 ? "-10" : "0"}`}%)`,
    //                 }}
    //                 className={` w-full swipeContainer transition-all duration-500  ease-in-out`}
    //                 onTouchStart={touchStartHandler}
    //                 onTouchMove={touchMoveHandler}
    //                 onTouchEnd={touchEndHandler}
    //               >
    //                 <div
    //                   className={`overflow-hidden overflow-y-scroll py-2 px-6 w-full  ${isDesktop === "desktop" ? " h-[50vh]  min-h-80 " : "  min-h-96 h-[50vh]  "}`}
    //                 >
    //                   <CSSTransition
    //                     nodeRef={nodeRef}
    //                     in={showCrosswordsList}
    //                     timeout={400}
    //                     unmountOnExit
    //                     classNames={crosswordsListTransitionClasses}
    //                   >
    //                     <div ref={nodeRef}>
    //                       {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Resolve ||
    //                       fetchCrosswordsGameStatus === crosswordGameFetchStatus.Loading ? (
    //                         <div className=" pt-4 sm:grid lg:grid-cols-3 sm:grid-cols-2 gap-6 justify-center items-center overflow-auto h-full">
    //                           {crosswordCardsEl}
    //                         </div>
    //                       ) : (
    //                         <div></div>
    //                       )}

    //                       {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Error && (
    //                         <div className=" flex justify-center items-center h-2/3 ">
    //                           <h1 className=" font-bold  text-center py-5 text-2xl transition-all rounded-lg ease-in-out delay-50 bg-gradient-to-tr from-secoundaryColor to-red-400 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow">
    //                             Не удалось загрузить список. Повторите попытку позднее
    //                           </h1>
    //                         </div>
    //                       )}
    //                     </div>
    //                   </CSSTransition>
    //                 </div>
    //               </div>
    //             </div>
    //             <AvailableCrosswordPaginationMain></AvailableCrosswordPaginationMain>
    //           </div>
    //         </div>
    //       </div>

    //   </div>
    // </Suspense>
  );
};

export default LoadCrosswordGameModalMain;
