import { GTSGameFetchStatus, IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector } from "react-redux";

interface IGTSGameCard {
  GTSGameData: {
    _id: string;
    name: string;
    changeDate: Date;
  };
}
const AvailableGTSGameCard = ({ GTSGameData }: IGTSGameCard) => {
  const loadGTSGameStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.fetchAvailableGTSGameStatus
  );

  const loadGTSGameHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    console.log("Load GTS Game");
  };
  return (
    <div className=" flex flex-col justify-center items-center ">
      <article
        onClick={loadGTSGameHandler}
        className={` ${loadGTSGameStatus === GTSGameFetchStatus.Ready ? "cursor-pointer" : ""} w-10/12  px-2 mx-4  hover:scale-105 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
      >
        <div className=" flex flex-col">
          <div className=" flex flex-col gap-2">
            <div className=" flex flex-col justify-center items-center">
              <div className=" text-slate-800 flex justify-center items-center pt-5 h-14 w-14">
                <FontAwesomeIcon className="fa-fw fa-2x" icon={faTrophy} />
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
