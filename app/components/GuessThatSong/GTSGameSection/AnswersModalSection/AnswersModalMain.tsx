"use client";
import {
  GTSGameFetchStatus,
  guessThatSongActions,
  IGuessThatSongSlice,
} from "@/app/store/guessThatSongSlice";
import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as motion from "motion/react-client";
import { AppDispatch } from "@/app/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphonesSimple, faMusic, faXmark } from "@fortawesome/free-solid-svg-icons";
import GTSGameAnswer from "./GTSGameAnswer";
import RemainedTimeAnswerModal from "./RemainedTimeAnswerModal";
import FetchAnswerTimeStream from "./FetchAnswerTimeStream";
import Image from "next/image";
import ArtistAnswer from "./ArtistAnswer";
import AnswerMain from "./AnswersMain";

const AnswersModalMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const bonusTime = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.bonusTime
  );

  const chosenGTSGameAnswerID = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.chosenGTSGameAnswerID
  );

  const nextQuestionNotification = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.nextQuestionNotification
  );

  const answerIsCorrect = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.answerIsCorrect
  );

  const checkGTSGameAnswerStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.checkGTSGameAnswerStatus
  );

  const artistAnswersArr = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.artistAnswerArr
  );

  const showGTSAnswersModal = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.showGTSAnswersModal
  );

  const checkAnswerStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.checkGTSGameAnswerStatus
  );

  const imageURL = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.imageURL
  );
  const currentGTSAttemptData = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData
  );

  const hideGTSAnswersModalHandler = (
    e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    let closeWindow = confirm("Вы действительно хотите покинуть данную страницу?");

    if (closeWindow) {
      dispatch(guessThatSongActions.setShowGTSAnswersModal(false));
    }
  };

  const backdropVariant = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        delayChildren: 0.3,
      },
    },
  };

  const modalVariant = {
    hidden: {
      y: "-100vh",
    },
    visible: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
      },
    },
  };

  const currentGTSAnswers = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.questionAnswers
  );

  const answersEls = currentGTSAnswers.map((answer, index) => {
    return (
      <div key={answer._id} className="w-full">
        <GTSGameAnswer id={answer._id} answerText={answer.text}></GTSGameAnswer>
      </div>
    );
  });

  const artistAnswerEl = artistAnswersArr.map((answer, index) => {
    return (
      <div key={answer._id} className="w-full">
        <ArtistAnswer text={answer.text} artistAnswerID={answer._id}></ArtistAnswer>
      </div>
    );
  });

  const answerStatus = answerIsCorrect ? "Верно" : "Ошибка";
  const showAnswerTimer = !bonusTime || (bonusTime <= 0 && bonusTime !== -5);

  useEffect(() => {
    dispatch(guessThatSongActions.setStopAnswerTimerController(new AbortController()));
  }, []);

  return (
    <AnimatePresence>
      {showGTSAnswersModal && (
        <motion.div
          onClick={hideGTSAnswersModalHandler}
          className=" modal-overlay "
          variants={backdropVariant}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className=" w-11/12 h-5/6 flex flex-col bg-modalMainColor rounded-lg"
            variants={modalVariant}
            // initial="hidden"
            // animate="visible"
            // exit="exit"
          >
            <div className=" h-[20vh] min-h-16 modal-header flex justify-start items-center w-full ">
              <div className=" w-full flex justify-end items-center">
                <div className=" w-full flex justify-center items-center flex-col">
                  {nextQuestionNotification && (
                    <div className=" animate-pulse text-center text-xl px-1 py-1 rounded-md bg-lime-100">
                      {" "}
                      <h1>{nextQuestionNotification}</h1>
                    </div>
                  )}
                  {checkAnswerStatus === GTSGameFetchStatus.Loading && (
                    <div className=" absolute top-20 left-9 px-10 animate-spin">
                      <FontAwesomeIcon className=" fa-4x" icon={faHeadphonesSimple} />
                    </div>
                  )}
                  {bonusTime >= 0 && (
                    <div className="text-center">
                      <div className=" text-3xl text-center">
                        <h1>{answerStatus}</h1>
                      </div>

                      <div>
                        <h1 className=" px-5 text-2xl text-center">Дополнительное время: </h1>
                        <h1 className=" px-5 text-2xl text-center">{bonusTime} сек</h1>
                      </div>
                    </div>
                  )}
                  {bonusTime === -5 && (
                    <div className="text-center">
                      <div className=" text-3xl text-center">
                        <h1>{answerStatus}</h1>
                      </div>

                      <div>
                        <h1 className=" px-5 text-2xl text-center">Дополнительное время: </h1>
                        <h1 className=" px-5 text-2xl text-center">{bonusTime} сек</h1>
                      </div>
                    </div>
                  )}
                </div>

                {/* <a
                  className={` bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200`}
                  onClick={hideGTSAnswersModalHandler}
                  href=""
                >
                  <FontAwesomeIcon className=" fa-2x" icon={faXmark} />
                </a> */}
              </div>
            </div>

            <div
              className={` w-full ${showAnswerTimer ? "h-[50vh]" : " h-[60vh]"} min-h-96 overflow-hidden overflow-y-scroll rounded-lg my-3 flex flex-col`}
            >
              <div className=" w-full flex flex-col justify-center items-center">
                <div className="   w-full flex  justify-around items-center">
                  <div className=" w-10/12 py-4  grid sm:grid-cols-2 grid-cols-1 gap-6">
                    <AnswerMain></AnswerMain>
                  </div>
                </div>
              </div>
            </div>
            {showAnswerTimer ? (
              <div className=" flex justify-center items-center">
                <div className=" w-11/12">
                  <RemainedTimeAnswerModal></RemainedTimeAnswerModal>
                </div>
              </div>
            ) : (
              <div></div>
            )}

            <FetchAnswerTimeStream></FetchAnswerTimeStream>
          </motion.div>{" "}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnswersModalMain;
