import { AppDispatch } from "@/app/store";
import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import { faCheckCircle, faCircle } from "@fortawesome/free-regular-svg-icons";
import { faCheckSquare, faSpinner, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PublicGTSGameMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isCompletedStatus = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGameIsCompleted
  );

  const changeIsCompletedStatusHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(GTSCreateGameActions.setCreatedGameIsCompletedStatus(!isCompletedStatus));
  };

  return (
    <div className=" py-3  my-3 shadow-smallShadow flex justify-center items-center gap-3">
      <div>
        <h1>Игра готова к публикации</h1>
      </div>
      {/* <div className=" border-2 border-solid rounded-md border-cyan-900"> */}
      <div onClick={changeIsCompletedStatusHandler} className=" cursor-pointer">
        {isCompletedStatus ? (
          <FontAwesomeIcon className=" fa-2xl" icon={faCheckCircle} />
        ) : (
          <FontAwesomeIcon className=" fa-2xl" icon={faCircle} />
        )}
      </div>

      {/* </div> */}
    </div>
  );
};

export default PublicGTSGameMain;
