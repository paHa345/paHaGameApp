"use client";

import { crossworGamedActions, ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faChevronDown, faChevronUp, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppDispatch } from "@/app/store";
import { Transition } from "react-transition-group";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import TransitionTemplate from "../TransitionTemplate";

const CurrentUserCompletedCrosswordAttempt = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUserCompletedAttempt = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.currentUserCompletedAttempt
  );
  const showHideAttemptAnswers = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.showHideCurrentUserAttemptAnswers
  );

  const nodeRef = useRef(null);

  const answersEl = currentUserCompletedAttempt?.userAnswers?.map((answers) => {
    return answers.addedWordArr.map((answer) => {
      return (
        <div className=" pb-2 border-solid border-b-2 border-stone-600 my-1" key={answer._id}>
          {" "}
          <div>
            {" "}
            <h1>
              {" "}
              <span>Вопрос: </span> {answer.question}
            </h1>{" "}
          </div>
          <div>
            <h1
              className={` text-center rounded-md ${answer.isCorrect ? " bg-green-300" : " bg-red-300 "}`}
            >
              <span>Ваш ответ: </span> {answer.value}
            </h1>
          </div>
        </div>
      );
    });
  });

  const showHideAttemptAnswersHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(crossworGamedActions.setShowHideCurrentUserAttemptAnswers());
  };

  return (
    <>
      <div className="flex justify-center items-center flex-col gap-5">
        {currentUserCompletedAttempt?.completedCorrectly === true && (
          <div className="flex justify-center items-center flex-col gap-5 ">
            <h1 className=" text-center text-xl">
              Поздравляем, вы успешно справились с кроссвордом: <br />
              <span className="  bg-green-200 rounded-md  py-1 px-2 font-semibold">
                {currentUserCompletedAttempt?.crosswordName}
              </span>
            </h1>
            <h1 className=" text-center text-xl">
              Ваше время:(Час:Мин:Сек){" "}
              <span className=" underline underline-offset-4">
                {currentUserCompletedAttempt?.duration}
              </span>
            </h1>
          </div>
        )}
        {currentUserCompletedAttempt?.completedCorrectly === false && (
          <div>
            <h1 className=" text-center">
              Сожалеем, вы не смогли справиться с кроссвордом: <br />
              <span className={` bg-red-200 rounded-md  py-1 px-2 text-2xl font-semibold`}>
                {currentUserCompletedAttempt?.crosswordName}
              </span>
            </h1>
            {/* <h1>
              Ваше время:(Час:Мин:Сек) <span>{currentUserCompletedAttempt?.duration}</span>
            </h1> */}
          </div>
        )}
      </div>
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
          {/* <TransitionTemplate>
            <div>{showHideAttemptAnswers && answersEl}</div>
          </TransitionTemplate> */}
        </div>
      </div>
    </>
  );
};

export default CurrentUserCompletedCrosswordAttempt;
