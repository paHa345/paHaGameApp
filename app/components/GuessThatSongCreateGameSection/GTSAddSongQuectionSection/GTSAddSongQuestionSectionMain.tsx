import { AppDispatch } from "@/app/store";
import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GTSAnswer from "./GTSAnswer";
import { div } from "framer-motion/client";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UploadSongMain from "../UploadSongSection/UploadSongMain";

const GTSAddSongQuestionSectionMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [questionNumber, setQuestionNumber] = useState(0);
  const setQuestionNumberHandler = function (this: number, e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setQuestionNumber(this);
    // dispatch(GTSCreateGameActions.setAnswersArr([...Array(this)]));
    dispatch(GTSCreateGameActions.setAnswersArr(this));
    dispatch(GTSCreateGameActions.setCorrectAnswerIndex(undefined));
  };
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
  const currentQuestion = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.currentQuestion
  );

  const createdGame = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGTSGame
  );

  console.log(createdGame);

  const answersEls = currentQuestion?.answersArr ? (
    currentQuestion.answersArr.map((answer, index) => {
      return (
        <div key={index}>
          {" "}
          <GTSAnswer index={index}></GTSAnswer>
        </div>
      );
    })
  ) : (
    <div></div>
  );
  const addGTSQuestionHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    //обнуляем введённые данные вопроса

    dispatch(GTSCreateGameActions.resetCurrentQuestionData());

    if (currentAddedSong && currentAddedSong > gameValue) {
      return;
    }

    dispatch(GTSCreateGameActions.addQuestionInGame(currentQuestion));
    if (currentAddedSong && currentAddedSong >= gameValue) {
      console.log("Не удалось обновить номер вопроса");
      dispatch(GTSCreateGameActions.setCurrentAddedSong(currentAddedSong + 1));
      dispatch(GTSCreateGameActions.setGameIsBeingCreated(false));

      return;
    } else {
      if (currentAddedSong) {
        dispatch(GTSCreateGameActions.setCurrentAddedSong(currentAddedSong + 1));
      }
    }

    // console.log(currentAddedSong);
    // console.log(gameValue);
    // if (currentAddedSong && currentAddedSong > gameValue) {
    //   console.log("asdasd");
    //   dispatch(GTSCreateGameActions.setGameIsBeingCreated(false));
    // }
  };
  return (
    <div>
      <h1 className=" text-center text-2xl pt-3">
        Вопрос <span>{currentAddedSong}</span> из <span>{gameValue}</span>
      </h1>
      <div>
        <UploadSongMain></UploadSongMain>
      </div>
      <div>
        <h1 className=" text-center text-2xl">Варианты ответов</h1>
        <div>
          <div className=" my-3 py-2 shadow-smallShadow">
            <h1 className=" text-center text-2xl">Количество вариантов ответов</h1>

            <div className=" py-3 flex justify-center items-center">
              <div
                onClick={setQuestionNumberHandler.bind(4)}
                className={` my-2 ${questionNumber === 4 ? "scale-110 shadow-crosswordGameCellMenuShadow border-2 border-solid border-lime-400" : ""}  border-2 border-solid  cursor-pointer py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
              >
                <h1>4</h1>
              </div>
              <div
                onClick={setQuestionNumberHandler.bind(6)}
                className={` my-2 ${questionNumber === 6 ? "scale-110 shadow-crosswordGameCellMenuShadow border-2 border-solid border-lime-400" : ""}  border-2 border-solid   cursor-pointer py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
              >
                <h1>6</h1>
              </div>
            </div>
          </div>

          <div className=" grid gap-2 justify-center items-center sm:grid-cols-2">{answersEls}</div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default GTSAddSongQuestionSectionMain;
