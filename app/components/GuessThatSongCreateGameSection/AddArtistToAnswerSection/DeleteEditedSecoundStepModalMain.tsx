import { AppDispatch } from "@/app/store";
import { GTSCreateGameActions } from "@/app/store/GTSCreateGameSlice";
import { faClose, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch } from "react-redux";

const DeleteEditedSecoundStepModalMain = () => {
  const dispatch = useDispatch<AppDispatch>();

  const hideDeleteQuestionModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(GTSCreateGameActions.setDeleteEditedQuestionSecoundStapModalStatus(false));
  };

  const deleteQuestionSecoundStepHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Delete");

    dispatch(GTSCreateGameActions.deleteEditedQuestionSecoundStepAnswer());
    dispatch(GTSCreateGameActions.setDeleteEditedQuestionSecoundStapModalStatus(false));
  };

  return (
    <div
      // onClick={hideLoadCrosswordGameModalHandler}
      className="modal-overlay"
    >
      <div className=" small-modal-wrapper">
        <div className="modal justify-center items-center flex">
          <div className="small-modal-header ">
            <div className=" h-3/5 flex flex-col flex-wrap gap-3 justify-center items-center">
              {/* {finishAttemptStatus === crosswordGameFetchStatus.Error && (
                <div
                  className={` px-4   bg-gradient-to-tr from-secoundaryColor to-red-400 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
                >
                  <div className=" flex flex-col">
                    <div className=" flex flex-col gap-2">
                      <div className=" flex flex-row justify-center items-center">
                        <h1 className=" text-base text-center grow font-bold pl-1 py-2 my-2 ">
                          Не удалось отправить данные. Повторите попытку позже
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}

              <div
                onClick={deleteQuestionSecoundStepHandler}
                className={` cursor-pointer w-full px-4 hover:scale-105 duration-200 rounded-lg ease-in hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
              >
                <div className=" flex flex-col">
                  <div className=" flex flex-col gap-2">
                    <div className=" flex flex-row   justify-center items-center">
                      <div className=" flex justify-center items-center">
                        <FontAwesomeIcon className="fa-fw fa-2x" icon={faTrashCan} />
                      </div>
                      <h1 className=" font-light text-2xl text-center grow pl-1 py-2 my-2">
                        Удалить 2 шаг вопроса
                      </h1>
                    </div>
                  </div>
                </div>
              </div>

              {/* 
              {finishAttemptStatus === crosswordGameFetchStatus.Loading && (
                <div
                  className={` w-full px-4 hover:scale-105 duration-200 rounded-lg ease-in hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-lime-200 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
                >
                  <div className=" flex flex-col">
                    <div className=" flex flex-col gap-2">
                      <div className=" py-4 flex justify-center items-center">
                        <FontAwesomeIcon className=" animate-spin fa-fw fa-3x" icon={faSpinner} />
                      </div>
                    </div>
                  </div>
                </div>
              )} */}

              <div
                onClick={hideDeleteQuestionModal}
                className={` cursor-pointer  px-4  hover:scale-105 duration-200 rounded-lg ease-in hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-red-400 shadow-exerciseCardShadow hover:shadow-exerciseCardHowerShadow`}
              >
                <div className=" flex flex-col">
                  <div className=" flex flex-col gap-2">
                    <div className=" flex flex-row justify-center items-center">
                      <div className=" flex justify-center items-center">
                        <FontAwesomeIcon className="fa-fw fa-2x" icon={faClose} />
                      </div>
                      <h1 className=" text-xl text-center grow font-bold pl-1 py-2 my-2 ">
                        Отмена
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-body"></div>
        </div>
      </div>
    </div>
  );
};

export default DeleteEditedSecoundStepModalMain;
