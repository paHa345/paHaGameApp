import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import UploadSongMain from "../UploadSongSection/UploadSongMain";
import { useDispatch, useSelector } from "react-redux";
import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import GTSAnswer from "../GTSAddSongQuectionSection/GTSAnswer";
import UpdatedQuestionAnswer from "./UpdatedQuestionAnswer";
import { AppDispatch } from "@/app/store";
import UpdatedQuestionSong from "./UpdatedQuestionSong";
import UploadImageMain from "../UploadImageSection/UploadImageMain";
import UpdatedQuestionImage from "./UpdatedQuestionImage";
import UpdateQuestionArtistAnswer from "./UpdateQuestionArtistAnswer";
import AddArtistToAnswerMain from "../AddArtistToAnswerSection/AddArtistToAnswerMain";

const UpdateQuestion = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [questionNumber, setQuestionNumber] = useState(0);

  const updatedQuestionNumber = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.updatedQuestionNumber
  );

  const currentAddedGame = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGTSGame
  );

  const currentUpdatedQuestion = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.updatedQuestionNumber
  );

  if (currentUpdatedQuestion !== undefined) {
    console.log(currentAddedGame[currentUpdatedQuestion].secoundStep);
  }

  const updateQuestionNumberHandler = function (this: number, e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setQuestionNumber(this);
    // dispatch(GTSCreateGameActions.setAnswersArr([...Array(this)]));
    // console.log(currentUpdatedQuestion);
    if (currentUpdatedQuestion !== undefined) {
      dispatch(
        GTSCreateGameActions.updateAnswersArr({
          updatedQuestion: currentUpdatedQuestion,
          setAnswerNumber: this,
        })
      );
    }
    dispatch(
      GTSCreateGameActions.updateCorrectAnswerNumber({
        updatedAnswer: updatedQuestionNumber,
        correctAnswerIndex: 0,
      })
    );
  };

  const updatedAnswersEls =
    currentAddedGame !== undefined &&
    updatedQuestionNumber !== undefined &&
    updatedQuestionNumber > -1 ? (
      currentAddedGame[updatedQuestionNumber].answersArr?.map((answer, index) => {
        // console.log(answer.text);
        return (
          <div key={index}>
            {" "}
            <UpdatedQuestionAnswer text={answer.text} index={index}></UpdatedQuestionAnswer>
          </div>
        );
      })
    ) : (
      <div>rrr</div>
    );

  const updatedArtistListEls =
    currentAddedGame !== undefined &&
    updatedQuestionNumber !== undefined &&
    currentAddedGame[updatedQuestionNumber].secoundStep?.correctAnswerIndex !== undefined &&
    updatedQuestionNumber > -1 ? (
      currentAddedGame[updatedQuestionNumber].secoundStep?.secoundStepAnswerArr.map((el, index) => {
        // console.log(answer.text);
        return (
          <div key={index}>
            {" "}
            <UpdateQuestionArtistAnswer
              text={el.text}
              index={index}
              isCorrect={el.isCorrect}
            ></UpdateQuestionArtistAnswer>
          </div>
        );
      })
    ) : (
      <div>rrr</div>
    );

  const stopUpdateQuestionHandler = () => {
    dispatch(GTSCreateGameActions.setGameIsBeingUpdated(false));
    dispatch(GTSCreateGameActions.setUpdatedQuestionNumber(undefined));
  };

  console.log(currentUpdatedQuestion);
  console.log(currentAddedGame);

  return (
    <div className=" flex justify-center items-center flex-col w-11/12">
      <h1 className=" text-2xl text-center py-3"> Редактирование вопроса</h1>
      <div className="my-3 py-2 px-2 flex justify-center items-center flex-col shadow-smallShadow w-full">
        <div>
          <div className=" py-3">
            {" "}
            <h1 className=" text-center text-2xl">Редактирование песни</h1>
          </div>
        </div>
        <div>
          <UploadSongMain></UploadSongMain>
        </div>

        <UpdatedQuestionSong></UpdatedQuestionSong>
      </div>

      <div className="my-3 py-2 px-2 flex justify-center items-center flex-col shadow-smallShadow w-full">
        <div>
          <div className=" py-3">
            {" "}
            <h1 className=" text-center text-2xl">Редактирование изображения</h1>
          </div>
        </div>
        <div>
          <UploadImageMain></UploadImageMain>
        </div>

        <UpdatedQuestionImage></UpdatedQuestionImage>
      </div>

      <div>
        <h1 className=" text-center text-2xl">Варианты ответов</h1>
        <div>
          <div className=" my-3 py-2 shadow-smallShadow">
            <h1 className=" text-center text-2xl">Количество вариантов ответов</h1>

            <div className=" py-3 flex justify-center items-center">
              <div
                onClick={updateQuestionNumberHandler.bind(4)}
                className={` my-2 ${questionNumber === 4 ? "scale-110 shadow-crosswordGameCellMenuShadow border-2 border-solid border-lime-400" : ""}  border-2 border-solid  cursor-pointer py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
              >
                <h1>4</h1>
              </div>
              <div
                onClick={updateQuestionNumberHandler.bind(6)}
                className={` my-2 ${questionNumber === 6 ? "scale-110 shadow-crosswordGameCellMenuShadow border-2 border-solid border-lime-400" : ""}  border-2 border-solid   cursor-pointer py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
              >
                <h1>6</h1>
              </div>
            </div>
          </div>

          <div className=" grid gap-2 justify-center items-center sm:grid-cols-2">
            {updatedAnswersEls}
          </div>

          <AddArtistToAnswerMain></AddArtistToAnswerMain>

          {currentUpdatedQuestion !== undefined &&
            currentAddedGame[currentUpdatedQuestion].secoundStep !== undefined && (
              <div>
                <h1 className=" py-4 text-center text-2xl">Варианты ответов 2 этап</h1>
                <div className=" grid gap-2 justify-center items-center sm:grid-cols-2">
                  {updatedQuestionNumber !== undefined &&
                    currentAddedGame[updatedQuestionNumber].secoundStep.correctAnswerIndex !==
                      undefined &&
                    updatedArtistListEls}
                </div>
              </div>
            )}

          {/* {currentUpdatedQuestion !== undefined &&
          currentAddedGame[currentUpdatedQuestion].secoundStep === undefined ? (
            <AddArtistToAnswerMain></AddArtistToAnswerMain>
          ) : (
            <div>
              <h1 className=" py-4 text-center text-2xl">Варианты ответов 2 этап</h1>
              <div className=" grid gap-2 justify-center items-center sm:grid-cols-2">
                {updatedArtistListEls}
              </div>
            </div>
          )} */}

          <div>
            <div className=" py-5 flex justify-center items-center">
              <div
                // disabled
                // disabled={gameValue <= 0 || createdGameName.length === 0}
                className={` text-center cursor-pointer py-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
                onClick={stopUpdateQuestionHandler}
              >
                <FontAwesomeIcon className=" pr-2" icon={faPencil} />
                Закончить редактирование вопроса
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateQuestion;
