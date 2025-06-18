import { AppDispatch } from "@/app/store";
import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GTSAnswer from "./GTSAnswer";
import { div } from "framer-motion/client";
import { faCirclePlus, faCross, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UploadSongMain from "../UploadSongSection/UploadSongMain";
import UploadImageMain from "../UploadImageSection/UploadImageMain";
import AddMainQuestion from "./AddMainQuestion";
import FirstStepQuestionAnswers from "./FirstStepQuestionAnswers";
import SecoundStepQuestionAnswer from "./SecoundStepQuestionAnswer";

const AddQuestion = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const currentQuestion = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.currentQuestion
  );
  const gameValue = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGgameValue
  );
  const createdGameName = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGameName
  );

  const gameIsBeingCreated = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.gameIsBeingCreated
  );

  const currentAddedSong = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.currentAddedSong
  );

  const createdGame = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGTSGame
  );

  const addGTSQuestionHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    //обнуляем введённые данные вопроса

    dispatch(GTSCreateGameActions.resetCurrentQuestionData());

    // if (currentAddedSong && currentAddedSong > gameValue) {
    //   return;
    // }
    dispatch(GTSCreateGameActions.addQuestionInGame(currentQuestion));

    if (currentAddedSong) {
      dispatch(GTSCreateGameActions.setCurrentAddedSong(currentAddedSong + 1));
    }

    dispatch(GTSCreateGameActions.setGameValue(Number(gameValue) + 1));

    dispatch(GTSCreateGameActions.setGameIsBeingCreated(false));
    dispatch(GTSCreateGameActions.setAddQuestionStatus(false));

    // if (currentAddedSong && currentAddedSong >= gameValue) {
    //   console.log("Не удалось обновить номер вопроса");
    //   dispatch(GTSCreateGameActions.setCurrentAddedSong(currentAddedSong + 1));
    //   dispatch(GTSCreateGameActions.setGameIsBeingCreated(false));
    //   dispatch(GTSCreateGameActions.setAddQuestionStatus(false));

    //   return;
    // } else {
    //   if (currentAddedSong) {
    //     dispatch(GTSCreateGameActions.setCurrentAddedSong(currentAddedSong + 1));
    //   }
    // }

    // console.log(currentAddedSong);
    // console.log(gameValue);
    // if (currentAddedSong && currentAddedSong > gameValue) {
    //   console.log("asdasd");
    //   dispatch(GTSCreateGameActions.setGameIsBeingCreated(false));
    // }
  };

  const resetAddQuestionHamdler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(GTSCreateGameActions.resetCurrentQuestionData());
    dispatch(GTSCreateGameActions.setAddQuestionStatus(false));
  };
  return (
    <div>
      <FirstStepQuestionAnswers></FirstStepQuestionAnswers>
      <SecoundStepQuestionAnswer></SecoundStepQuestionAnswer>

      <div>
        <div>
          <div>
            <div className=" py-5 flex justify-center items-center">
              {
                // currentQuestion?.songURL &&
                currentQuestion?.answersArr &&
                currentQuestion.correctAnswerIndex !== undefined &&
                currentQuestion?.correctAnswerIndex >= 0 ? (
                  <div
                    // disabled
                    // disabled={gameValue <= 0 || createdGameName.length === 0}
                    className={` cursor-pointer py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
                    onClick={addGTSQuestionHandler}
                  >
                    <FontAwesomeIcon className=" pr-2" icon={faCirclePlus} />
                    Добавить вопрос
                  </div>
                ) : (
                  <div
                    // onClick={addGTSQuestionHandler}
                    className={` py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow`}
                  >
                    <h1>Загрузите песню, заполните ответы, выберете правильный ответ</h1>
                  </div>
                )
              }
            </div>
            <div className=" flex justify-center items-center">
              <div
                className={` cursor-pointer py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-red-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
                onClick={resetAddQuestionHamdler}
              >
                <FontAwesomeIcon className=" pr-2" icon={faXmark} />
                Отмена
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AddQuestion;
