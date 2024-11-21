import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AddedWordDirection } from "./crosswordSlice";

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

export const setAvailableCrosswordGame = createAsyncThunk(
  "crosswordGameState/setAvailableCrosswordGame",
  async function (crosswordGameId: string, { rejectWithValue, dispatch }) {
    try {
      const crosswordGameReq = await fetch(`/api/crosswordGame/${crosswordGameId}`);
      const data = await crosswordGameReq.json();
      if (!crosswordGameReq.ok) {
        throw new Error(data.message);
      }
      // dispatch(crossworGamedActions.setAvailableCrosswordGame(data.result));
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
    crosswordGame: {
      _id: string;
      name: string;
      userId: string;
      isCompleted: boolean;
      crosswordObj: {
        key: string;
        value: string;
        number: number;
        row: number;
        paragraph: number;
        paragraphNum?: number;
        inputStatus: number;
        inputValue: number;
        textQuestionStatus: number;
        questionObj: {
          horizontal: {
            value: string;
            questionNumber: number;
            cell: { row: number; col: number };
          } | null;
          vertical: {
            value: string;
            questionNumber: number;
            cell: { row: number; col: number };
          } | null;
        };
        addedWordCell: number;
        // addedWordLetter: string | null;
        addedWordDirectionJbj: {
          horizontal: Boolean;
          vertical: Boolean;
        };
        addedWordArr: {
          direction: AddedWordDirection;
          // value: string;
          addedWordArr: {
            row: number;
            col: number;
            // addedLetter: string
          }[];
        }[];
      }[][];
    };
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
  crosswordGame: {
    _id: string;
    name: string;
    userId: string;
    isCompleted: boolean;
    crosswordObj: {
      key: string;
      value: string;
      number: number;
      row: number;
      paragraph: number;
      paragraphNum?: number;
      inputStatus: number;
      inputValue: number;
      textQuestionStatus: number;
      questionObj: {
        horizontal: {
          value: string;
          questionNumber: number;
          cell: { row: number; col: number };
        } | null;
        vertical: {
          value: string;
          questionNumber: number;
          cell: { row: number; col: number };
        } | null;
      };
      addedWordCell: number;
      // addedWordLetter: string | null;
      addedWordDirectionJbj: {
        horizontal: Boolean;
        vertical: Boolean;
      };
      addedWordArr: {
        direction: AddedWordDirection;
        // value: string;
        addedWordArr: {
          row: number;
          col: number;
          // addedLetter: string
        }[];
      }[];
    }[][];
  };
}

export const initCrosswordGameState: ICrosswordGameState = {
  test: 10,
  showChooseCrosswordModal: false,
  availableCrosswordGamesArr: [],
  fetchAvailableCrosswordGamesStatus: crosswordGameFetchStatus.Ready,
  crosswordGame: {
    _id: "",
    name: "",
    userId: "",
    isCompleted: false,
    crosswordObj: [],
  },
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
    builder.addCase(setAvailableCrosswordGame.pending, (state) => {
      state.fetchAvailableCrosswordGamesStatus = crosswordGameFetchStatus.Loading;
    });
    builder.addCase(getAvailableCrosswords.fulfilled, (state) => {
      state.fetchAvailableCrosswordGamesStatus = crosswordGameFetchStatus.Resolve;
    });
    builder.addCase(setAvailableCrosswordGame.fulfilled, (state) => {
      state.fetchAvailableCrosswordGamesStatus = crosswordGameFetchStatus.Resolve;
    });
    builder.addCase(getAvailableCrosswords.rejected, (state) => {
      state.fetchAvailableCrosswordGamesStatus = crosswordGameFetchStatus.Error;
    });
    builder.addCase(setAvailableCrosswordGame.rejected, (state) => {
      state.fetchAvailableCrosswordGamesStatus = crosswordGameFetchStatus.Error;
    });
  },
});

export const crossworGamedActions = crosswordGameSlice.actions;
