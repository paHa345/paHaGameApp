import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { crosswordGameFetchStatus } from "./crosswordGameSlice";

export const getAllGamesList = createAsyncThunk(
  "attemptsState/getAllGamesList",
  async function (telegramID: number, { rejectWithValue, dispatch }) {
    try {
      const getAllGamesListReq = await fetch(`/api/games/getAllGames/${telegramID}`);
      const allGamesList = await getAllGamesListReq.json();
      if (!getAllGamesListReq.ok) {
        throw new Error(allGamesList.message);
      }
      console.log(allGamesList);
      // dispatch(crossworGamedActions.setAvailableCrosswordGamesArr(crosswords.result));
      dispatch(attemptsActions.setGamesList(allGamesList.result));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getGameAllAttempts = createAsyncThunk(
  "attemptsState/getGameAllAttempts",
  async function (
    gameUserData: {
      gameID: string;
      telegramUserID: number | undefined;
    },
    { rejectWithValue, dispatch }
  ) {
    try {
      const getGameAllAttemptsReq = await fetch(
        `/api/attempts/${[gameUserData.gameID]}/${[gameUserData.telegramUserID]}`
      );
      const gameAllAttempts = await getGameAllAttemptsReq.json();
      if (!getGameAllAttemptsReq.ok) {
        throw new Error(gameAllAttempts.message);
      }
      console.log(gameAllAttempts);
      dispatch(attemptsActions.setGameAllAttempts(gameAllAttempts.result));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export enum attemptsFetchStatus {
  Ready = "ready",
  Loading = "loading",
  Resolve = "resolve",
  Error = "error",
}
export interface IAttemptsSlice {
  attemptsState: {
    attempts: number;
    gamesList?: { _id: string; name: string; changeDate: Date }[];
    setGamesListFetchStatus: attemptsFetchStatus;
    getGameAllAttemptsFetchStatus: attemptsFetchStatus;
    gameAllAttempts?: {
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
    }[];
  };
}

interface IAttemptsState {
  attempts: number;
  gamesList?: { _id: string; name: string; changeDate: Date }[];
  setGamesListFetchStatus: attemptsFetchStatus;
  getGameAllAttemptsFetchStatus: attemptsFetchStatus;
  gameAllAttempts?: {
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
  }[];
}

const initAppState: IAttemptsState = {
  attempts: 0,
  setGamesListFetchStatus: attemptsFetchStatus.Ready,
  getGameAllAttemptsFetchStatus: attemptsFetchStatus.Ready,
};

export const attemptsSlice = createSlice({
  name: "attemptsState",
  initialState: initAppState,
  reducers: {
    setCurrentCrosswordAttempts(state, action) {
      state.attempts = action.payload;
    },
    setGamesList(state, action) {
      state.gamesList = action.payload;
    },
    setGameAllAttempts(state, action) {
      state.gameAllAttempts = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllGamesList.pending, (state) => {
      state.setGamesListFetchStatus = attemptsFetchStatus.Loading;
    });
    builder.addCase(getGameAllAttempts.pending, (state) => {
      state.getGameAllAttemptsFetchStatus = attemptsFetchStatus.Loading;
    });
    builder.addCase(getAllGamesList.fulfilled, (state) => {
      state.setGamesListFetchStatus = attemptsFetchStatus.Resolve;
    });
    builder.addCase(getGameAllAttempts.fulfilled, (state) => {
      state.getGameAllAttemptsFetchStatus = attemptsFetchStatus.Resolve;
    });
    builder.addCase(getAllGamesList.rejected, (state) => {
      state.setGamesListFetchStatus = attemptsFetchStatus.Error;
    });
    builder.addCase(getGameAllAttempts.rejected, (state) => {
      state.getGameAllAttemptsFetchStatus = attemptsFetchStatus.Error;
    });
  },
});

export const attemptsActions = attemptsSlice.actions;
