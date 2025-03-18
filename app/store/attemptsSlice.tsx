import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { crosswordGameFetchStatus } from "./crosswordGameSlice";

export const getAllGamesList = createAsyncThunk(
  "attemptsState/getAllGamesList",
  async function (
    getGamesFata: { telegramID: number | undefined; page?: number; gamesName: string | undefined },
    { rejectWithValue, dispatch }
  ) {
    try {
      dispatch(attemptsActions.setShowHideGamesList(false));

      console.log(getGamesFata.gamesName);

      if (getGamesFata.gamesName === "Crossword") {
        const getAllCrosswordGamesListReq = await fetch(
          `/api/games/getAllGames/${getGamesFata.telegramID}?page=${getGamesFata?.page ? getGamesFata?.page : 1}`
        );
        const allCrosswordGamesList = await getAllCrosswordGamesListReq.json();
        if (!getAllCrosswordGamesListReq.ok) {
          throw new Error(allCrosswordGamesList.message);
        }
        dispatch(attemptsActions.setGamesList(allCrosswordGamesList.result.games));
        dispatch(attemptsActions.setIsLastGamesListPage(allCrosswordGamesList.result.isLastPage));
      }

      if (getGamesFata.gamesName === "GTS") {
        const getAllGTSGamesListReq = await fetch(
          `/api/guessThatSong/GTSGame/getAvailableGTSGames?page=${getGamesFata?.page ? getGamesFata?.page : 1}`
        );
        const allGTSGamesList = await getAllGTSGamesListReq.json();
        if (!getAllGTSGamesListReq.ok) {
          throw new Error(allGTSGamesList.message);
        }

        dispatch(attemptsActions.setGamesList(allGTSGamesList.result.availableGTSGames));
        dispatch(attemptsActions.setIsLastGamesListPage(allGTSGamesList.result.isLastPage));
      }

      // console.log(allGamesList);
      // dispatch(crossworGamedActions.setAvailableCrosswordGamesArr(crosswords.result));
      dispatch(attemptsActions.setGamesListCurrentPage(getGamesFata?.page));
      dispatch(attemptsActions.setShowHideGamesList(true));
    } catch (error: any) {
      dispatch(attemptsActions.setGetAllGamesErrorMessage(error.message));
      dispatch(attemptsActions.setShowHideGamesList(true));

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
      page?: number;
      limit?: number;
      gamesName: string | undefined;
    },
    { rejectWithValue, dispatch }
  ) {
    try {
      dispatch(attemptsActions.setShowHideAttemptsList(false));

      if (gameUserData.gamesName === "Crossword") {
        const getGameAllAttemptsReq = await fetch(
          `/api/attempts/getCrosswordGameAttempts/${[gameUserData.gameID]}/${[gameUserData.telegramUserID]}?page=${gameUserData?.page ? gameUserData?.page : 1}${gameUserData?.limit ? `&limit=${gameUserData.limit}` : ""}`
        );
        const gameAllAttempts = await getGameAllAttemptsReq.json();
        if (!getGameAllAttemptsReq.ok) {
          throw new Error(gameAllAttempts.message);
        }

        dispatch(attemptsActions.setGameAllAttempts(gameAllAttempts.result.allGameAttempts));
        dispatch(attemptsActions.setIsLastAttemptsListPage(gameAllAttempts.result.isLastPage));
      }

      if (gameUserData.gamesName === "GTS") {
        const getGameAllAttemptsReq = await fetch(
          `/api/attempts/getGTSGameAttempts/${[gameUserData.gameID]}/${[gameUserData.telegramUserID]}?page=${gameUserData?.page ? gameUserData?.page : 1}${gameUserData?.limit ? `&limit=${gameUserData.limit}` : ""}`
        );
        const gameAllAttempts = await getGameAllAttemptsReq.json();
        if (!getGameAllAttemptsReq.ok) {
          throw new Error(gameAllAttempts.message);
        }

        console.log(gameAllAttempts.result);

        dispatch(attemptsActions.setGameAllAttempts(gameAllAttempts.result.allGameAttempts));
        dispatch(attemptsActions.setIsLastAttemptsListPage(gameAllAttempts.result.isLastPage));
      }

      dispatch(attemptsActions.setCurrentGameID(gameUserData.gameID));
      dispatch(attemptsActions.setAttemptsListCurrentPage(gameUserData?.page));
      dispatch(attemptsActions.setShowHideAttemptsList(true));
    } catch (error: any) {
      dispatch(attemptsActions.setShowHideAttemptsList(true));

      console.log(error.message);
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
    gamesListCurrentPage: number;
    isLastGamesListPage: boolean;
    showHideGamesList: boolean;
    gamesListTransitionClasses: string;

    // transition animation
    attemptsListCurrentPage: number;
    isLastAttemptsListPage: boolean;
    showHideAttemptsList: boolean;
    attemptsListTransitionClasses: string;
    //

    attemptsLimitOnPage: number;

    gamesList?: { _id: string; name: string; changeDate: Date }[];
    setGamesListFetchStatus: attemptsFetchStatus;
    getGameAllAttemptsFetchStatus: attemptsFetchStatus;
    currentGameID?: string;
    gameAllAttempts?: {
      completedCorrectly?: boolean;
      crosswordID?: string;
      crosswordName?: string;
      duration?: string;
      finishDate?: Date;
      isCompleted: boolean;
      startDate?: Date;
      telegramID: number;
      telegramUserName?: string;
      _id: string;
      userPhoto?: string;
      firstName?: string;
      lastName?: string;
      GTSGameID?: string;
      GTSGameName?: string;
      timeRemained?: number;
    }[];
    getAllGamesErrorMessage?: string;
    getGameAttemptsErrorMessage?: string;
    selectedGamesName?: string;
  };
}

interface IAttemptsState {
  attempts: number;
  gamesListCurrentPage: number;
  isLastGamesListPage: boolean;
  showHideGamesList: boolean;
  gamesListTransitionClasses: string;

  // transition animation
  attemptsListCurrentPage: number;
  isLastAttemptsListPage: boolean;
  showHideAttemptsList: boolean;
  attemptsListTransitionClasses: string;
  //
  currentGameID?: string;

  attemptsLimitOnPage: number;

  gamesList?: { _id: string; name: string; changeDate: Date }[];
  setGamesListFetchStatus: attemptsFetchStatus;
  getGameAllAttemptsFetchStatus: attemptsFetchStatus;
  gameAllAttempts?: {
    completedCorrectly?: boolean;
    crosswordID?: string;
    crosswordName?: string;
    duration?: string;
    finishDate?: Date;
    isCompleted: boolean;
    startDate?: Date;
    telegramID: number;
    telegramUserName?: string;
    _id: string;
    userPhoto?: string;
    firstName?: string;
    lastName?: string;
    GTSGameID?: string;
    GTSGameName?: string;
    timeRemained?: number;
  }[];
  getAllGamesErrorMessage?: string;
  getGameAttemptsErrorMessage?: string;
  selectedGamesName?: string;
}

const initAppState: IAttemptsState = {
  attempts: 0,
  attemptsLimitOnPage: 3,

  gamesListCurrentPage: 1,
  isLastGamesListPage: false,
  showHideGamesList: true,
  gamesListTransitionClasses: "games-list-left",

  // transition animation
  attemptsListCurrentPage: 1,
  isLastAttemptsListPage: false,
  showHideAttemptsList: true,
  attemptsListTransitionClasses: "games-list-left",
  //

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
    setGetAllGamesErrorMessage(state, action) {
      state.getAllGamesErrorMessage = action.payload;
    },
    setGetGameAllAttemptsFetchStatus(state, action) {
      state.getGameAllAttemptsFetchStatus = action.payload;
    },
    setGamesListCurrentPage(state, action) {
      state.gamesListCurrentPage = action.payload;
    },
    setIsLastGamesListPage(state, action) {
      state.isLastGamesListPage = action.payload;
    },
    setShowHideGamesList(state, action) {
      state.showHideGamesList = action.payload;
    },
    setGamesListTransitionClasses(state, action) {
      state.gamesListTransitionClasses = action.payload;
    },
    setCurrentGameID(state, action) {
      state.currentGameID = action.payload;
    },

    setAttemptsListCurrentPage(state, action) {
      state.attemptsListCurrentPage = action.payload;
    },
    setIsLastAttemptsListPage(state, action) {
      state.isLastAttemptsListPage = action.payload;
    },
    setShowHideAttemptsList(state, action) {
      state.showHideAttemptsList = action.payload;
    },
    setAttemptsListTransitionClasses(state, action) {
      state.attemptsListTransitionClasses = action.payload;
    },
    setGetGameAttemptsErrorMessage(state, action) {
      state.getGameAttemptsErrorMessage = action.payload;
    },
    setSelectedGamesName(state, action) {
      state.selectedGamesName = action.payload;
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
    builder.addCase(getGameAllAttempts.rejected, (state, action) => {
      // console.log(action.payload);
      state.getGameAttemptsErrorMessage = action.payload as string;
      state.getGameAllAttemptsFetchStatus = attemptsFetchStatus.Error;
    });
  },
});

export const attemptsActions = attemptsSlice.actions;
