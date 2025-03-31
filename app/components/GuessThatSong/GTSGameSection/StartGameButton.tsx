"use client";

import { AppDispatch } from "@/app/store";
import {
  createAttemptAndAddInSlice,
  GTSGameFetchStatus,
  guessThatSongActions,
  IGuessThatSongSlice,
  startGTSGameLaunchAttemptTimer,
} from "@/app/store/guessThatSongSlice";
import { useTelegram } from "@/app/telegramProvider";
import { faFolderOpen, faHeadphonesAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { div } from "framer-motion/client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isTelegramWebApp } from "../../Layout/MainLayout";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import StartGameButtonText from "./StartGameButtonText";

const StartGameButton = () => {
  // const { user } = useTelegram();
  const dispatch = useDispatch<AppDispatch>();

  const currentAttemptID = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSGameAttemptID
  );
  const startGameStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.startGTSGameLaunchAttemptTimerStatus
  );

  const currentNumberAttemptQuestion = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.currentQuestion
  );

  const startGameHandler = () => {
    if (isTelegramWebApp()) {
      const { initData } = retrieveLaunchParams();

      dispatch(
        startGTSGameLaunchAttemptTimer({
          currentAttemptID: currentAttemptID,
          telegramUserID: initData?.user?.id,
        })
      );
    } else {
      dispatch(
        startGTSGameLaunchAttemptTimer({
          currentAttemptID: currentAttemptID,
          telegramUserID: 777777,
        })
      );
    }

    // if (!user) {
    //   dispatch(
    //     startGTSGameLaunchAttemptTimer({
    //       currentAttemptID: currentAttemptID,
    //       telegramUserID: 777777,
    //     })
    //   );
    // } else {
    //   dispatch(
    //     startGTSGameLaunchAttemptTimer({
    //       currentAttemptID: currentAttemptID,
    //       telegramUserID: user?.id,
    //     })
    //   );
    // }
  };

  // useEffect(() => {
  //   console.log("Start Game effect");
  //   if (isTelegramWebApp()) {
  //     const { initData } = retrieveLaunchParams();
  //     dispatch(
  //       createAttemptAndAddInSlice({
  //         GTSGameID: currentAttemptID,
  //         telegramID: initData?.user?.id,
  //         telegramUserName: initData?.user?.username,
  //       })
  //     );
  //   } else {
  //     dispatch(
  //       createAttemptAndAddInSlice({
  //         GTSGameID: currentAttemptID,
  //         telegramID: 777777,
  //         telegramUserName: "paHa345",
  //       })
  //     );
  //   }
  // });

  return (
    <div className=" flex justify-center items-center w-10/12 ">
      <article
        onClick={startGameHandler}
        className=" flex justify-center items-center cursor-pointer hover:scale-110 transition-all rounded-lg ease-in duration-200  hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-cyan-200 shadow-cardElementShadow "
      >
        <div className=" flex justify-center items-center flex-col px-5 py-5 ">
          <div className=" h-20 w-20">
            <FontAwesomeIcon
              className={`fa-fw fa-4x ${startGameStatus === GTSGameFetchStatus.Loading ? "animate-spin" : ""} `}
              icon={faHeadphonesAlt}
            />
          </div>

          <div>
            <div className=" text-3xl lg:text-2xl text-center font-bold pb-2">
              <StartGameButtonText></StartGameButtonText>
            </div>
          </div>
          {/* <div>
            <h1 className=" text-lg lg:text-sm">
              <span className=" text-2xl lg:text-base"></span>И отгадывайте песни
            </h1>
          </div> */}
        </div>
      </article>
    </div>
  );
};

export default StartGameButton;
