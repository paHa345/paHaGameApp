import React from "react";

interface IGTSGameProps {
  GTSGame: {
    _id: string;
    name: string;
    userID: string;
    changeDate: Date;
    isCompleted: boolean;
  };
}

const GTSGameCard = ({ GTSGame }: IGTSGameProps) => {
  return (
    <article className="  transition-shadow px-1 py-1 bg-gradient-to-tr from-secoundaryColor to-slate-200 rounded-lg shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow">
      <div className=" flex flex-col">
        <div className=" flex flex-col gap-2">
          <div className=" flex justify-center items-center">
            <h1 className=" text-center grow text-base text font-bold pl-1 pt-1">{GTSGame.name}</h1>
          </div>
          <div className=" flex flex-row justify-around">
            <p
              className={` ${GTSGame.isCompleted ? "bg-green-800" : "bg-isolatedColour"} self-center py-1 px-2 rounded-md text-cyan-50`}
            >
              {GTSGame.isCompleted ? "Опубликован" : "В работе"}
            </p>
          </div>
        </div>
        <div className=" flex flex-row justify-center"></div>
        <div className=" flex flex-col">
          <div className=" self-end pt-1">
            Изменено:{" "}
            <span className=" text-sm font-bold">
              {new Date(GTSGame.changeDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        <button
          //   onClick={loadCrosswordHandler}
          className=" py-2 bg-mainColor hover:bg-mainGroupColour rounded-md"
        >
          Загрузить кроссворд
        </button>
      </div>
    </article>
  );
};

export default GTSGameCard;
