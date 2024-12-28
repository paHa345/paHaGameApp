import { IExercise, IResponseArrExercises, IResponseUser } from "../types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userActions } from "./userSlice";

//import {

export const fetchBestExercisesAndSet = createAsyncThunk(
  "appState/fetchBestExercisesAndSet",
  async function (currentExercisesName, { rejectWithValue, dispatch }) {
    try {
      const req = await fetch("../api/exercises/bestExercises");
      const data: IResponseArrExercises = await req.json();
      if (!req.ok) {
        throw new Error("Ошибка сервера");
      }

      dispatch(appStateActions.setExercises(data.result));

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const setCurrentMuscleGroupAndSet = createAsyncThunk(
  "appState/setCurrentMuscleGroupAndSet",
  async function (currentMuscleGroup: ICurrentMuscleGroup, { rejectWithValue, dispatch }) {
    console.log(currentMuscleGroup.filterQuery);
    try {
      let data;
      if (currentMuscleGroup.en === "all") {
        const req = await fetch(
          `../api/exercises/currentUserExercises${currentMuscleGroup?.filterQuery}`
        );
        data = await req.json();
        if (!req.ok) {
          throw new Error("Ошибка сервера");
        }
      } else {
        const req = await fetch(
          `../api/muscleGroupsExercises/${currentMuscleGroup.en}${currentMuscleGroup?.filterQuery}`
        );
        data = await req.json();
        if (!req.ok) {
          throw new Error("Ошибка сервера");
        }
      }

      dispatch(appStateActions.setCurrentMuscleGroup(currentMuscleGroup));
      dispatch(appStateActions.setExercisesByGroup(data.result));

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const setCurrentUserExercisesByTypeCount = createAsyncThunk(
  "appState/setCurrentUserExercisesByTypeCount",
  async function (exercisesType: string, { rejectWithValue, dispatch }) {
    try {
      const countReq = await fetch(`/api/exercises/getUserExercisesCount/${exercisesType}`);
      if (!countReq.ok) {
        throw new Error("Ошибка сервера");
      }

      const count = await countReq.json();
      console.log(`count ${count.result}`);

      dispatch(appStateActions.setExercisesCount(count.result));
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const setCurrentUserWorkouts = createAsyncThunk(
  "appState/setCurrentUserWorkouts",
  async function (_, { rejectWithValue, dispatch }) {
    try {
      const req = await fetch(`/api/workout/getCurrentUserWorkouts`);
      if (!req.ok) {
        throw new Error("Ошибка сервера");
      }
      const workouts: IResponseUser = await req.json();
      console.log(workouts);
      dispatch(userActions.setCurrentUserWorkout(workouts.result));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface ICurrentMuscleGroup {
  en: string;
  ru: string;
  filterQuery?: string;
}

export interface IAppSlice {
  appState: {
    showSigninStatus: boolean;
    name: string;
    test: boolean;
    exercises: null | any;
    fetchBestExercisesStatus: fetchStatus;
    fetchUserWorkoutsStatus: fetchStatus;
    error: string;
    currentMuscleGroup: ICurrentMuscleGroup;
    currentExercisesByGroup: IExercise[];
    showAddExerciseModal: boolean;
    editWorkoutsStatus: boolean;
    deleteWorkoutStatus: boolean;
    deleteExerciseStatus: boolean;
    exercisesCount: number;
    currentExercisesPage: number;
    telegranUserData?: {
      allows_write_to_pm: boolean | undefined;
      first_name: string | undefined;
      id: number | undefined;
      language_code: string | undefined;
      last_name: string | undefined;
      photo_url: string | undefined;
      username: string | undefined;
    };
  };
}

export enum fetchStatus {
  Loading = "loading",
  Resolve = "resolve",
  Error = "error",
}

interface IAppState {
  showSigninStatus: boolean;

  test: boolean;
  name: string;
  exercises: null | any;
  fetchBestExercisesStatus: fetchStatus;
  fetchUserWorkoutsStatus: fetchStatus;

  error: string;
  currentMuscleGroup: ICurrentMuscleGroup;
  currentExercisesByGroup: IExercise[];
  showAddExerciseModal: boolean;
  editWorkoutsStatus: boolean;
  deleteWorkoutStatus: boolean;
  deleteExerciseStatus: boolean;
  exercisesCount: number;
  currentExercisesPage: number;
  telegranUserData?: {
    allows_write_to_pm: boolean | undefined;
    first_name: string | undefined;
    id: number | undefined;
    language_code: string | undefined;
    last_name: string | undefined;
    photo_url: string | undefined;
    username: string | undefined;
  };
}

export const initAppState: IAppState = {
  showSigninStatus: true,
  test: true,
  name: "paHa345",
  exercises: null,
  fetchBestExercisesStatus: fetchStatus.Loading,
  fetchUserWorkoutsStatus: fetchStatus.Loading,

  error: "",
  currentMuscleGroup: { en: "all", ru: "Все", filterQuery: "" },
  currentExercisesByGroup: [],
  showAddExerciseModal: false,
  editWorkoutsStatus: false,
  deleteWorkoutStatus: false,
  deleteExerciseStatus: false,
  exercisesCount: 0,
  currentExercisesPage: 1,
};

export const appStateSlice = createSlice({
  name: "appState",
  initialState: initAppState,
  reducers: {
    setName(state, action) {
      state.name = action.payload;
    },
    setExercises(state, action) {
      state.exercises = action.payload;
    },
    setExercisesByGroup(state, action) {
      state.currentExercisesByGroup = action.payload;
    },
    setCurrentMuscleGroup(state, action) {
      console.log(action.payload);
      state.currentMuscleGroup = action.payload;
    },
    showSignin(state) {
      state.showSigninStatus = true;
    },
    showRegistration(state) {
      state.showSigninStatus = false;
    },
    showAddExerciseModal(state) {
      state.showAddExerciseModal = true;
    },
    hideAddExerciseModal(state) {
      state.showAddExerciseModal = false;
    },
    startEditWorkouts(state) {
      state.editWorkoutsStatus = true;
    },
    stopEditWorkouts(state) {
      state.editWorkoutsStatus = false;
    },
    startDeleteWorkout(state) {
      state.deleteWorkoutStatus = true;
    },
    stopDeleteWorkout(state) {
      state.deleteWorkoutStatus = false;
    },
    startDeleteExercise(state) {
      state.deleteExerciseStatus = true;
    },
    stopDeleteExercise(state) {
      state.deleteExerciseStatus = false;
    },
    deleteExerciseFromUser(state, action) {
      const exerciseIndex = state.currentExercisesByGroup.findIndex((exercise: IExercise) => {
        return exercise._id === action.payload;
      });
      state.currentExercisesByGroup.splice(exerciseIndex, 1);
    },
    updateExerciseToEdited(
      state,
      action: {
        payload: IExercise;
        type: string;
      }
    ) {
      state.currentExercisesByGroup = state.currentExercisesByGroup.map((exercise: IExercise) => {
        if (exercise._id === action.payload._id) {
          return action.payload;
        } else {
          return exercise;
        }
      });
    },
    setExercisesCount(state, action) {
      state.exercisesCount = action.payload;
    },
    setCurrentExercisesPage(state, action) {
      state.currentExercisesPage = action.payload;
    },
    setTelegranUserData(state, action) {
      state.telegranUserData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBestExercisesAndSet.pending, (state) => {
      state.fetchBestExercisesStatus = fetchStatus.Loading;
    });
    builder.addCase(setCurrentMuscleGroupAndSet.pending, (state) => {
      state.fetchBestExercisesStatus = fetchStatus.Loading;
    });

    builder.addCase(setCurrentUserWorkouts.pending, (state) => {
      state.fetchUserWorkoutsStatus = fetchStatus.Loading;
    });

    builder.addCase(fetchBestExercisesAndSet.fulfilled, (state, action) => {
      state.fetchBestExercisesStatus = fetchStatus.Resolve;
    });
    builder.addCase(setCurrentMuscleGroupAndSet.fulfilled, (state, action) => {
      state.fetchBestExercisesStatus = fetchStatus.Resolve;
    });
    builder.addCase(setCurrentUserWorkouts.fulfilled, (state, action) => {
      state.fetchUserWorkoutsStatus = fetchStatus.Resolve;
    });

    builder.addCase(fetchBestExercisesAndSet.rejected, (state, action) => {
      state.fetchBestExercisesStatus = fetchStatus.Error;
    });
    builder.addCase(setCurrentMuscleGroupAndSet.rejected, (state, action) => {
      state.fetchBestExercisesStatus = fetchStatus.Error;
    });
    builder.addCase(setCurrentUserWorkouts.rejected, (state, action) => {
      state.fetchUserWorkoutsStatus = fetchStatus.Error;
    });
  },
});

export const appStateActions = appStateSlice.actions;
