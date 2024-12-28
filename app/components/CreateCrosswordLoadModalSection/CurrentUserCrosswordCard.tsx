import { AppDispatch } from "@/app/store/index";
import { getCurrentUserCrosswordAndSetInState } from "@/app/store/crosswordSlice";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";

interface ICrosswordCard {
  crosswordData: {
    _id: String;
    name: string;
    isCompleted: boolean;
    changeDate: Date;
  };
}

const CurrentUserCrosswordCard = ({ crosswordData }: ICrosswordCard) => {
  const dispatch = useDispatch<AppDispatch>();
  const loadCrosswordHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(getCurrentUserCrosswordAndSetInState(crosswordData._id));
  };
  return (
    <article className="  transition-shadow px-1 py-1 bg-gradient-to-tr from-secoundaryColor to-slate-200 rounded-lg shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow">
      <div className=" flex flex-col">
        <div className=" flex flex-col gap-2">
          <div className=" flex justify-center items-center">
            <h1 className=" text-center grow text-base text font-bold pl-1 pt-1">
              {crosswordData.name}
            </h1>
          </div>
          <div className=" flex flex-row justify-around">
            <p
              className={` ${crosswordData.isCompleted ? "bg-green-800" : "bg-isolatedColour"} self-center py-1 px-2 rounded-md text-cyan-50`}
            >
              {crosswordData.isCompleted ? "Опубликован" : "В работе"}
            </p>
          </div>
        </div>
        <div className=" flex flex-row justify-center"></div>
        <div className=" flex flex-col">
          <div className=" self-end pt-1">
            Изменено:{" "}
            <span className=" text-sm font-bold">
              {new Date(crosswordData.changeDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        <button
          onClick={loadCrosswordHandler}
          className=" py-2 bg-mainColor hover:bg-mainGroupColour rounded-md"
        >
          Загрузить кроссворд
        </button>
      </div>
    </article>
  );
};

export default CurrentUserCrosswordCard;
