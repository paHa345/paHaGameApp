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
import React, { useEffect } from "react";
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

  useEffect(() => {
    dispatch(getAvailableCrosswords());
    // return () => {
    //   dispatch(crosswordActions.resetCurrentUserCrosswordsArr());
    // };
  }, []);

  return (
    <div
      // onClick={hideLoadCrosswordGameModalHandler}
      className="modal-overlay"
    >
      <div className=" modal-wrapper">
        <div className="modal">
          <div className="modal-header">
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
          <LoadCrosswordGameNotification></LoadCrosswordGameNotification>
          {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Resolve &&
            crosswordCardsEl.length === 0 && (
              <div className=" overflow-auto">
                <h1 className=" text-center">Нет доступных кроссвордов</h1>
              </div>
            )}
          {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Resolve && (
            <div className=" pt-4 sm:grid lg:grid-cols-3 sm:grid-cols-2 gap-6 justify-center items-center overflow-auto h-5/6">
              {crosswordCardsEl}
            </div>
          )}
          {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Loading && (
            <div className=" flex justify-center items-center h-5/6">
              <LoadindAvailableCrosswordGameCards></LoadindAvailableCrosswordGameCards>
            </div>
          )}
          {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Error && (
            <p>Не удалось загрузить список. Повторите попытку позднее</p>
          )}

          {/* <AddExercisesSection></AddExercisesSection> */}
          <div className="modal-body"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadCrosswordGameModalMain;
