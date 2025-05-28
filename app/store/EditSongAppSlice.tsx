import { FFmpeg } from "@ffmpeg/ffmpeg";
import { createSlice } from "@reduxjs/toolkit";
import { RefObject, useRef } from "react";

interface ISongActions<ParametersObj> {
  payload: ParametersObj;
  type: string;
}

export interface IEditSongAppSlice {
  EditSongAppState: {
    test: string;
    showDeleteOptionalSongNotificationModal: boolean;
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
      showNotificationModal: boolean;
      editedSongURL?: string;
      editedSongName?: string;
      blobString?: string;
      editedSongData?: any;
      optionalFfmpeg?: FFmpeg;
    }[];
  };
}

interface IEditSongAppState {
  test: string;
  showDeleteOptionalSongNotificationModal: boolean;

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
    showNotificationModal: boolean;
    editedSongURL?: string;
    editedSongName?: string;
    blobString?: string;
    editedSongData?: any;
    optionalFfmpeg?: FFmpeg;
  }[];
}

export const EditSongAppState: IEditSongAppState = {
  test: "editSongApp",
  showDeleteOptionalSongNotificationModal: false,

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
    setMainSongPeaksInstance(state, action: ISongActions<any>) {
      state.mainSong.peaksInstance = action.payload;
    },
    setMainSongIsPlayingStatus(state, action: ISongActions<boolean>) {
      state.mainSong.editedSongIsPlaying = action.payload;
    },
    setMainSongPointsStatus(state, action: ISongActions<{ start: boolean; finish: boolean }>) {
      state.mainSong.pointsStatus = action.payload;
    },
    setMainSongEditedSegmantIsCreatedStatus(state, action: ISongActions<boolean>) {
      state.mainSong.editedSegmantIsCreated = action.payload;
    },
    setMainSongEditedSongURL(state, action: ISongActions<string | undefined>) {
      state.mainSong.editedSongURL = action.payload;
    },
    setMainSongEditedSongName(state, action: ISongActions<string | undefined>) {
      state.mainSong.editedSongName = action.payload;
    },
    setMainSongEditedSongBlobString(state, action: ISongActions<string | undefined>) {
      state.mainSong.blobString = action.payload;
    },
    setMainSongEditedSongData(state, action: ISongActions<any>) {
      state.mainSong.editedSongData = action.payload;
    },
    setMainSongshowNotificationModalStatus(state, action: ISongActions<boolean>) {
      state.mainSong.showNotificationModal = action.payload;
    },
    setIsMainSongMutedStatus(state, action: ISongActions<boolean>) {
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
          showNotificationModal: false,
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
            showNotificationModal: false,
          },
        ];
      }
    },

    setOptionalAudioSongIsPlayingStatus(
      state,
      action: ISongActions<{ value: number; editedSongIsPlaying: boolean }>
    ) {
      state.addeOptionalAudioValue[action.payload.value].editedSongIsPlaying =
        action.payload.editedSongIsPlaying;
    },
    setOptionalSongPeaksInstance(
      state,
      action: ISongActions<{ value: number; peaksInstance: any }>
    ) {
      state.addeOptionalAudioValue[action.payload.value].peaksInstance =
        action.payload.peaksInstance;
    },
    setOptionalSongVolume(state, action: ISongActions<{ value: number; songVolume: number }>) {
      state.addeOptionalAudioValue[action.payload.value].songVolume = action.payload.songVolume;
    },
    setOptionalSongPointsStatus(
      state,
      action: ISongActions<{
        value: number;
        pointsStatus: {
          start: boolean;
          finish: boolean;
        };
      }>
    ) {
      state.addeOptionalAudioValue[action.payload.value].pointsStatus = action.payload.pointsStatus;
    },
    setOptionalSongEditedSegmentIsCreatedStatus(
      state,
      action: ISongActions<{ value: number; status: boolean }>
    ) {
      state.addeOptionalAudioValue[action.payload.value].editedSegmentIsCreated =
        action.payload.status;
    },
    setOptionalSongshowNotificationModalStatus(
      state,
      action: ISongActions<{ value: number; status: boolean }>
    ) {
      state.addeOptionalAudioValue[action.payload.value].showNotificationModal =
        action.payload.status;
    },
    setOptionalSongEditedSongURL(
      state,
      action: ISongActions<{ value: number; editedSongURL: string | undefined }>
    ) {
      state.addeOptionalAudioValue[action.payload.value].editedSongURL =
        action.payload.editedSongURL;
    },
    setOptionalSongEditedSongName(
      state,
      action: ISongActions<{ value: number; editedSongName: string | undefined }>
    ) {
      state.addeOptionalAudioValue[action.payload.value].editedSongName =
        action.payload.editedSongName;
    },
    setOptionalSongEditedSongBlobString(
      state,
      action: ISongActions<{ value: number; blobString: string | undefined }>
    ) {
      state.addeOptionalAudioValue[action.payload.value].blobString = action.payload.blobString;
    },
    setOptionalSongData(state, action: ISongActions<{ value: number; songData: any }>) {
      state.addeOptionalAudioValue[action.payload.value].editedSongData = action.payload.songData;
    },
    setOptionalFfmpeg(state, action: ISongActions<{ value: number; ffmpeg: FFmpeg }>) {
      state.addeOptionalAudioValue[action.payload.value].optionalFfmpeg = action.payload.ffmpeg;
    },
    deleteOptionalSong(state, action: ISongActions<number>) {
      if (!state.addeOptionalAudioValue) {
        return;
      }
      state.addeOptionalAudioValue.splice(action.payload, 1);
    },
    setShowDeleteOptionalSongNotificationModal(state, action) {
      state.showDeleteOptionalSongNotificationModal = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const EditSongAppStateActions = EditSongAppSlice.actions;
