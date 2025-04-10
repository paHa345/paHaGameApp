import { AppDispatch } from "@/app/store";
import { crossworGamedActions, ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { div } from "framer-motion/client";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";

const CurrentUserCompletedGTSGameAttempt = () => {
  const dispatch = useDispatch<AppDispatch>();

  const currentGTSGameCompletedAttempt = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentUserCompletedGTSAttempt
  );

  const showHideAttemptAnswers = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.showHideCurrentUserAttemptAnswers
  );

  const showHideAttemptAnswersHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(crossworGamedActions.setShowHideCurrentUserAttemptAnswers());
  };

  const nodeRef = useRef(null);

  const answersEl = currentGTSGameCompletedAttempt?.attemptQuestionStatus?.map((answers, index) => {
    return (
      <div
        className=" w-11/12 pb-2 border-solid border-b-2 border-stone-600 my-1"
        key={answers._id}
      >
        <div className=" py-3">
          <h1 className=" text-center pb-2">Песня</h1>
          <div>
            <h1>
              Ваш ответ:
              <span
                className={`${answers.answerIsCorrect ? " bg-green-200" : "bg-red-200"}`}
              >{` ${answers.userAnswerSongName}`}</span>
            </h1>
          </div>
          <div>
            <h1>
              Правильный ответ:
              <span>{` ${answers.correctAnswerSongName}`}</span>
            </h1>
          </div>
        </div>
        <div className=" py-3">
          <h1 className=" text-center pb-2">Исполнитель</h1>
          <div>
            <h1>
              Ваш ответ:
              <span
                className={`${answers.artistAnswerIsCorrect ? " bg-green-200" : "bg-red-200"}`}
              >{` ${answers?.userAnswerArtistName}`}</span>
            </h1>
          </div>
          <div>
            <h1>
              Правильный ответ:
              <span>{` ${answers?.correctAnswerArtistName}`}</span>
            </h1>
          </div>
        </div>
        <div>
          <h1>
            Получено бонусных секунд:
            <span>{` ${answers.bonusTime}`}</span>
          </h1>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className=" w-full flex justify-center items-center flex-col gap-5 ">
        <h1 className=" text-center text-xl">
          Вы закончили попытку игры: <br />
          <span className="  bg-green-200 rounded-md  py-1 px-2 font-semibold">
            {currentGTSGameCompletedAttempt?.GTSGameName}
          </span>
        </h1>
        <h1 className=" text-center text-xl">
          Ваш результат:
          <span className=" underline underline-offset-4 font-bold">
            {` ${currentGTSGameCompletedAttempt?.timeRemained} балла`}
          </span>{" "}
        </h1>
      </div>
      <div className="flex justify-center items-center flex-col gap-5"></div>
      <div className=" w-11/12">
        <h1 className=" text-center text-2xl">Ваши ответы</h1>

        <div>
          <div
            onClick={showHideAttemptAnswersHandler}
            className=" cursor-pointer hover:bg-slate-300 bg-slate-200 flex justify-center items-center"
          >
            {showHideAttemptAnswers ? (
              <>
                {" "}
                <FontAwesomeIcon className="fa-2x" icon={faChevronUp}></FontAwesomeIcon>
                <h1>Скрыть</h1>
              </>
            ) : (
              <>
                {" "}
                <FontAwesomeIcon className="fa-2x" icon={faChevronDown}></FontAwesomeIcon>
                <h1>Показать</h1>
              </>
            )}
          </div>
          <CSSTransition
            nodeRef={nodeRef}
            in={showHideAttemptAnswers}
            timeout={400}
            unmountOnExit
            classNames="my-node"
          >
            <div className=" max-h-44  overflow-y-scroll " ref={nodeRef}>
              {answersEl}
            </div>
          </CSSTransition>
        </div>
      </div>
    </>
  );
};

export default CurrentUserCompletedGTSGameAttempt;
