import { createSlice } from "@reduxjs/toolkit";

export interface IGTSCreateGameSlice {
  GTSCreateGameState: {
    createdGgameValue: number;
    createdGameName: string;
    gameIsBeingCreated: boolean;
    currentAddedSong?: number;
  };
}

interface IGTSCreateGameState {
  createdGgameValue: number;
  createdGameName: string;
  gameIsBeingCreated: boolean;
  currentAddedSong?: number;
}

export const initGuessThatSongState: IGTSCreateGameState = {
  createdGgameValue: 0,
  createdGameName: "",
  gameIsBeingCreated: false,
};

export const GTSCreateGameSlice = createSlice({
  name: "GTSCreateGameState",
  initialState: initGuessThatSongState,
  reducers: {
    setGameValue(state, action) {
      state.createdGgameValue = action.payload;
    },
    setCreatedGameName(state, action) {
      state.createdGameName = action.payload;
    },
    setGameIsBeingCreated(state, action) {
      state.gameIsBeingCreated = action.payload;
    },
    setCurrentAddedSong(state, action) {
      state.currentAddedSong = action.payload;
    },
  },
  extraReducers(builder) {},
});

export const GTSCreateGameActions = GTSCreateGameSlice.actions;
