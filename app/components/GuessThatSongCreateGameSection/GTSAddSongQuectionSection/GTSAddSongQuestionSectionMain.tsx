import { AppDispatch } from "@/app/store";
import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GTSAnswer from "./GTSAnswer";
import { div } from "framer-motion/client";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GTSAddSongQuestionSectionMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [questionNumber, setQuestionNumber] = useState(0);
  const setQuestionNumberHandler = function (this: number, e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setQuestionNumber(this);
    dispatch(GTSCreateGameActions.setAnswersArr([...Array(this)]));
  };
  const gameValue = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGgameValue
  );
  const createdGameName = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGameName
  );

  const currentAddedSong = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.currentAddedSong
  );
  const currentQuestion = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.currentQuestion
  );

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
  return (
    <div>
      <h1>
        Песня <span>{currentAddedSong}</span> из <span>{gameValue}</span>
      </h1>
      <div>
        <h1>Варианты ответов</h1>
        <div>
          <h1>Количество вариантов ответов</h1>

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
          <div className=" grid gap-2 justify-center items-center sm:grid-cols-2">{answersEls}</div>
          <div>
            <div className=" py-5 flex justify-center items-center">
              <div
                // disabled
                // disabled={gameValue <= 0 || createdGameName.length === 0}
                className={`py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
                // onClick={createGTSGameHandler}
              >
                <FontAwesomeIcon className=" pr-2" icon={faCirclePlus} />
                Добавить вопрос
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GTSAddSongQuestionSectionMain;
