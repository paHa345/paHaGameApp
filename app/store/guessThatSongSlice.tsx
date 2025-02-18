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

      console.log(availableGTSGames.result.isLastPage);
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
  },
  extraReducers(builder) {
    builder.addCase(getAvailableGTSGames.pending, (state) => {
      state.fetchGTSGamesArrStatus = GTSGameFetchStatus.Loading;
    });
    builder.addCase(getAvailableGTSGames.fulfilled, (state) => {
      state.fetchGTSGamesArrStatus = GTSGameFetchStatus.Resolve;
    });
    builder.addCase(getAvailableGTSGames.rejected, (state) => {
      state.fetchGTSGamesArrStatus = GTSGameFetchStatus.Error;
    });
  },
});

export const guessThatSongActions = guessThatSongSlice.actions;
