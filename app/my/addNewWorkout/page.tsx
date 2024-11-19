"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IAddWorkoutSlice,
  IAddedExercises,
  addWorkout,
  addWorkoutActions,
} from "../../store/addWorkoutSlice";
import AddExercisesSection from "@/app/components/AddWorkoutSection/AddExercisesSection";
import Link from "next/link";
import { AppDispatch } from "@/app/store";
import AddExerciseModal from "../../components/AddExerciseModalSection/AddExerciseModal";
import { IAppSlice, appStateActions } from "@/app/store/appStateSlice";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ICoachSlice } from "@/app/store/coachSlice";
import StudentsList from "@/app/components/AddWorkoutSection/StudentsList";

const addNewWorkout = () => {
  const dispatch = useDispatch<AppDispatch>();

  const session = useSession();

  const name = useSelector(
    (state: IAddWorkoutSlice) => state.addWorkoutState.currentAddedWorkout.name
  );
  const description = useSelector(
    (state: IAddWorkoutSlice) => state.addWorkoutState.currentAddedWorkout.description
  );

  const addedExercises = useSelector(
    (state: IAddWorkoutSlice) => state.addWorkoutState.currentAddedWorkout.exercises
  );

  const workoutDate = useSelector(
    (state: IAddWorkoutSlice) => state.addWorkoutState.currentAddedWorkout.workoutDate
  );
  const fetchAddWorkoutStatus = useSelector(
    (state: IAddWorkoutSlice) => state.addWorkoutState.fetchAddWorkoutStatus
  );

  const id = useSelector(
    (state: IAddWorkoutSlice) => state.addWorkoutState.currentAddedWorkout.addedWorkoutId
  );

  const addedUers = useSelector((state: IAddWorkoutSlice) => state.addWorkoutState.addedUsers);

  const showAddExerciseModal = useSelector(
    (state: IAppSlice) => state.appState.showAddExerciseModal
  );

  useEffect(() => {
    // если fetchAddWorkoutStatus === error или resolve, то
    // зурастить таймер, который через 3 сек переключит fetchAddWorkoutStatus
    // на ready с помощью dispatch addWorkoutSlice action
    if (fetchAddWorkoutStatus === "resolve" || fetchAddWorkoutStatus === "error") {
      setTimeout(() => {
        dispatch(addWorkoutActions.setFetchAddWorkoutStatusToReady());
      }, 3000);
    }
  }, [fetchAddWorkoutStatus]);

  const showAddExerciseModalHandler = () => {
    dispatch(appStateActions.showAddExerciseModal());
  };

  const [onFocusStatus, setInFocusStatus] = useState({
    name: false,
    description: false,
  });

  const changeNameHandler = (e: React.FormEvent<HTMLInputElement>) => {
    dispatch(addWorkoutActions.setName(e.currentTarget.value));
  };

  const changeDescriptionHandler = (e: React.FormEvent<HTMLInputElement>) => {
    dispatch(addWorkoutActions.setDescription(e.currentTarget.value));
  };

  const focusElHandler = (e: React.FocusEvent<HTMLElement>) => {
    e.target.id === "name"
      ? setInFocusStatus({ ...onFocusStatus, name: true })
      : setInFocusStatus({ ...onFocusStatus, description: true });
  };

  const focusOutElHandler = (e: React.FocusEvent<HTMLElement>) => {
    e.target.id === "name"
      ? setInFocusStatus({ ...onFocusStatus, name: false })
      : setInFocusStatus({ ...onFocusStatus, description: false });
  };

  const addWorkoutHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await dispatch(addWorkoutActions.setFetchAddWorkoutStatusToLoading());

    const currentUserReq = await fetch("./../api/users/getUserByEmail");
    // типизировать ответ от сервера
    const currentUser = await currentUserReq.json();
    console.log(currentUser.result._id);
    const addedUsersIdArr = addedUers.map((user) => {
      return user.id;
    });

    const currentWorkout = {
      name: name,
      comments: description,
      exercisesArr: addedExercises,
      date: workoutDate,
      userId: currentUser.result._id,
      studentsIdArr: addedUsersIdArr,
    };
    dispatch(addWorkout(currentWorkout));
  };

  const changeSetsHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      addWorkoutActions.changeSetsAmount({
        value: e.target.value,
        exerciseId: e.target.dataset.exerciseid,
        index: e.target.dataset.index,
      })
    );
  };
  const changeRepsHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      addWorkoutActions.changeRepsAmount({
        value: e.target.value,
        exerciseId: e.target.dataset.exerciseid,
        index: e.target.dataset.index,
      })
    );
  };

  const deleteExerciseFromWorkoutHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    dispatch(addWorkoutActions.deleteExerciseFromWorkout(e.currentTarget.dataset.number));
  };

  const addedExercisesElement =
    addedExercises.length === 0 ? (
      <div className=" flex flex-col justify-center my-4 bg-slate-200 rounded-lg">
        <h1 className=" mx-auto text-sm">Не добавлено упражнений</h1>
      </div>
    ) : (
      addedExercises?.map((addedExercise: IAddedExercises, index) => {
        return (
          <div
            className="flex flex-row border-solid border-gray-200 rounded-md border-2 px-3 py-3 shadow-cardElementShadow"
            key={`${addedExercise.exercise}_${index}`}
          >
            <div className=" w-3/5">
              <Link className=" hover:underline" href={`../catalog/${addedExercise.exercise}`}>
                {addedExercise.name}
              </Link>
            </div>
            <div className=" w-2/5 flex flex-col">
              <div className=" flex flex-col justify-center">
                <label htmlFor="">Подходов</label>
                <div className=" self-center border-current ">
                  <input
                    data-index={index}
                    data-exerciseid={addedExercise.exercise}
                    className="w-4/5  hover:border-slate-400 focus:border-slate-400 border-solid rounded border-2  border-slate-200"
                    onChange={changeSetsHandler}
                    type="number"
                    value={addedExercise.sets}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <label htmlFor="">Повторений</label>
                <div className=" self-center">
                  <input
                    data-index={index}
                    data-exerciseid={addedExercise.exercise}
                    className="w-4/5  hover:border-slate-400 focus:border-slate-400 border-solid rounded border-2  border-slate-200"
                    onChange={changeRepsHandler}
                    type="number"
                    value={addedExercise.reps}
                  />
                </div>
              </div>
            </div>
            <div className=" w-8 ">
              <div className=" hover:bg-slate-400 px-2 py-1 rounded-full  hover:border-slate-400 border-solid border-2  border-slate-200">
                <FontAwesomeIcon
                  data-number={index}
                  icon={faXmark}
                  onClick={deleteExerciseFromWorkoutHandler}
                />
              </div>
            </div>
          </div>
        );
      })
    );

  const changeDateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(String(e.target.value));
    dispatch(addWorkoutActions.setWorkoutDate(e.target.value));
  };

  return (
    <div className="  mx-auto py-8">
      <div>
        <div className="pb-6">
          <h1 className=" text-center text-2xl font-bold">Добавить новую тренировку</h1>
        </div>

        <div className=" shadow-exerciseCardHowerShadow p-3 max-w-xl mx-auto rounded-md border-solid border-2 border-stone-500">
          <div className="  w-11/12 mx-auto">
            <div>
              <StudentsList></StudentsList>
            </div>
            <div className=" relative py-4">
              <input
                onChange={changeNameHandler}
                onFocus={focusElHandler}
                onBlur={focusOutElHandler}
                className="w-full  py-3 z-0 hover:border-slate-400 focus:border-slate-400 border-solid rounded border-2  border-slate-200"
                id="name"
                type="text"
                value={name}
              />
              <span>
                <label
                  htmlFor="name"
                  className={` absolute transition-all ease-in-out ${
                    onFocusStatus.name || name.length > 0
                      ? "z-10 top-1 left-0  bg-white   scale-75"
                      : " top-1/3 left-2"
                  }`}
                >
                  Название тренировки
                </label>
              </span>
            </div>

            <div className="py-4 relative">
              <input
                onChange={changeDescriptionHandler}
                onFocus={focusElHandler}
                onBlur={focusOutElHandler}
                value={description}
                className=" w-full py-3 z-0 hover:border-slate-400 focus:border-slate-400 border-solid rounded border-2  border-slate-200"
                id="description"
                type="text"
              />
              <span>
                <label
                  className={` absolute transition-all ease-in-out ${
                    onFocusStatus.description || description.length > 0
                      ? "z-10 top-1 left-0  bg-white   scale-75"
                      : " top-1/3 left-2"
                  }`}
                  htmlFor="description"
                >
                  Комментарий
                </label>
              </span>
            </div>

            <div className="py-4 flex flex-col">
              <label htmlFor="workoutDate">Дата тренировки</label>
              <input
                className=" w-2/5  hover:border-slate-400 focus:border-slate-400 border-solid rounded border-2  border-slate-200"
                onChange={changeDateHandler}
                id="workoutDate"
                type="date"
              />
            </div>

            <div>
              <div className=" flex flex-col justify-center my-4">
                <h1 className=" mx-auto py-3">Упражнения</h1>
              </div>
              {addedExercisesElement}
              {showAddExerciseModal && <AddExerciseModal></AddExerciseModal>}
              {!showAddExerciseModal && (
                <div className=" flex flex-col justify-center my-4">
                  <h1 className=" mx-auto py-3"> Выберете упражнения </h1>
                  <button
                    className=" py-4 rounded-md px-2 bg-emerald-100 hover:bg-emerald-400 hover:text-white text-2xl "
                    onClick={showAddExerciseModalHandler}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              )}
            </div>
            {/* <AddExercisesSection></AddExercisesSection> */}

            <div className=" py-4">
              {fetchAddWorkoutStatus === "loading" && (
                <h1 className=" text-center px-3 rounded-md py-3 bg-cyan-200">
                  Загрузка тренировки
                </h1>
              )}
              {fetchAddWorkoutStatus === "resolve" && (
                <h1 className=" text-center rounded-md   px-3 py-3 bg-green-200">
                  Тренировка успешно загружена
                </h1>
              )}
              {fetchAddWorkoutStatus === "error" && (
                <h1 className=" text-center rounded-md   px-3 py-3 bg-rose-500">
                  Ошибка загрузки. Повторите попытку позже
                </h1>
              )}
            </div>
            <div className=" flex justify-center">
              {fetchAddWorkoutStatus === "loading" ? (
                <button className=" animate-pulse w-2/5 h-8  my-8 py-2 text-slate-50 font-bold shadow-exerciseCardHowerShadow min-w-max px-6 rounded bg-buttonColor hover:bg-buttonHoverColor"></button>
              ) : (
                <button
                  onClick={addWorkoutHandler}
                  className=" my-8 py-2 text-slate-50 font-bold shadow-exerciseCardHowerShadow min-w-max px-6 rounded bg-buttonColor hover:bg-buttonHoverColor"
                >
                  {" "}
                  Добавить тренировку
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default addNewWorkout;
