import { AppDispatch } from "@/app/store";
import { finishAttempt, ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import { useTelegram } from "@/app/telegramProvider";
import { faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const EndGameButton = () => {
  const { user } = useTelegram();
  const dispatch = useDispatch<AppDispatch>();
  const attemptID = useSelector((state: ICrosswordGameSlice) => state.crosswordGameState.attemptID);

  const finishAttemptStatus = useSelector(
    (state: ICrosswordGameSlice) => state.crosswordGameState.finishAttemptStatus
  );

  const finishAttemptHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Finish attempt");
    if (!user) {
      const attemptData = {
        attemptID: attemptID,
        telegramUser: "paHa345",
        telegramID: 7777777,
      };
      console.log(attemptData);
      dispatch(finishAttempt(attemptData));
    } else {
      const attemptData = {
        attemptID: attemptID,
        telegramUser: user?.username,
        telegramID: user?.id,
      };

      dispatch(finishAttempt(attemptData));
    }
    // Dispatch action to finish the current attempt and update the state
    // Example: dispatch(searchExerciseActions.finishAttempt());
  };
  return (
    // {finishAttemptStatus===f}
    <div onClick={finishAttemptHandler} className=" flex justify-center items-center">
      <div
        className={` cursor-pointer w-2/4 px-4 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
      >
        <div className=" flex flex-col">
          <div className=" flex flex-col gap-2">
            <div className=" flex flex-row justify-center items-center">
              <div className=" flex justify-center items-center">
                <FontAwesomeIcon className="fa-fw fa-2x" icon={faFlagCheckered} />
              </div>
              <h1 className=" font-light text-2xl text-center grow pl-1 py-2 my-2">
                Закончить попытку
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndGameButton;
