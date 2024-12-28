import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessBoard } from "@fortawesome/free-solid-svg-icons";

const GameSectionCard = () => {
  return (
    <Link href={"/crosswordGame"}>
      <article className=" hover:scale-110 transition-all rounded-lg ease-in-out duration-500 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow">
        <div className=" flex justify-center items-center flex-col px-5 py-5 ">
          <div className=" h-10 w-10">
            <FontAwesomeIcon className="fa-fw fa-2x" icon={faChessBoard} />
          </div>

          <div>
            <h1 className=" text-3xl lg:text-2xl text-center font-bold pb-2">Кроссворды</h1>
          </div>
          <div>
            <h1 className=" text-lg lg:text-sm">
              <span className=" text-2xl lg:text-base">Описание: </span>
              Сможешь разгадать кроссворд быстрее других игроков?
            </h1>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default GameSectionCard;
