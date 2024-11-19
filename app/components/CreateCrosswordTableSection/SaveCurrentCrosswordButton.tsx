import { AppDispatch } from "@/app/store";
import { ICrosswordSlice, saveCurrentCrosswordInDB } from "@/app/store/crosswordSlice";
import { faSave } from "@fortawesome/free-regular-svg-icons/faSave";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const SaveCurrentCrosswordButton = () => {
  const dispatch = useDispatch<AppDispatch>();

  const crosswordObj = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.createdCrossword
  );
  const isCompleted = useSelector((state: ICrosswordSlice) => state.crosswordState.isCompleted);

  const name = useSelector((state: ICrosswordSlice) => state.crosswordState.crosswordName);
  const questionsArr = useSelector((state: ICrosswordSlice) => state.crosswordState.questionsArr);

  const crosswordId = useSelector((state: ICrosswordSlice) => state.crosswordState.crosswordId);

  const saveCrosswordHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(
      saveCurrentCrosswordInDB({ crosswordObj, name, isCompleted, questionsArr, crosswordId })
    );
  };

  return (
    <div className=" py-5">
      <Link onClick={saveCrosswordHandler} className=" buttonStandart" rel="stylesheet" href="/">
        <FontAwesomeIcon className=" pr-2" icon={faSave} />
        Сохранить кроссворд
      </Link>
    </div>
  );
};

export default SaveCurrentCrosswordButton;
