import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GTSCreateGameActions } from "./GTSCreateGameSlice";

export const getAvailableGTSGames = createAsyncThunk(
  "GTSGameState/getAvailableGTSGames",
  async function (getGTSGamesData: { page?: number }, { rejectWithValue, dispatch }) {
    try {
      dispatch(guessThatSongActions.setShowHideGTSGamesList(false));

      const getAvailableGTSGamesReq = await fetch(
        `/api/guessThatSong/GTSGame/getAvailableGTSGames?page=${getGTSGamesData?.page ? getGTSGamesData?.page : 1}`
      );

      const availableGTSGames = await getAvailableGTSGamesReq.json();

      if (!getAvailableGTSGamesReq.ok) {
        throw new Error(availableGTSGames.message);
      }

      // console.log(availableGTSGames.result.isLastPage);
      dispatch(
        guessThatSongActions.setAvailableGTSGamesArr(availableGTSGames.result.availableGTSGames)
      );
      dispatch(guessThatSongActions.setGTSGamesListCurrentPage(getGTSGamesData.page));
      dispatch(guessThatSongActions.setIsLastGTSGamesListPage(availableGTSGames.result.isLastPage));
      dispatch(guessThatSongActions.setShowHideGTSGamesList(true));
    } catch (error: any) {
      dispatch(guessThatSongActions.setShowHideGTSGamesList(true));
      dispatch(guessThatSongActions.setAvailableGTSGamesErrorMessage(error.message));

      return rejectWithValue(error.message);
    }
  }
);

export const createAttemptAndAddInSlice = createAsyncThunk(
  "GTSGameState/createAttemptAndAddInSlice",
  async function (attemptData: any, { rejectWithValue, dispatch }) {
    try {
      console.log(attemptData);

      const createGTSGameAttemptReq = await fetch(`/api/guessThatSong/GTSGame/createAttempt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attemptData),
      });
      if (!createGTSGameAttemptReq.ok) {
        throw new Error("Ошибка сервера");
      }
      const createdGTSGameAttempt = await createGTSGameAttemptReq.json();

      if (createdGTSGameAttempt.result.length) {
        dispatch(
          guessThatSongActions.setCurrentGTSGameAttemptID(createdGTSGameAttempt.result[0]._id)
        );
      } else {
        dispatch(guessThatSongActions.setCurrentGTSGameAttemptID(createdGTSGameAttempt.result._id));
      }
    } catch (error: any) {
      dispatch(guessThatSongActions.setCreateAttemptErrorMessage(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const startGTSGameLaunchAttemptTimer = createAsyncThunk(
  "GTSGameState/startGTSGameLaunchAttemptTimer",
  async function ({ currentAttemptID, telegramUserID }: any, { rejectWithValue, dispatch }) {
    try {
      const getGTSGameStartDataReq = await fetch(
        `/api/guessThatSong/GTSGame/getGTSGameSongAndPosition/${currentAttemptID}/${telegramUserID}`
      );
      const getGTSGameStartData = await getGTSGameStartDataReq.json();
      console.log(getGTSGameStartData);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export enum GTSGameFetchStatus {
  Ready = "ready",
  Loading = "loading",
  Resolve = "resolve",
  Error = "error",
}

export interface IGuessThatSongSlice {
  guessThatSongState: {
    browserType: string;

    songIsPlaying: boolean;
    songVolume: number;
    mutedSongVolume: boolean;
    currentSongDuration?: number;
    playingSongCurrentTime?: number;
    showChooseGTSModal: boolean;
    showHideGTSGamesList: boolean;
    availableGTSGamesArr: {
      _id: string;
      name: string;
      changeDate: Date;
    }[];
    GTSGamesListCurrentPage: number;
    isLastGTSGamesListPage: boolean;
    fetchGTSGamesArrStatus: GTSGameFetchStatus;
    getAvailableGTSGamesErrorMessage?: string;
    fetchAvailableGTSGameStatus: GTSGameFetchStatus;
    createAttemptStatus: GTSGameFetchStatus;
    createAttemptErrorMessage?: string;
    currentGTSGameAttemptID?: string;
    startGameStatus: boolean;
  };
}

interface IGuessThatSongState {
  browserType: string;

  songIsPlaying: boolean;
  songVolume: number;
  mutedSongVolume: boolean;
  currentSongDuration?: number;
  playingSongCurrentTime?: number;
  showChooseGTSModal: boolean;
  showHideGTSGamesList: boolean;
  availableGTSGamesArr: {
    _id: string;
    name: string;
    changeDate: Date;
  }[];
  GTSGamesListCurrentPage: number;
  isLastGTSGamesListPage: boolean;
  fetchGTSGamesArrStatus: GTSGameFetchStatus;
  getAvailableGTSGamesErrorMessage?: string;
  fetchAvailableGTSGameStatus: GTSGameFetchStatus;
  createAttemptStatus: GTSGameFetchStatus;
  createAttemptErrorMessage?: string;
  currentGTSGameAttemptID?: string;
  startGameStatus: boolean;
}

export const initGuessThatSongState: IGuessThatSongState = {
  browserType: "",

  songIsPlaying: false,
  songVolume: 60,
  mutedSongVolume: false,
  showChooseGTSModal: false,
  showHideGTSGamesList: true,
  availableGTSGamesArr: [],
  GTSGamesListCurrentPage: 1,
  isLastGTSGamesListPage: false,
  fetchGTSGamesArrStatus: GTSGameFetchStatus.Ready,
  fetchAvailableGTSGameStatus: GTSGameFetchStatus.Ready,
  createAttemptStatus: GTSGameFetchStatus.Ready,
  startGameStatus: false,
};

export const guessThatSongSlice = createSlice({
  name: "guessThatSongState",
  initialState: initGuessThatSongState,
  reducers: {
    setBrowserType: (state, action) => {
      state.browserType = action.payload;
    },
    setSongIsPlayingStatus: (state, action) => {
      state.songIsPlaying = action.payload;
    },
    setSongVolume: (state, action) => {
      state.songVolume = action.payload;
    },
    setMutedSongVolume: (state, action) => {
      state.mutedSongVolume = action.payload;
    },
    setCurrentSongDuration(state, action) {
      state.currentSongDuration = action.payload;
    },
    setPlayingSongCurrentTime(state, action) {
      state.playingSongCurrentTime = action.payload;
    },
    setShowChooseGTSModal(state, action) {
      state.showChooseGTSModal = action.payload;
    },
    setShowHideGTSGamesList(state, action) {
      state.showHideGTSGamesList = action.payload;
    },
    setAvailableGTSGamesArr(state, action) {
      state.availableGTSGamesArr = action.payload;
    },
    setGTSGamesListCurrentPage(state, action) {
      state.GTSGamesListCurrentPage = action.payload;
    },
    setIsLastGTSGamesListPage(state, action) {
      state.isLastGTSGamesListPage = action.payload;
    },
    setAvailableGTSGamesErrorMessage(state, action) {
      state.getAvailableGTSGamesErrorMessage = action.payload;
    },
    setFetchAvailableGTSGameStatus(state, action) {
      state.fetchAvailableGTSGameStatus = action.payload;
    },
    setCreateAttemptStatus(state, action) {
      state.createAttemptStatus = action.payload;
    },
    setCreateAttemptErrorMessage(state, action) {
      state.createAttemptErrorMessage = action.payload;
    },
    setCurrentGTSGameAttemptID(state, action) {
      state.currentGTSGameAttemptID = action.payload;
    },
    setStartGameStatus(state, action) {
      state.startGameStatus = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getAvailableGTSGames.pending, (state) => {
      state.fetchGTSGamesArrStatus = GTSGameFetchStatus.Loading;
    });
    builder.addCase(createAttemptAndAddInSlice.pending, (state) => {
      state.createAttemptStatus = GTSGameFetchStatus.Loading;
    });
    builder.addCase(getAvailableGTSGames.fulfilled, (state) => {
      state.fetchGTSGamesArrStatus = GTSGameFetchStatus.Resolve;
    });
    builder.addCase(createAttemptAndAddInSlice.fulfilled, (state) => {
      state.createAttemptStatus = GTSGameFetchStatus.Resolve;
    });
    builder.addCase(getAvailableGTSGames.rejected, (state) => {
      state.fetchGTSGamesArrStatus = GTSGameFetchStatus.Error;
    });
    builder.addCase(createAttemptAndAddInSlice.rejected, (state) => {
      state.createAttemptStatus = GTSGameFetchStatus.Error;
    });
  },
});

export const guessThatSongActions = guessThatSongSlice.actions;
