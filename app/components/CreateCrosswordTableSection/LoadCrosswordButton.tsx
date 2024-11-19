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

  const saveCrosswordHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log("Load");
    dispatch(crosswordActions.showLoadCrosswordModal());
  };

  return (
    <div className=" py-5">
      <Link onClick={saveCrosswordHandler} className=" buttonStandart" rel="stylesheet" href="/">
        <FontAwesomeIcon className=" pr-2" icon={faUpload} />
        Загрузить кроссворд
      </Link>
    </div>
  );
};

export default LoadCrosswordButton;
