"use client";
import { AppDispatch } from "@/app/store";
import { crossworGamedActions } from "@/app/store/crosswordGameSlice";
import {
  crosswordActions,
  ICrosswordSlice,
  saveCurrentCrosswordInDB,
} from "@/app/store/crosswordSlice";
import { faFolderClosed } from "@fortawesome/free-regular-svg-icons";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const ChooseCrosswordButton = () => {
  const dispatch = useDispatch<AppDispatch>();

  const chooseCrosswordButtonHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(crossworGamedActions.setShowChooseCrosswordModal(true));
  };

  return (
    <article
      onClick={chooseCrosswordButtonHandler}
      className=" cursor-pointer hover:scale-110 transition-all rounded-lg ease-in duration-300  hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow"
    >
      <div className=" flex justify-center items-center flex-col px-5 py-5 ">
        <div className=" h-20 w-20">
          <FontAwesomeIcon className="fa-fw fa-4x" icon={faFolderOpen} />
        </div>

        <div>
          <h1 className=" text-3xl lg:text-2xl text-center font-bold pb-2">Выберете кроссворд</h1>
        </div>
        <div>
          <h1 className=" text-lg lg:text-sm">
            <span className=" text-2xl lg:text-base"></span>И начните игру
          </h1>
        </div>
      </div>
    </article>
  );
};

export default ChooseCrosswordButton;
