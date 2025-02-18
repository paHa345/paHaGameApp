import { AppDispatch } from "@/app/store";
import {
  GTSCreateGameActions,
  GTSCreateGameFetchStatus,
  IGTSCreateGameSlice,
  uploadGTSGameAndUpdateStore,
} from "@/app/store/GTSCreateGameSlice";
import { faCloudArrowUp, faPencil, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { div } from "framer-motion/client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddGTSGameButtonMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentGTSGame = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGTSGame
  );
  const gameID = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.updatedGameID
  );
  const gameComplexity = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.GTSAddedGameComplexity
  );
  const addedCurrentGTSGameName = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGameName
  );
  const gameIsCompletedStatus = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGameIsCompleted
  );
  const addGTSGameHandler = () => {
    console.log(gameID);
    dispatch(
      uploadGTSGameAndUpdateStore({
        gameID: gameID,
        gameComplexity: gameComplexity,
        currentGame: {
          name: addedCurrentGTSGameName,
          GTSGameObj: currentGTSGame,
          isCompleted: gameIsCompletedStatus,
        },
      })
    );
  };
  const uploadGTSGameStatus = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.uploadCurrentGTSGameStatus
  );

  useEffect(() => {
    if (
      uploadGTSGameStatus === GTSCreateGameFetchStatus.Error ||
      uploadGTSGameStatus === GTSCreateGameFetchStatus.Resolve
    ) {
      const timeoutId = setTimeout(() => {
        dispatch(
          GTSCreateGameActions.setUploadCurrentGTSGameStatus(GTSCreateGameFetchStatus.Ready)
        );
      }, 5000);
      return () => {
        dispatch(
          GTSCreateGameActions.setUploadCurrentGTSGameStatus(GTSCreateGameFetchStatus.Ready)
        );
      };
    }
  }, [uploadGTSGameStatus]);

  return (
    <div className=" flex justify-center items-center">
      <div
        onClick={addGTSGameHandler}
        className=" py-3 flex justify-center items-center gap-2 cursor-pointer w-10/12 px-4 hover:scale-105 duration-200 rounded-lg ease-in hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow
      "
      >
        {uploadGTSGameStatus === GTSCreateGameFetchStatus.Ready && (
          <FontAwesomeIcon className=" pr-2" icon={faCloudArrowUp} />
        )}
        {(uploadGTSGameStatus === GTSCreateGameFetchStatus.Loading ||
          uploadGTSGameStatus === GTSCreateGameFetchStatus.Resolve) && (
          <FontAwesomeIcon className=" pr-2 fa-spin" icon={faSpinner} />
        )}
        <h1>Сохранить игру</h1>
      </div>
    </div>
  );
};

export default AddGTSGameButtonMain;
