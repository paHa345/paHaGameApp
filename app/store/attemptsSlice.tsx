import { createSlice } from "@reduxjs/toolkit";

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
