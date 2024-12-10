import { AppDispatch } from "@/app/store";
import {
  crosswordActions,
  ICrosswordSlice,
  saveCurrentCrosswordInDB,
} from "@/app/store/crosswordSlice";
import { faSave } from "@fortawesome/free-regular-svg-icons/faSave";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const LoadCrosswordButton = () => {
  const dispatch = useDispatch<AppDispatch>();

  const saveCrosswordHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Load");
    dispatch(crosswordActions.showLoadCrosswordModal());
  };

  return (
    <div className="py-5">
      <div
        onClick={saveCrosswordHandler}
        className=" text-2xl cursor-pointer py-3 px-3 hover:scale-110 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow"
      >
        <a rel="stylesheet" href="/">
          <FontAwesomeIcon className=" pr-2" icon={faUpload} />
          Загрузить кроссворд
        </a>
      </div>
    </div>
  );
};

export default LoadCrosswordButton;
