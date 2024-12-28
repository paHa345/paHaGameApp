import { IAppSlice } from "@/app/store/appStateSlice";
import { faSquare, faSquareCheck, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

interface IAttemptProps {
  numberInLeaderBoard?: number;
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
    firstName?: string;
    lastName?: string;
  };
}
const Attempt = ({ attempt, numberInLeaderBoard }: IAttemptProps) => {
  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  return (
    <>
      <div className=" w-full flex justify-center items-center">
        <div
          className={` ${telegramUser?.id === attempt.telegramID ? "scale-105 " : ""} w-11/12 py-2 my-4 transition-all rounded-sm ease-in-out delay-50 bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow`}
        >
          <div className="flex flex-col gap-2">
            <div className=" flex flex-row justify-center items-center gap-2">
              <p className=" px-2 text-2xl font-bold">{numberInLeaderBoard}</p>
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
              {attempt.telegramUserName !== undefined ? (
                <h1> {` ${attempt.telegramUserName}`}</h1>
              ) : (
                <h1>{`${attempt.firstName} ${attempt.lastName}`}</h1>
              )}
            </div>
            {/* <div className=" flex flex-row justify-center items-center  gap-1">
            {" "}
            <h1>Telegram ID: </h1>
            <h1>{` ${attempt.telegramID}`}</h1>
          </div> */}

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
                  <FontAwesomeIcon
                    style={{ color: "red" }}
                    className="fa-fw"
                    icon={faSquareXmark}
                  />
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
      </div>
    </>
  );
};

export default Attempt;
