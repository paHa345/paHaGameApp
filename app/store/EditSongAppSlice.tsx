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
      blobString?: string;
      editedSongData?: any;
      showNotificationModal: boolean;
      isSongMuted: boolean;
    };
    addeOptionalAudioValue: {
      peaksInstance: any;

      value: number;
      editedSongIsPlaying: boolean;
      songVolume: number;
      isSongMuted: boolean;
      pointsStatus: {
        start: boolean;
        finish: boolean;
      };
      editedSegmentIsCreated: boolean;
    }[];
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
    blobString?: string;
    editedSongData?: any;
    showNotificationModal: boolean;
    isSongMuted: boolean;
  };
  addeOptionalAudioValue: {
    peaksInstance: any;

    value: number;
    editedSongIsPlaying: boolean;
    songVolume: number;
    isSongMuted: boolean;
    pointsStatus: {
      start: boolean;
      finish: boolean;
    };
    editedSegmentIsCreated: boolean;
  }[];
}

export const EditSongAppState: IEditSongAppState = {
  test: "editSongApp",
  mainSong: {
    peaksInstance: null,
    editedSongIsPlaying: false,

    pointsStatus: { start: false, finish: false },
    editedSegmantIsCreated: false,
    showNotificationModal: false,
    isSongMuted: false,
  },
  addeOptionalAudioValue: [],
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
    setMainSongEditedSongBlobString(state, action) {
      state.mainSong.blobString = action.payload;
    },
    setMainSongEditedSongData(state, action) {
      state.mainSong.editedSongData = action.payload;
    },
    setMainSongshowNotificationModalStatus(state, action) {
      state.mainSong.showNotificationModal = action.payload;
    },
    setIsMainSongMutedStatus(state, action) {
      state.mainSong.isSongMuted = action.payload;
    },
    setAddedOptionalAudioValue(state) {
      const length = state.addeOptionalAudioValue.length;
      if (length) {
        state.addeOptionalAudioValue.push({
          value: state.addeOptionalAudioValue[length - 1].value + 1,
          editedSongIsPlaying: false,
          songVolume: 60,
          isSongMuted: false,
          peaksInstance: null,
          pointsStatus: { start: false, finish: false },
          editedSegmentIsCreated: false,
        });
      } else {
        state.addeOptionalAudioValue = [
          {
            value: 0,
            editedSongIsPlaying: false,
            songVolume: 60,
            isSongMuted: false,
            peaksInstance: null,
            pointsStatus: { start: false, finish: false },
            editedSegmentIsCreated: false,
          },
        ];
      }
    },
    setOptionalAudioSongIsPlayingStatus(state, action) {
      state.addeOptionalAudioValue[action.payload.value].editedSongIsPlaying =
        action.payload.status;
    },
    setOptionalSongPeaksInstance(state, action) {
      state.addeOptionalAudioValue[action.payload.value].peaksInstance =
        action.payload.peaksInstance;
    },
    setOptionalSongVolume(state, action) {
      state.addeOptionalAudioValue[action.payload.value].songVolume = action.payload.songVolume;
    },
    setOptionalSongPointsStatus(
      state,
      action: {
        payload: {
          value: number;
          pointsStatus: {
            start: boolean;
            finish: boolean;
          };
        };
        type: string;
      }
    ) {
      state.addeOptionalAudioValue[action.payload.value].pointsStatus = action.payload.pointsStatus;
    },
    setOptionalSongEditedSegmentIsCreatedStatus(state, action) {
      state.addeOptionalAudioValue[action.payload.value].editedSegmentIsCreated =
        action.payload.status;
    },
  },
  extraReducers: (builder) => {},
});

export const EditSongAppStateActions = EditSongAppSlice.actions;
