import { createSlice } from "@reduxjs/toolkit";

export interface IGuessThatSongSlice {
  guessThatSongState: {
    songIsPlaying: boolean;
    songVolume: number;
    mutedSongVolume: boolean;
    currentSongDuration?: number;
    playingSongCurrentTime?: number;
  };
}

interface IGuessThatSongState {
  songIsPlaying: boolean;
  songVolume: number;
  mutedSongVolume: boolean;
  currentSongDuration?: number;
  playingSongCurrentTime?: number;
}

export const initGuessThatSongState: IGuessThatSongState = {
  songIsPlaying: false,
  songVolume: 60,
  mutedSongVolume: false,
};

export const guessThatSongSlice = createSlice({
  name: "guessThatSongState",
  initialState: initGuessThatSongState,
  reducers: {
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
  },
  extraReducers(builder) {},
});

export const guessThatSongActions = guessThatSongSlice.actions;
