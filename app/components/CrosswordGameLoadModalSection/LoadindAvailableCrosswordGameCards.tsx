import { crosswordGameFetchStatus, ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import { faSpinner, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector } from "react-redux";

const LoadindAvailableCrosswordGameCards = () => {
  const fetchCrosswordsGameStatus = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.fetchCrosswordsArrStatus
  );
  return (
    <div className=" animate-pulse w-full">
      <article
        className={` py-2 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardHowerShadow`}
      >
        <div className=" flex flex-col">
          <div className=" flex flex-col gap-2">
            <div className=" flex flex-col justify-center items-center">
              {/* <div className=" flex justify-center items-center pt-5 h-20 w-20">
                <FontAwesomeIcon className="fa-fw fa-3x" icon={faTrophy} />
              </div> */}
              {/* <h1 className=" h-8 w-2/4  bg-slate-600 self-center px-2 rounded-md text-cyan-50 text-center grow text-base text font-bold "> */}
              <div>
                <FontAwesomeIcon
                  className={` ${fetchCrosswordsGameStatus === crosswordGameFetchStatus.Loading ? "animate-spin " : ""}  fa-fw fa-3x`}
                  icon={faSpinner}
                />
              </div>

              {/* <p
                  className={` h-5 w-1/4  bg-slate-800 self-center py-1 px-2 rounded-md text-cyan-50`}
                ></p> */}
              {/* </h1> */}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default LoadindAvailableCrosswordGameCards;
