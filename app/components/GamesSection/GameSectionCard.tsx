import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarOn, faChessBoard, faHeadphonesAlt } from "@fortawesome/free-solid-svg-icons";

interface IGameSectionProps {
  gameData: {
    link?: string;
    title: string;
    description: string;
    image?: string;
    backgroundColor: string;
    secondaryColor?: string;
  };
}
const GameSectionCard = ({ gameData }: IGameSectionProps) => {
  const chooseGameCardHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // e.preventDefault();
    console.log(gameData);
  };
  const image = gameData.image;
  return (
    <Link onClick={chooseGameCardHandler} href={`/${gameData.link}`}>
      <article
        className={`hover:scale-110 transition-all rounded-lg ease-in-out duration-500 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-${gameData.backgroundColor}-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
      >
        <div className=" flex justify-center items-center flex-col px-5 py-5 ">
          <div className=" h-10 w-10"></div>
          {image === "crossword" && <FontAwesomeIcon className="fa-fw fa-2x" icon={faChessBoard} />}
          {image === "headphones" && (
            <FontAwesomeIcon className="fa-fw fa-2x" icon={faHeadphonesAlt} />
          )}
          {image === "car" && <FontAwesomeIcon className="fa-fw fa-2x" icon={faCarOn} />}

          <div>
            <h1 className=" text-3xl lg:text-2xl text-center font-bold pb-2">{gameData.title}</h1>
          </div>
          <div>
            <h1 className=" text-lg lg:text-sm">
              <span className=" text-2xl lg:text-base">Описание: </span>
              {gameData.description}
            </h1>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default GameSectionCard;
