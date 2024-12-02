import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export interface IAttemptsSlice {
  attemptsState: {
    attempts: number;
  };
}

interface IAttemptsState {
  attempts: number;
}

const initAppState: IAttemptsState = {
  attempts: 0,
};

export const attemptsSlice = createSlice({
  name: "attemptsState",
  initialState: initAppState,
  reducers: {
    setCurrentCrosswordAttempts(state, action) {
      state.attempts = action.payload;
    },
  },
});

export const attemptsActions = attemptsSlice.actions;
