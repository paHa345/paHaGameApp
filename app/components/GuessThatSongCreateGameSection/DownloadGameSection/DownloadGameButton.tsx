import { AppDispatch } from "@/app/store";
import {
  crosswordActions,
  ICrosswordSlice,
  saveCurrentCrosswordInDB,
} from "@/app/store/crosswordSlice";
import { GTSCreateGameActions } from "@/app/store/GTSCreateGameSlice";
import { faSave } from "@fortawesome/free-regular-svg-icons/faSave";
import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
const DownloadGameButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const showDownloadGameModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(GTSCreateGameActions.setDownloadModalStatus(true));
  };
  return (
    <div className="py-5 flex justify-center items-center">
      <div
        onClick={showDownloadGameModal}
        className=" sm:w-2/4 w-10/12 text-2xl cursor-pointer py-3 px-3 hover:scale-110 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-cyan-400 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow"
      >
        <h1 className=" text-center" rel="stylesheet">
          <FontAwesomeIcon className=" pr-2" icon={faDownload} />
          Загрузить игру
        </h1>
      </div>
    </div>
  );
};

export default DownloadGameButton;
