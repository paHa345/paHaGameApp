"use client";

import { AppDispatch } from "@/app/store";
import {
  GTSGameFetchStatus,
  IGuessThatSongSlice,
  startGTSGameLaunchAttemptTimer,
} from "@/app/store/guessThatSongSlice";
import { useTelegram } from "@/app/telegramProvider";
import { faFolderOpen, faHeadphonesAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { div } from "framer-motion/client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const StartGameButton = () => {
  // const { user } = useTelegram();
  const dispatch = useDispatch<AppDispatch>();

  const currentAttemptID = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSGameAttemptID
  );
  const startGameStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.startGTSGameLaunchAttemptTimerStatus
  );
  console.log(startGameStatus);
  const startGameHandler = () => {
    let user;
    const params = new URLSearchParams(window.location.hash.slice(1));
    console.log(params.size);

    const initData = params.get("tgWebAppData");
    if (initData !== null) {
      const initDataParams = new URLSearchParams(initData);
      const userParams = initDataParams.get("user") as any;
      user = JSON.parse(userParams);
      console.log(user);
    }
    if (!user) {
      dispatch(
        startGTSGameLaunchAttemptTimer({
          currentAttemptID: currentAttemptID,
          telegramUserID: 777777,
        })
      );
    } else {
      dispatch(
        startGTSGameLaunchAttemptTimer({
          currentAttemptID: currentAttemptID,
          telegramUserID: user?.id,
        })
      );
    }
  };

  return (
    <div className=" flex justify-center items-center w-10/12 ">
      <article
        onClick={startGameHandler}
        className=" flex justify-center items-center cursor-pointer hover:scale-110 transition-all rounded-lg ease-in duration-300  hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-cyan-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow"
      >
        <div className=" flex justify-center items-center flex-col px-5 py-5 ">
          <div className=" h-20 w-20">
            <FontAwesomeIcon
              className={`fa-fw fa-4x ${startGameStatus === GTSGameFetchStatus.Loading ? "animate-spin" : ""} `}
              icon={faHeadphonesAlt}
            />
          </div>

          <div>
            <h1 className=" text-3xl lg:text-2xl text-center font-bold pb-2">Начать попытку</h1>
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
