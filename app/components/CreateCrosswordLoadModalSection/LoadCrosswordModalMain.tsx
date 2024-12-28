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
import CurrentUserCrosswordCard from "./CurrentUserCrosswordCard";
import LoadingCrosswordsCard from "./LoadindCrosswordsCard";
import LoadCrosswordNotification from "./LoadCrosswordNotification";

const LoadCrosswordModalMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const hideLoadCrosswordModalHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(crosswordActions.hideLoadCrosswordModal());
  };

  const currentUserCrosswordsArr = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.currentUserCrosswordsArr
  );

  const fetchCrosswordsStatus = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.setCurrentUserCrosswordsStatus
  );

  const crosswordCardsEl = currentUserCrosswordsArr.map((el, index) => {
    return (
      <div key={`${el._id}`} className=" pb-3">
        <CurrentUserCrosswordCard crosswordData={el}></CurrentUserCrosswordCard>
      </div>
    );
  });

  console.log(crosswordCardsEl.length);

  useEffect(() => {
    dispatch(getCurrentUserAllCrosswords());
    // return () => {
    //   dispatch(crosswordActions.resetCurrentUserCrosswordsArr());
    // };
  }, []);

  return (
    <div className="modal-overlay">
      <div className=" modal-wrapper">
        <div className="modal">
          <div className="modal-header">
            <LoadCrosswordNotification></LoadCrosswordNotification>
            <a
              className=" bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200"
              onClick={hideLoadCrosswordModalHandler}
              href=""
            >
              <FontAwesomeIcon icon={faXmark} />
            </a>
          </div>
          {fetchCrosswordsStatus === crosswordFetchStatus.Resolve &&
            crosswordCardsEl.length === 0 && (
              <div className=" overflow-auto">
                <h1 className=" text-center">Нет сохранённых кроссвордов</h1>
              </div>
            )}
          {fetchCrosswordsStatus === crosswordFetchStatus.Resolve && (
            <div className=" overflow-auto h-5/6">{crosswordCardsEl}</div>
          )}
          {fetchCrosswordsStatus === crosswordFetchStatus.Loading && (
            <LoadingCrosswordsCard></LoadingCrosswordsCard>
          )}
          {fetchCrosswordsStatus === crosswordFetchStatus.Error && (
            <p>Не удалось загрузить список. Повторите попытку позднее</p>
          )}

          {/* <AddExercisesSection></AddExercisesSection> */}
          <div className="modal-body"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadCrosswordModalMain;
