import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const EndGameModal = () => {
  return (
    <div
      // onClick={hideLoadCrosswordGameModalHandler}
      className="modal-overlay"
    >
      <div className=" modal-wrapper">
        <div className="modal">
          <div className="small-modal-header">
            {/* <LoadCrosswordGameNotification></LoadCrosswordGameNotification> */}
            <div
              className={` mt-10
px-4 mx-4 w-full  hover:scale-105 transition-all rounded-lg ease-in-out delay-50 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
            >
              <div className=" flex flex-col">
                <div className=" flex flex-col gap-2">
                  <div className=" flex flex-col justify-center items-center">
                    <div className=" py-4">
                      <FontAwesomeIcon className=" animate-spin fa-fw fa-2x" icon={faSpinner} />
                    </div>
                  </div>
                  <div className=" flex flex-row justify-around"></div>
                </div>
                <div className=" flex flex-row justify-center"></div>
                <div className=" flex flex-col"></div>
              </div>
            </div>{" "}
          </div>

          {/* {fetchCrosswordsGameStatus === crosswordGameFetchStatus.Resolve &&
            crosswordCardsEl.length === 0 && (
              <div className=" overflow-auto">
                <h1 className=" text-center">Нет доступных кроссвордов</h1>
              </div>
            )} */}
          {/* {createStartAttemptStatus === crosswordGameFetchStatus.Resolve && (
            <div className=" pt-4 sm:grid lg:grid-cols-3 sm:grid-cols-2 gap-6 justify-center items-center overflow-auto h-5/6">
              {crosswordCardsEl}
            </div>
          )} */}

          {/* <AddExercisesSection></AddExercisesSection> */}
          <div className="modal-body"></div>
        </div>
      </div>
    </div>
  );
};

export default EndGameModal;
