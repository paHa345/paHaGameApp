import { AppDispatch } from "@/app/store";
import {
  createAttemptAndAddInSlice,
  GTSGameFetchStatus,
  IGuessThatSongSlice,
} from "@/app/store/guessThatSongSlice";
import { useTelegram } from "@/app/telegramProvider";
import { faHeadphones, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { redirect } from "next/navigation";

interface IGTSGameCard {
  GTSGameData: {
    _id: string;
    name: string;
    changeDate: Date;
  };
}
const AvailableGTSGameCard = ({ GTSGameData }: IGTSGameCard) => {
  const dispatch = useDispatch<AppDispatch>();
  // const { user } = useTelegram();

  const loadGTSGameStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.fetchAvailableGTSGameStatus
  );

  const loadGTSGameHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let user;
    const hash = window.location.hash;
    console.log(hash);

    console.log(`hash: ${hash}`);

    const params = new URLSearchParams(hash);
    console.log(`params: ${params}`);
    if (params.get("tgWebAppData") !== null) {
      // const initDataParams = new URLSearchParams(initData);
      // const userParams = initDataParams.get("user") as any;
      // user = JSON.parse(userParams);
      // console.log(user);
    }

    if (user) {
      // dispatch(
      //   createAttemptAndAddInSlice({
      //     GTSGameID: GTSGameData._id,
      //     telegramID: user?.id,
      //     telegramUserName: user?.username,
      //   })
      // );
    } else {
      dispatch(
        createAttemptAndAddInSlice({
          GTSGameID: GTSGameData._id,
          telegramID: 777777,
          telegramUserName: "paHa345",
        })
      );
    }

    setTimeout(() => {
      redirect("/guessThatSongGame/game");
    }, 2000);

    console.log("Load GTS Game");
    console.log(GTSGameData._id);
  };
  return (
    <div className=" flex flex-col justify-center items-center ">
      <article
        onClick={loadGTSGameHandler}
        className={` ${loadGTSGameStatus === GTSGameFetchStatus.Ready ? "cursor-pointer" : ""} w-10/12  px-2 mx-4  hover:scale-105 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-cyan-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
      >
        <div className=" flex flex-col">
          <div className=" flex flex-col gap-2">
            <div className=" flex flex-col justify-center items-center">
              <div className=" text-slate-800 flex justify-center items-center pt-5 h-14 w-14">
                <FontAwesomeIcon className="fa-fw fa-2x" icon={faHeadphones} />
              </div>
              <h1 className=" text-center grow text-2xl text font-bold pl-1 py-2 my-2 sm:py-8 sm:my-8">
                {GTSGameData.name}
              </h1>
            </div>
            <div className=" flex flex-row justify-around"></div>
          </div>
          <div className=" flex flex-row justify-center"></div>
          <div className=" flex flex-col"></div>
        </div>
      </article>
    </div>
  );
};

export default AvailableGTSGameCard;
