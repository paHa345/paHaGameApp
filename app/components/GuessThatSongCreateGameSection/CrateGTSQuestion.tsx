"use client";

import { AppDispatch } from "@/app/store";
import {
  GTSCreatedGameComplexity,
  GTSCreatedGameType,
  GTSCreateGameActions,
  IGTSCreateGameSlice,
} from "@/app/store/GTSCreateGameSlice";
import {
  faCarOn,
  faChessKnight,
  faChessPawn,
  faChessQueen,
  faCirclePlus,
  faHeadphonesAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionsButtons from "./QuestionsButtons/QuestionsButtons";
import AddQuestion from "./GTSAddSongQuectionSection/AddQuestion";
import { GTSGameTemplates } from "@/app/types";
import { AnyBulkWriteOperation } from "mongodb";
import { resolve } from "path";
import { rejects } from "assert";
import DeleteEditedSecoundStepModalMain from "./AddArtistToAnswerSection/DeleteEditedSecoundStepModalMain";

const CrateGTSQuestion = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const [setGameComplexityWorker, setSetGameComplexityWorker] = useState<Worker>();
  const gameValue = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGgameValue
  );
  const createdGameName = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGameName
  );
  const currentGameAdded = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGTSGame
  );
  const currentGameComplexity = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.GTSAddedGameComplexity
  );

  const currentGameType = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.GTSAddedGameType
  );

  const currentGameID = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.updatedGameID
  );

  const addQuestionStatus = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.addQuestionStatus
  );

  const gameIsBeingCreated = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.gameIsBeingCreated
  );

  const gameIsBeingUpdated = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.gameIsBeingUpdated
  );

  const showDeleteEditedSecoundStepQuestionModal = useSelector(
    (state: IGTSCreateGameSlice) =>
      state.GTSCreateGameState.showDeleteEditedQuestionSecoundStapModalStatus
  );

  const changeGameValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(GTSCreateGameActions.setGameValue(e.currentTarget.value));
  };
  const changeCreatedGameNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(GTSCreateGameActions.setCreatedGameName(e.currentTarget.value));
  };
  const createGTSGameHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(GTSCreateGameActions.setGameIsBeingCreated(true));
    dispatch(GTSCreateGameActions.setEmptyCurrentQuestion());
    dispatch(GTSCreateGameActions.setCurrentAddedSong(1));
    dispatch(GTSCreateGameActions.initCreatedGTSGame());
    dispatch(GTSCreateGameActions.setAddQuestionStatus(true));
    const index = GTSGameTemplates.findIndex((el) => el.GTSGameType === currentGameType);
    dispatch(GTSCreateGameActions.setGTSGameData(GTSGameTemplates[index]));
  };

  const addedQuestionsButtonsEl = currentGameAdded?.map((question, index) => {
    return (
      <QuestionsButtons
        questionNumber={index}
        key={`${question.songURL}_${index}_${question.answersArr[0]}_${question.answersArr[1]}_${question.answersArr[2]}`}
      />
    );
  });

  const addQuestionHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(GTSCreateGameActions.setAddQuestionStatus(true));
  };

  const setGameComplexity = function (
    this: GTSCreatedGameComplexity,
    e: React.MouseEvent<HTMLDivElement>
  ) {
    console.log(this);
    dispatch(GTSCreateGameActions.setGTSAddedGameComplexity(this));
    console.log(setGameComplexityWorker);

    // if (!setGameComplexityWorker) {
    //   setSetGameComplexityWorker(new Worker(new URL("/public/worker.js", import.meta.url)));
    // }

    // if (!setGameComplexityWorker) {
    //   return;
    // }

    // setGameComplexityWorker?.postMessage({
    //   type: "setGameComplexity",
    //   message: this,
    // });

    // setGameComplexityWorker.onmessage = function (e: any) {
    //   console.log("setGameComplexityWorker said: ", e.data);
    // };
  };
  const setGameType = function (this: string, e: React.MouseEvent<HTMLDivElement>) {
    console.log(this);
    dispatch(GTSCreateGameActions.setGTSAddedGameType(this));
  };

  useEffect(() => {
    // if ("serviceWorker" in navigator) {
    //   navigator.serviceWorker
    //     .register("/worker.js")
    //     .then((registration) => console.log("scope is: ", registration.scope));
    // }

    // worker = new Worker(new URL("/public/worker.js", import.meta.url));

    // worker.onmessage = function (e) {
    //   console.log("Worker said: ", e.data);
    // };

    // // Send data to the Web Worker
    // worker.postMessage({
    //   type: "Some input data",
    //   message: "Some input data",
    // });

    if (!setGameComplexityWorker) {
      setSetGameComplexityWorker(new Worker(new URL("/public/worker.js", import.meta.url)));
    }

    return () => {
      console.log("cleanup");
      // worker.terminate();
      setGameComplexityWorker?.terminate();
      setGameComplexityWorker?.postMessage({
        type: "close",
        message: "close Worker",
      });

      setSetGameComplexityWorker(undefined);
    };
  }, []);

  // const timeout = (ms, callback) => {
  //   if (ms < 0) {
  //     callback("Errr");
  //   } else {
  //     setTimeout(() => {
  //       callback(null, "RRRR");
  //     }, ms);
  //   }
  // };

  // const promisify =
  //   (fn) =>
  //   (...args) =>
  //     new Promise((resolve, reject) => {
  //       console.log(...args);
  //       fn(...args, (error, result) => {
  //         if (error) {
  //           reject(error);
  //         } else {
  //           resolve(result);
  //         }
  //       });
  //     });

  // const promisifyTimeout = promisify(timeout);

  // promisifyTimeout(2000).then((value) => console.log(value));
  // promisifyTimeout(-1).catch((error) => console.log(error));

  // queueMicrotask(() => {
  //   console.log("4");
  // });

  // console.log("1");

  // setTimeout(() => {
  //   console.log("8");
  // }, 0);

  // const promise = new Promise((resolve) => {
  //   resolve("asdasd");
  //   console.log("2");
  // })
  //   .then(() => {
  //     console.log("5");
  //     queueMicrotask(() => {
  //       console.log("6");
  //     });
  //   })
  //   .then(() => {
  //     console.log("7");
  //   });

  // console.log("3");

  return (
    <div>
      <div>
        {currentGameID && <h1>Эта игра загружена в Базу Данных. ID Игры {currentGameID}</h1>}
      </div>
      <div className=" flex flex-col gap-3 justify-center items-center text-center text-2xl">
        {/* <h1>Укажите количество песен в игре</h1>
        <div className=" border-2 border-solid rounded-md border-cyan-900 w-20">
          <input className=" w-full" type="number" value={gameValue} onChange={changeGameValue} />
        </div> */}

        <h1>Укажите название игры</h1>
        <div className=" border-2 border-solid rounded-md border-cyan-900">
          <input
            className=" w-full py-1"
            type="text"
            size={40}
            // defaultValue={"Введите название"}
            placeholder="Введите название"
            value={createdGameName ? createdGameName : ""}
            onChange={changeCreatedGameNameHandler}
          />
        </div>
        <div>
          <h1>Сложность игры</h1>
          <div className=" py-3 flex justify-center items-center">
            <div
              className={` ${currentGameComplexity === GTSCreatedGameComplexity.easy ? "  scale-110 shadow-audioControlsButtonHoverShadow " : "shadow-exerciseCardShadow "} cursor-pointer py-2 px-4 mx-4 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 hover:scale-110 hover:bg-gradient-to-tl `}
              onClick={setGameComplexity.bind(GTSCreatedGameComplexity.easy)}
            >
              <FontAwesomeIcon className=" pr-2" icon={faChessPawn} />
              <h1 className=" text-base">Легко</h1>
              <h1 className=" text-sm">(15 сек)</h1>
            </div>
            <div
              className={`  ${currentGameComplexity === GTSCreatedGameComplexity.medium ? " scale-110 shadow-audioControlsButtonHoverShadow " : "shadow-exerciseCardShadow "} cursor-pointer py-2 px-4 mx-4  transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-amber-300 hover:scale-110 hover:bg-gradient-to-tl `}
              onClick={setGameComplexity.bind(GTSCreatedGameComplexity.medium)}
            >
              <FontAwesomeIcon className=" pr-2" icon={faChessKnight} />
              <h1 className=" text-base"> Средне</h1>
              <h1 className=" text-sm">(10 сек) </h1>
            </div>
            <div
              className={` ${currentGameComplexity === GTSCreatedGameComplexity.hard ? "  scale-110 shadow-audioControlsButtonHoverShadow " : "shadow-exerciseCardShadow "} cursor-pointer py-2 px-4 mx-4  transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-red-300 hover:scale-110 hover:bg-gradient-to-tl `}
              onClick={setGameComplexity.bind(GTSCreatedGameComplexity.hard)}
            >
              <FontAwesomeIcon className=" pr-2" icon={faChessQueen} />
              <h1 className=" text-base"> Сложно</h1>
              <h1 className=" text-sm">(8 сек) </h1>
            </div>
          </div>
        </div>

        {!gameIsBeingCreated && !currentGameID && (
          <div>
            <h1>Тип игры</h1>
            <div className=" py-3 flex justify-center items-center">
              <div
                className={` ${currentGameType === GTSCreatedGameType.GuessThatSong ? "  scale-110 shadow-audioControlsButtonHoverShadow " : "shadow-exerciseCardShadow "} cursor-pointer py-2 px-4 mx-4 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-cyan-300 hover:scale-110 hover:bg-gradient-to-tl `}
                onClick={setGameType.bind("GuessThatSong")}
              >
                <FontAwesomeIcon className=" pr-2" icon={faHeadphonesAlt} />
                <h1 className=" text-base">Угадай мелодию</h1>
              </div>
              <div
                className={`  ${currentGameType === GTSCreatedGameType.CarAudioFinancial ? " scale-110 shadow-audioControlsButtonHoverShadow " : "shadow-exerciseCardShadow "} cursor-pointer py-2 px-4 mx-4  transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-violet-300 hover:scale-110 hover:bg-gradient-to-tl `}
                onClick={setGameType.bind("CarAudioFinancial")}
              >
                <FontAwesomeIcon className=" pr-2" icon={faCarOn} />
                <h1 className=" text-base"> Авто аудио финансовая игра</h1>
              </div>
            </div>
          </div>
        )}

        <div className=" py-5">
          <button
            // disabled
            disabled={createdGameName.length === 0}
            className={`py-3 px-3 mx-6 ${createdGameName.length !== 0 ? `  transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow` : "  "}  `}
            onClick={createGTSGameHandler}
          >
            <FontAwesomeIcon className=" pr-2" icon={faCirclePlus} />
            Создать игру
          </button>
        </div>
      </div>
      <div>
        <h1 className=" text-center text-2xl py-3">Вопросы</h1>
        {currentGameAdded && addedQuestionsButtonsEl}
        {}
        <div className=" flex justify-center items-center">
          {" "}
          {/* <AddQuestion></AddQuestion> */}
          {!addQuestionStatus && (
            <button
              // disabled
              disabled={createdGameName.length === 0}
              className={`py-3 px-3 mx-6  transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
              onClick={addQuestionHandler}
            >
              <FontAwesomeIcon className=" pr-2" icon={faCirclePlus} />
              Добавить вопрос
            </button>
          )}
        </div>
      </div>
      {showDeleteEditedSecoundStepQuestionModal && (
        <DeleteEditedSecoundStepModalMain></DeleteEditedSecoundStepModalMain>
      )}
    </div>
  );
});

export default CrateGTSQuestion;
