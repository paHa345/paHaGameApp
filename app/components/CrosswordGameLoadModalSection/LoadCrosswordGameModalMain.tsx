import { AppDispatch } from "@/app/store";
import {
  crosswordActions,
  crosswordFetchStatus,
  getCurrentUserAllCrosswords,
  getCurrentUserCrosswordAndSetInState,
  ICrosswordSlice,
} from "@/app/store/crosswordSlice";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef } from "react";
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

  const crosswordCardsEl = availableCrosswordGamesArr.map((el, index) => {
    return (
      <div key={`${el._id}`} className=" pb-3">
        <AvailableCrosswordGameCard crosswordData={el}></AvailableCrosswordGameCard>
      </div>
    );
  });

  const showCrosswordsList = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.showHideCrosswordsList
  );

  console.log(showCrosswordsList);

  const nodeRef = useRef(null);

  const crosswordsListTransitionClasses = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.crosswordsListTransitionClasses
  );

  useEffect(() => {
    dispatch(getAvailableCrosswords({ page: 1 }));
    // return () => {
    //   dispatch(crosswordActions.resetCurrentUserCrosswordsArr());
    // };
  }, []);

  return (
    <div className="modal-overlay">
      <div className=" modal-wrapper">
        <div className="modal">
          <div className="modal-header flex justify-start items-center ">
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

          <div className=" w-full rounded-lg my-3">
            <div className=" w-full flex flex-col justify-center items-center">
              <div className="   w-full  flex  justify-around items-center"></div>

              <div className=" overflow-hidden py-2 px-6 w-full h-4/5 min-h-80">
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
            <AvailableCrosswordPaginationMain></AvailableCrosswordPaginationMain>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadCrosswordGameModalMain;
