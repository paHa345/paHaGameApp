import { useTelegram } from "@/app/telegramProvider";
import { faSquare, faSquareCheck, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";

interface IAttemptProps {
  attempt: {
    completedCorrectly: boolean;
    crosswordID: string;
    crosswordName: string;
    duration: string;
    finishDate: Date;
    isCompleted: boolean;
    startDate: Date;
    telegramID: number;
    telegramUserName?: string;
    _id: string;
    userPhoto?: string;
  };
}
const Attempt = ({ attempt }: IAttemptProps) => {
  const { user } = useTelegram();
  return (
    <>
      <div
        className={` ${user?.id === attempt.telegramID ? "scale-105 " : ""} min-w-full py-2 my-4 transition-all rounded-lg ease-in-out delay-50 bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow`}
      >
        <div className="flex flex-col gap-2">
          <div className=" flex flex-row justify-center items-center gap-2">
            {attempt.userPhoto && (
              <Image
                className=" rounded-lg"
                src={attempt.userPhoto}
                width={50}
                height={50}
                alt="User profile picture"
              />
            )}
            <h1>Имя: </h1>
            <h1> {` ${attempt.telegramUserName}`}</h1>
          </div>
          <div className=" flex flex-row justify-center items-center  gap-1">
            {" "}
            <h1>Telegram ID: </h1>
            <h1>{` ${attempt.telegramID}`}</h1>
          </div>

          <div className=" flex flex-row justify-center items-center  gap-1">
            {" "}
            <h1>Выполнено верно</h1>
            {attempt.completedCorrectly ? (
              <div>
                <FontAwesomeIcon
                  style={{ color: "green" }}
                  className="fa-fw"
                  icon={faSquareCheck}
                />
              </div>
            ) : (
              <div>
                <FontAwesomeIcon style={{ color: "red" }} className="fa-fw" icon={faSquareXmark} />
              </div>
            )}
          </div>
          <div className=" flex flex-row justify-center items-center  gap-1">
            {" "}
            <h1>Времени затрачено</h1>
            <h1>{attempt.duration}</h1>
          </div>
          {/* <div>{attempt.startDate.toLocaleString()}</div>
     <div>{attempt.finishDate?.toLocaleString()}</div> */}
        </div>
      </div>
    </>
  );
};

export default Attempt;
