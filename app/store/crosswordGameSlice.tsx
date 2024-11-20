import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAvailableCrosswords = createAsyncThunk(
  "crosswordGameState/getAvailableCrosswords",
  async function (_, { rejectWithValue, dispatch }) {
    try {
      const getCurrentUserCrosswordsReq = await fetch("/api/crosswordGame/getAllCrosswords");
      const crosswords = await getCurrentUserCrosswordsReq.json();
      if (!getCurrentUserCrosswordsReq.ok) {
        throw new Error(crosswords.message);
      }
      dispatch(crossworGamedActions.setAvailableCrosswordGamesArr(crosswords.result));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export enum crosswordGameFetchStatus {
  Ready = "ready",
  Loading = "loading",
  Resolve = "resolve",
  Error = "error",
}

export interface ICrosswordGameSlice {
  crosswordGameState: {
    test: number;
    showChooseCrosswordModal: boolean;
    availableCrosswordGamesArr: {
      _id: string;
      name: string;
      iserId: string;
      changeDate: Date;
    }[];
    fetchAvailableCrosswordGamesStatus: crosswordGameFetchStatus;
  };
}

interface ICrosswordGameState {
  test: number;
  showChooseCrosswordModal: boolean;
  availableCrosswordGamesArr: {
    _id: string;
    name: string;
    iserId: string;
    changeDate: Date;
  }[];
  fetchAvailableCrosswordGamesStatus: crosswordGameFetchStatus;
}

export const initCrosswordGameState: ICrosswordGameState = {
  test: 10,
  showChooseCrosswordModal: false,
  availableCrosswordGamesArr: [],
  fetchAvailableCrosswordGamesStatus: crosswordGameFetchStatus.Ready,
};

export const crosswordGameSlice = createSlice({
  name: "crosswordGameState",
  initialState: initCrosswordGameState,
  reducers: {
    setTest(state, action) {
      state.test = action.payload;
    },
    setShowChooseCrosswordModal(state, action) {
      state.showChooseCrosswordModal = action.payload;
    },
    setAvailableCrosswordGamesArr(state, action) {
      state.availableCrosswordGamesArr = action.payload;
    },
    setFetchAvailableCrosswordGamesStatus(state, action) {
      state.fetchAvailableCrosswordGamesStatus = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getAvailableCrosswords.pending, (state) => {
      state.fetchAvailableCrosswordGamesStatus = crosswordGameFetchStatus.Loading;
    });
    builder.addCase(getAvailableCrosswords.fulfilled, (state) => {
      state.fetchAvailableCrosswordGamesStatus = crosswordGameFetchStatus.Resolve;
    });
    builder.addCase(getAvailableCrosswords.rejected, (state) => {
      state.fetchAvailableCrosswordGamesStatus = crosswordGameFetchStatus.Error;
    });
  },
});

export const crossworGamedActions = crosswordGameSlice.actions;
