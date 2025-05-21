import { createSlice } from "@reduxjs/toolkit";
import { RefObject, useRef } from "react";

export interface IEditSongAppSlice {
  EditSongAppState: {
    test: string;
    mainSong: {
      peaksInstance: any;
      editedSongIsPlaying: boolean;
      pointsStatus: {
        start: boolean;
        finish: boolean;
      };
      editedSegmantIsCreated: boolean;
      editedSongURL?: string;
      editedSongName?: string;
    };
  };
}

interface IEditSongAppState {
  test: string;
  mainSong: {
    peaksInstance: any;
    editedSongIsPlaying: boolean;
    pointsStatus: {
      start: boolean;
      finish: boolean;
    };
    editedSegmantIsCreated: boolean;
    editedSongURL?: string;
    editedSongName?: string;
  };
}

export const EditSongAppState: IEditSongAppState = {
  test: "editSongApp",
  mainSong: {
    peaksInstance: null,
    editedSongIsPlaying: false,

    pointsStatus: { start: false, finish: false },
    editedSegmantIsCreated: false,
  },
};

export const EditSongAppSlice = createSlice({
  name: "EditSongApp",
  initialState: EditSongAppState,
  reducers: {
    setTestName(state, action) {
      state.test = "newData";
    },
    setMainSongPeaksInstance(state, action) {
      state.mainSong.peaksInstance = action.payload;
    },
    setMainSongIsPlayingStatus(state, action) {
      state.mainSong.editedSongIsPlaying = action.payload;
    },
    setMainSongPointsStatus(state, action) {
      state.mainSong.pointsStatus = action.payload;
    },
    setMainSongEditedSegmantIsCreatedStatus(state, action) {
      state.mainSong.editedSegmantIsCreated = action.payload;
    },
    setMainSongEditedSongURL(state, action) {
      state.mainSong.editedSongURL = action.payload;
    },
    setMainSongEditedSongName(state, action) {
      state.mainSong.editedSongName = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const EditSongAppStateActions = EditSongAppSlice.actions;
