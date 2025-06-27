import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IExercise, IReqToCoach, IResponseUser, IWorkout } from "../types";
import { appStateActions, appStateSlice } from "./appStateSlice";

export const setCurrentUserInState = createAsyncThunk(
  "userState/setCurrentUserInState",
  async function (_, { rejectWithValue, dispatch }) {
    try {
      const req = await fetch("../api/users/getCurrentUser");
      if (!req.ok) {
        throw new Error("Ошибка сервера");
      }
      const user = await req.json();

      dispatch(userActions.setcurrentUser(user.result));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserWorkouts = createAsyncThunk(
  "appState/getUserWorkouts",
  async function (_, { rejectWithValue, dispatch }) {
    try {
      const req = await fetch("../api/workout/getCurrentUserWorkouts");
      if (!req.ok) {
        throw new Error("Ошибка сервера");
      }
      const user: IResponseUser = await req.json();
      dispatch(userActions.setCurrentUserWorkout(user.result.workoutsArr));
      return user.result.workoutsArr;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const editWorkoutAndUpdate = createAsyncThunk(
  "appState/editWorkoutAndUpdate",
  async function (
    editedWorkoutData: { workout: IWorkout; workoutWithExerciseData: IWorkout },
    { rejectWithValue, dispatch }
  ) {
    try {
      const req = await fetch("./api/workout/editWorkout", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(editedWorkoutData.workout),
      });
      if (!req.ok) {
        throw new Error("Ошибка сервера");
      }
      const editWorkout = await req.json();
      dispatch(userActions.updateWorkoutToEdited(editedWorkoutData.workoutWithExerciseData));
      return editWorkout.result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteWorkoutAndUpdateState = createAsyncThunk(
  "appState/deleteWorkoutAndUpdateState",
  async function (deletedWorkoutId: string, { rejectWithValue, dispatch }) {
    try {
      const deleteWorkoutFromUserReq = await fetch("/api/users/deleteWorkoutFromUser", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ workoutId: deletedWorkoutId }),
      });

      if (!deleteWorkoutFromUserReq.ok) {
        throw new Error("Ошибка сервера");
      }

      const deletedWorkoutReq = await fetch(`./api/workout/${deletedWorkoutId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });

      if (!deletedWorkoutReq.ok) {
        throw new Error("Ошибка сервера");
      }

      await dispatch(userActions.deleteWorkoutfromUser(deletedWorkoutId));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteExerciseAndUpdateState = createAsyncThunk(
  "appState/deleteExerciseAndUpdateState",
  async function (deletedExerciseId: string, { rejectWithValue, dispatch }) {
    try {
      const deleteExerciseFromUserReq = await fetch("/api/users/deleteExerciseFromUser", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ exerciseId: deletedExerciseId }),
      });

      if (!deleteExerciseFromUserReq.ok) {
        throw new Error("Ошибка сервера");
      }

      const deletedWorkoutReq = await fetch(`./api/exercises/${deletedExerciseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });

      if (!deletedWorkoutReq.ok) {
        throw new Error("Ошибка сервера");
      }

      await dispatch(appStateActions.deleteExerciseFromUser(deletedExerciseId));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const setGamesData = createAsyncThunk(
  "appState/setGamesdata",
  async function (_, { rejectWithValue, dispatch }) {
    try {
      const getGameDataReq = await fetch("/api/games/getChooseGameButtonData");
      const gamesData = await getGameDataReq.json();

      let gamesDataObj: {
        [index: string]: {
          color: string;
          description: string;
          pathname: string;
          title: string;
          gameType: string;
          _id: string;
        };
      } = {};
      gamesData.result.forEach((gameData: any) => {
        return (gamesDataObj[gameData.pathname] = gameData);
      });

      console.log(gamesDataObj);
      dispatch(userActions.setGamesData(gamesDataObj));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export enum fetchCurrentUserWorkoutsStatus {
  Ready = "ready",
  Loading = "loading",
  Resolve = "resolve",
  Error = "error",
}

interface ICoachObject {
  coachId: String;
  addRequestId: String;
  _id: String;
}

interface IAddToStudentsRequestObject {
  _id: String;
  userId: String;
  coachId: String;
  active: boolean;
  rejectedByCoach?: boolean;
}

export interface IUserSlice {
  userState: {
    getWorkoutsStatus: fetchCurrentUserWorkoutsStatus;
    editWorkoutStatus: fetchCurrentUserWorkoutsStatus;
    deleteWorkoutStatus: fetchCurrentUserWorkoutsStatus;
    deleteExerciseStatus: fetchCurrentUserWorkoutsStatus;
    currentUser: {
      _id: string;
      name: string;
      id: string;
      workoutsArr: IWorkout[];
      editedWorkout: IWorkout;
      editedExercise: IExercise | null;
      userType: string;
      email: string;
      exercisesArr?: String[];
      reviewsArr?: String[];
      coachesArr?: ICoachObject[];
      addToStudentsRequests?: IAddToStudentsRequestObject[];
      changedExerciseWorkoutId: string;
    };
    deletingByUserRequest: IReqToCoach | null;
    rejectingOrDeletingByCoachRequest: IReqToCoach | null;
    rejectingOrDeletingByCoachStudentId: string;
    gamesData?: {
      [key: string]: {
        color: string;
        description: string;
        pathname: string;
        title: string;
        gameType: string;
        textSecoundStep: string;
        showFirstStepAnswer: boolean;

        _id: string;
      };
    };
    currentGameType?: string;
  };
}

interface userState {
  getWorkoutsStatus: fetchCurrentUserWorkoutsStatus;
  editWorkoutStatus: fetchCurrentUserWorkoutsStatus;
  deleteWorkoutStatus: fetchCurrentUserWorkoutsStatus;
  deleteExerciseStatus: fetchCurrentUserWorkoutsStatus;

  currentUser: {
    _id: string;
    name: string;
    id: string;
    workoutsArr: IWorkout[];
    editedWorkout: IWorkout;
    editedExercise: IExercise | null;
    userType: string;

    email: string;
    exercisesArr?: String[];
    reviewsArr?: String[];
    coachesArr?: ICoachObject[];
    addToStudentsRequests?: IAddToStudentsRequestObject[];
    changedExerciseWorkoutId: string;
  };
  deletingByUserRequest: IReqToCoach | null;
  rejectingOrDeletingByCoachRequest: IReqToCoach | null;
  rejectingOrDeletingByCoachStudentId: string;
  gamesData?: {
    [key: string]: {
      color: string;
      description: string;
      pathname: string;
      title: string;
      gameType: string;
      textSecoundStep: string;
      showFirstStepAnswer: boolean;

      _id: string;
    };
  };
  currentGameType?: string;
}

export const initUserState: userState = {
  getWorkoutsStatus: fetchCurrentUserWorkoutsStatus.Loading,
  editWorkoutStatus: fetchCurrentUserWorkoutsStatus.Ready,
  deleteWorkoutStatus: fetchCurrentUserWorkoutsStatus.Ready,
  deleteExerciseStatus: fetchCurrentUserWorkoutsStatus.Ready,

  currentUser: {
    _id: "",
    name: "paHa345",
    email: "",
    id: "",
    userType: "",
    workoutsArr: [],
    editedWorkout: {
      name: "Init",
      _id: "init",
      date: new Date(),
      comments: "init",
      userId: "init",
      studentsIdArr: [
        {
          _id: "string",
          email: "string",
          name: "string",
        },
      ],

      exercisesArr: [
        {
          name: "init",
          exercise: {
            id: "squat-01",
            name: "Приседания со штангой на плечах",
            _id: "654203ac3f25911208c1eea7",
          },
          exerciseId: "Init",
          sets: 0,
          reps: 0,
        },
      ],
    },
    editedExercise: null,
    changedExerciseWorkoutId: "",
  },
  deletingByUserRequest: null,
  rejectingOrDeletingByCoachRequest: null,
  rejectingOrDeletingByCoachStudentId: "",
};

export const userSlice = createSlice({
  name: "userState",
  initialState: initUserState,
  reducers: {
    setCurrentUserId(state, action) {
      state.currentUser.id = action.payload;
    },
    setcurrentUser(state, action) {
      state.currentUser.name = action.payload.name;
      state.currentUser.email = action.payload.email;
      state.currentUser.userType = action.payload.userType;
      state.currentUser.id = action.payload._id;
    },
    setEditedWorkoutName(state, action) {
      state.currentUser.editedWorkout.name = action.payload;
    },
    setCurrentUserWorkout(state, action) {
      state.currentUser.workoutsArr = action.payload;
    },

    setEditedWorkout(state, action) {
      // console.log(action.payload);
      const editedWorkout = state.currentUser.workoutsArr.find((workout) => {
        return workout._id === action.payload;
      });
      // console.log(editedWorkout);
      if (editedWorkout) {
        state.currentUser.editedWorkout = editedWorkout;
      }
    },
    setEditedWorkoutId(state, action) {
      state.currentUser.editedWorkout.name = action.payload;
    },
    setEditedWorkoutComments(state, action) {
      state.currentUser.editedWorkout.comments = action.payload;
    },
    setEditedWorkoutDate(state, action) {
      state.currentUser.editedWorkout.date = action.payload;
    },
    // setEditedExercise(state, action) {
    //   state.currentUser.editedExercise = action.payload;
    // },
    changeSetsAmount(state, action) {
      state.currentUser.editedWorkout.exercisesArr[action.payload.index].sets =
        action.payload.value;
    },
    changeRepsAmount(state, action) {
      state.currentUser.editedWorkout.exercisesArr[action.payload.index].reps =
        action.payload.value;
    },
    addExerciseToEditedWorkout(state, action) {
      if (state.currentUser.editedWorkout.exercisesArr.length) {
        state.currentUser.editedWorkout.exercisesArr.push({
          exercise: action.payload,
          exerciseId: action.payload._id,
          sets: 0,
          reps: 0,
          name: action.payload.name,
          isCompletedArr: [],
        });
      } else {
        state.currentUser.editedWorkout.exercisesArr = [
          {
            exercise: action.payload,
            exerciseId: action.payload._id,
            sets: 0,
            reps: 0,
            name: action.payload.name,
            isCompletedArr: [],
          },
        ];
      }
    },
    resetEditedWorkout(state) {
      const initEditWorkout: IWorkout = {
        name: "Init",
        _id: "init",
        date: new Date(),
        comments: "init",
        userId: "init",
        studentsIdArr: [
          {
            _id: "string",
            email: "string",
            name: "string",
          },
        ],

        exercisesArr: [
          {
            name: "init",
            exercise: {
              id: "squat-01",
              name: "Приседания со штангой на плечах",
              _id: "654203ac3f25911208c1eea7",
            },
            exerciseId: "Init",
            sets: 0,
            reps: 0,
          },
        ],
      };
      state.currentUser.editedWorkout = initEditWorkout;
    },
    deleteExerciseFromEditedWorkout(state, action) {
      state.currentUser.editedWorkout.exercisesArr.splice(action.payload, 1);
    },
    deleteWorkoutfromUser(state, action) {
      const workoutIndex = state.currentUser.workoutsArr.findIndex((workout: IWorkout) => {
        return workout._id === action.payload;
      });

      state.currentUser.workoutsArr.splice(workoutIndex, 1);

      // if(updatedWorkoutArr.length > 0 && updatedWorkoutArr){
      //   state.currentUser.workoutsArr = updatedWorkoutArr

      // }
    },

    updateWorkoutToEdited(
      state,
      action: {
        payload: IWorkout;
        type: string;
      }
    ) {
      state.currentUser.workoutsArr = state.currentUser.workoutsArr.map((workout: IWorkout) => {
        if (workout._id === action.payload._id) {
          return action.payload;
        } else {
          return workout;
        }
      });
    },
    setFetchAddWorkoutStatusToReady(state) {
      state.editWorkoutStatus = fetchCurrentUserWorkoutsStatus.Ready;
    },
    setFetchAddWorkoutStatusToLoading(state) {
      state.editWorkoutStatus = fetchCurrentUserWorkoutsStatus.Loading;
    },
    setDeletingByUserRequest(state, action) {
      state.deletingByUserRequest = action.payload;
    },
    setRejectingOrDeletingByCoachRequest(state, action) {
      state.rejectingOrDeletingByCoachRequest = action.payload;
    },
    deleteRejectedRequestFromUser(state, action) {
      const updatedRequests = state.currentUser?.addToStudentsRequests?.filter(
        (request) => request._id !== action.payload
      );
      state.currentUser.addToStudentsRequests = updatedRequests;
    },
    setRejectingOrDeletingByCoachStudentId(state, action) {
      state.rejectingOrDeletingByCoachStudentId = action.payload;
    },
    deleteUserFromUpdatedWorkout(state, action) {
      const updatedWorkoutUsers = state.currentUser.editedWorkout.studentsIdArr.filter(
        (student) => student._id !== String(action.payload)
      ) as [
        {
          _id: string;
          email: string;
          name: string;
        },
      ];

      state.currentUser.editedWorkout.studentsIdArr = updatedWorkoutUsers;
    },
    addUserToUpdetedWorkout(
      state,
      action: {
        payload: {
          _id: string;
          email: string;
          name: string;
        };
        type: string;
      }
    ) {
      const currentUser: { _id: string; email: string; name: string } = action.payload;
      const isInArr = state.currentUser.editedWorkout.studentsIdArr.find((student) => {
        return student._id === action.payload._id;
      });
      if (!isInArr) {
        state.currentUser.editedWorkout.studentsIdArr.push(currentUser);
      }
    },
    setChangedExerciseWorkoutId(state, action) {
      state.currentUser.changedExerciseWorkoutId = action.payload;
    },
    changeExerciseStatus(
      state,
      action: {
        payload: {
          exerciseId: string;
          workoutId: string;
          isComplete: boolean;
          currentUserId: string;
        };
        type: string;
      }
    ) {
      console.log("process");
      const workoutIndex = state.currentUser.workoutsArr.findIndex(
        (workout) => workout._id === action.payload.workoutId
      );
      const currentEditedExercisesIndex = state.currentUser.workoutsArr[
        workoutIndex
      ].exercisesArr.findIndex((exercise) => exercise.exercise._id === action.payload.exerciseId);

      const currentExerciseIsCompleteArr =
        state.currentUser.workoutsArr[workoutIndex].exercisesArr[currentEditedExercisesIndex]
          .isCompletedArr;

      if (currentExerciseIsCompleteArr === undefined) {
        state.currentUser.workoutsArr[workoutIndex].exercisesArr[
          currentEditedExercisesIndex
        ].isCompletedArr = [
          { studentId: action.payload.currentUserId, isCompleted: !action.payload.isComplete },
        ];
      }
      if (currentExerciseIsCompleteArr !== undefined) {
        console.log("Not undefined");
        const index = currentExerciseIsCompleteArr?.findIndex(
          (el) => el.studentId === action.payload.currentUserId
        );
        console.log(currentExerciseIsCompleteArr.length);
        if (index >= 0) {
          currentExerciseIsCompleteArr[index] = {
            studentId: action.payload.currentUserId,
            isCompleted: !action.payload.isComplete,
          };
        }
        if (index === -1) {
          state.currentUser.workoutsArr[workoutIndex].exercisesArr[
            currentEditedExercisesIndex
          ].isCompletedArr = [
            { studentId: action.payload.currentUserId, isCompleted: !action.payload.isComplete },
          ];
        }
      }
      // else {
      //   const index = currentExerciseIsCompleteArr?.findIndex(
      //     (el) => el.studentId === action.payload.currentUserId
      //   );

      //   if (index >= 0 && currentExerciseIsCompleteArr !== undefined) {
      //     currentExerciseIsCompleteArr[index] = {
      //       studentId: action.payload.currentUserId,
      //       isCompleted: !action.payload.isComplete,
      //     };
      //   } else {
      //     currentExerciseIsCompleteArr.push({
      //       studentId: action.payload.currentUserId,
      //       isCompleted: !action.payload.isComplete,
      //     });
      //   }
      // }
      // console.log(currentExerciseIsCompleteArr[0].studentId);
      // state.currentUser.workoutsArr[workoutIndex].exercisesArr[
      //   currentEditedExercisesIndex
      // ].isCompletedArr = !action.payload.isComplete;
    },
    setGamesData(state, action) {
      state.gamesData = action.payload;
    },
    setCurrentGameType(state, action) {
      state.currentGameType = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getUserWorkouts.pending, (state, action) => {
      state.getWorkoutsStatus = fetchCurrentUserWorkoutsStatus.Loading;
    });
    builder.addCase(editWorkoutAndUpdate.pending, (state, action) => {
      state.editWorkoutStatus = fetchCurrentUserWorkoutsStatus.Loading;
    });
    builder.addCase(deleteWorkoutAndUpdateState.pending, (state, action) => {
      state.deleteWorkoutStatus = fetchCurrentUserWorkoutsStatus.Loading;
    });
    builder.addCase(deleteExerciseAndUpdateState.pending, (state, action) => {
      state.deleteExerciseStatus = fetchCurrentUserWorkoutsStatus.Loading;
    });
    builder.addCase(setGamesData.pending, (state, action) => {
      state.deleteExerciseStatus = fetchCurrentUserWorkoutsStatus.Loading;
    });
    builder.addCase(getUserWorkouts.fulfilled, (state, action) => {
      state.getWorkoutsStatus = fetchCurrentUserWorkoutsStatus.Resolve;
    });
    builder.addCase(editWorkoutAndUpdate.fulfilled, (state, action) => {
      state.editWorkoutStatus = fetchCurrentUserWorkoutsStatus.Resolve;
    });
    builder.addCase(deleteWorkoutAndUpdateState.fulfilled, (state, action) => {
      state.deleteWorkoutStatus = fetchCurrentUserWorkoutsStatus.Resolve;
    });
    builder.addCase(deleteExerciseAndUpdateState.fulfilled, (state, action) => {
      state.deleteExerciseStatus = fetchCurrentUserWorkoutsStatus.Loading;
    });
    builder.addCase(setGamesData.fulfilled, (state, action) => {
      state.deleteExerciseStatus = fetchCurrentUserWorkoutsStatus.Loading;
    });
    builder.addCase(getUserWorkouts.rejected, (state, action) => {
      state.getWorkoutsStatus = fetchCurrentUserWorkoutsStatus.Error;
    });
    builder.addCase(editWorkoutAndUpdate.rejected, (state, action) => {
      state.editWorkoutStatus = fetchCurrentUserWorkoutsStatus.Error;
    });
    builder.addCase(deleteWorkoutAndUpdateState.rejected, (state, action) => {
      state.deleteWorkoutStatus = fetchCurrentUserWorkoutsStatus.Error;
    });
    builder.addCase(deleteExerciseAndUpdateState.rejected, (state, action) => {
      state.deleteExerciseStatus = fetchCurrentUserWorkoutsStatus.Loading;
    });
    builder.addCase(setGamesData.rejected, (state, action) => {
      state.deleteExerciseStatus = fetchCurrentUserWorkoutsStatus.Loading;
    });
  },
});

export const userActions = userSlice.actions;
