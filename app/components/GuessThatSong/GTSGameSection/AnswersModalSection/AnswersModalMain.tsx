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
import AnswerStatus from "./AnswerStatus";

const AnswersModalMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const bonusTime = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.bonusTime
  );

  const showGTSAnswersModal = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.showGTSAnswersModal
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

  // const answersEls = currentGTSAnswers.map((answer, index) => {
  //   return (
  //     <div key={answer._id} className="w-full">
  //       <GTSGameAnswer id={answer._id} answerText={answer.text}></GTSGameAnswer>
  //     </div>
  //   );
  // });

  // const artistAnswerEl = artistAnswersArr.map((answer, index) => {
  //   return (
  //     <div key={answer._id} className="w-full">
  //       <ArtistAnswer text={answer.text} artistAnswerID={answer._id}></ArtistAnswer>
  //     </div>
  //   );
  // });

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
            className=" w-11/12 h-[95%] flex flex-col bg-modalMainColor rounded-lg"
            variants={modalVariant}
            // initial="hidden"
            // animate="visible"
            // exit="exit"
          >
            <AnswerStatus></AnswerStatus>

            <div
              className={` w-full ${showAnswerTimer ? "h-[50vh]" : " h-[75vh]"} min-h-96 overflow-hidden overflow-y-scroll rounded-lg my-3 flex flex-col`}
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
