import { IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import UploadSongMain from "../UploadSongSection/UploadSongMain";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faPencil } from "@fortawesome/free-solid-svg-icons";
import { div } from "framer-motion/client";

const UpdateQuestionMain = () => {
  const [questionNumber, setQuestionNumber] = useState(0);

  const updatedQuestionNumber = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.updatedQuestionNumber
  );

  const currentAddedGame = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGTSGame
  );

  const updatedAnswersEls =
    currentAddedGame && updatedQuestionNumber ? (
      currentAddedGame[updatedQuestionNumber].answersArr?.map((answer) => {
        return <div>RTY</div>;
      })
    ) : (
      <div>rrr</div>
    );

  console.log(currentAddedGame);

  return (
    <div>
      <div>sdsfsd</div>
      <div>
        <UploadSongMain></UploadSongMain>
      </div>
      <div>
        <h1 className=" text-center text-2xl">Варианты ответов</h1>
        <div>
          <div className=" my-3 py-2 shadow-smallShadow">
            <h1 className=" text-center text-2xl">Количество вариантов ответов</h1>

            <div className=" py-3 flex justify-center items-center">
              <div
                // onClick={setQuestionNumberHandler.bind(4)}
                className={` my-2 ${questionNumber === 4 ? "scale-110 shadow-crosswordGameCellMenuShadow border-2 border-solid border-lime-400" : ""}  border-2 border-solid  cursor-pointer py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
              >
                <h1>4</h1>
              </div>
              <div
                // onClick={setQuestionNumberHandler.bind(6)}
                className={` my-2 ${questionNumber === 6 ? "scale-110 shadow-crosswordGameCellMenuShadow border-2 border-solid border-lime-400" : ""}  border-2 border-solid   cursor-pointer py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
              >
                <h1>6</h1>
              </div>
            </div>
          </div>

          <div className=" grid gap-2 justify-center items-center sm:grid-cols-2">
            {updatedAnswersEls}
          </div>
          <div>
            <div className=" py-5 flex justify-center items-center">
              <div
                // disabled
                // disabled={gameValue <= 0 || createdGameName.length === 0}
                className={` cursor-pointer py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
                // onClick={updateGTSQuestionHandler}
              >
                <FontAwesomeIcon className=" pr-2" icon={faPencil} />
                Обновить вопрос
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateQuestionMain;
