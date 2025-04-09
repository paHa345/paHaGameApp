import { GTSGameFetchStatus, IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { faHeadphonesSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector } from "react-redux";

const AnswerStatus = () => {
  const showIsCorrectStatus = useSelector(
    (state: IGuessThatSongSlice) =>
      state.guessThatSongState.currentGTSAttemptData.showIsCorrectStatus
  );

  const nextQuestionNotification = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.nextQuestionNotification
  );

  const checkAnswerStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.checkGTSGameAnswerStatus
  );

  const checkArtistAnswerStatus = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.checkArtistAnswerStatus
  );

  const bonusTime = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.bonusTime
  );

  const answerIsCorrect = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.currentGTSAttemptData.answerIsCorrect
  );

  const artistAnswerIsCorrect = useSelector(
    (state: IGuessThatSongSlice) =>
      state.guessThatSongState.currentGTSAttemptData.artistAnswerIsCorrect
  );

  const answerStatus = answerIsCorrect ? "Верно" : "Ошибка";
  const artistAnswerStatus = artistAnswerIsCorrect ? "Верно" : "Ошибка";

  return (
    <div className=" h-[15vh] min-h-16 modal-header flex justify-start items-center w-full ">
      <div className=" w-full flex justify-end items-center">
        <div className=" w-full flex justify-center items-center flex-col">
          {nextQuestionNotification && (
            <div className=" animate-pulse text-center text-xl px-1 py-1 rounded-md bg-lime-100">
              {" "}
              <h1>{nextQuestionNotification}</h1>
            </div>
          )}
          <div className=" w-full flex justify-center items-center flex-row">
            {checkAnswerStatus === GTSGameFetchStatus.Loading && (
              <div className=" animate-spin">
                <FontAwesomeIcon className=" fa-2x" icon={faHeadphonesSimple} />
              </div>
            )}
            {checkArtistAnswerStatus === GTSGameFetchStatus.Loading && (
              <div className=" animate-spin">
                <FontAwesomeIcon className=" fa-2x" icon={faHeadphonesSimple} />
              </div>
            )}
            {showIsCorrectStatus?.song && (
              <div>
                {answerIsCorrect && (
                  <div className="text-center">
                    <div className=" bg-green-200 text-2xl text-center rounded-md">
                      <h1>{answerStatus}</h1>
                    </div>

                    <div>
                      <h1 className=" px-5 text-xl text-center">Дополнительное время: </h1>
                      <h1 className=" px-5 text-xl text-center">{bonusTime} сек</h1>
                    </div>
                  </div>
                )}
                {!answerIsCorrect && (
                  <div className="text-center">
                    <div className=" bg-red-200 rounded-md text-2xl text-center">
                      <h1>{answerStatus}</h1>
                    </div>

                    <div>
                      <h1 className=" px-5 text-xl text-center">Дополнительное время: </h1>
                      <h1 className=" px-5 text-xl text-center">{bonusTime} сек</h1>
                    </div>
                  </div>
                )}
              </div>
            )}
            {showIsCorrectStatus?.artist && (
              <div>
                {artistAnswerIsCorrect && (
                  <div className="text-center">
                    <div className=" bg-green-200 text-2xl text-center rounded-md">
                      <h1>{artistAnswerStatus}</h1>
                    </div>

                    <div>
                      <h1 className=" px-5 text-xl text-center">Дополнительное время: </h1>
                      <h1 className=" px-5 text-xl text-center">{bonusTime} сек</h1>
                    </div>
                  </div>
                )}
                {!artistAnswerIsCorrect && (
                  <div className="text-center">
                    <div className=" bg-red-200 rounded-md text-2xl text-center">
                      <h1>{artistAnswerStatus}</h1>
                    </div>

                    <div>
                      <h1 className=" px-5 text-xl text-center">Дополнительное время: </h1>
                      <h1 className=" px-5 text-xl text-center">{bonusTime} сек</h1>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* <a
      className={` bg hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200`}
      onClick={hideGTSAnswersModalHandler}
      href=""
    >
      <FontAwesomeIcon className=" fa-2x" icon={faXmark} />
    </a> */}
      </div>
    </div>
  );
};

export default AnswerStatus;
