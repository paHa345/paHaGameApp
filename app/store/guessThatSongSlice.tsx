import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GTSCreateGameActions } from "./GTSCreateGameSlice";
import { isTelegramWebApp } from "../components/Layout/MainLayout";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

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
      if (!getGTSGameStartDataReq.ok) {
        throw new Error("Ошибка сервера");
      }
      const getGTSGameStartData = await getGTSGameStartDataReq.json();
      console.log(getGTSGameStartData);
      dispatch(guessThatSongActions.setCurrentGTSAttemptData(getGTSGameStartData.result));
      dispatch(guessThatSongActions.setStartGameStatus(true));
    } catch (error: any) {
      dispatch(guessThatSongActions.setStartGTSGameLaunchAttemptTimerErrorMessage(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const checkGTSGameAnswerAndSetQuestion = createAsyncThunk(
  "GTSGameState/checkGTSGameAnswerAndSetQuestion",
  async function ({ answerID, attemptID }: any, { rejectWithValue, dispatch }) {
    try {
      let telegramUserID;
      if (isTelegramWebApp()) {
        const { initData } = retrieveLaunchParams();

        telegramUserID = initData?.user;
      } else {
        telegramUserID = 777777;
      }
      console.log(telegramUserID);
      console.log(answerID);
      console.log(attemptID);
      const checkAnswerReq = await fetch(`/api/guessThatSong/GTSGame/checkAnswer/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telegramUserID, answerID, attemptID }),
      });

      if (!checkAnswerReq.ok) {
        throw new Error("Ошибка сервера");
      }

      const checkAnswer = await checkAnswerReq.json();

      console.log(checkAnswer);
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
    currentGTSAttemptData: {
      attemptFullTime: number;
      attemptTimeRemained: number;
      songURL: string;
      questionAnswers: { text: string; _id: string }[];
      answerTime: number;
      questionsStatus: {
        questionID: string;
        getAnswer: boolean;
        _id: string;
      }[];
      currentQuestion: number;
    };
    startGTSGameLaunchAttemptTimerStatus: GTSGameFetchStatus;
    startGTSGameLaunchAttemptTimerErrorMessage?: string;
    currentAttemptSongIsPlaying: boolean;
    abortController?: AbortController;
    showGTSAnswersModal: boolean;
    chosenGTSGameAnswerID?: string;
    stopAnswerTimerController?: AbortController;
    currentAnswerTimeRemained: number;
    checkGTSGameAnswerStatus: GTSGameFetchStatus;
    checkGTSGameAnswerErrorMessage?: string;
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

  currentGTSAttemptData: {
    attemptFullTime: number;
    attemptTimeRemained: number;
    songURL: string;
    questionAnswers: { text: string; _id: string }[];
    answerTime: number;
    questionsStatus: {
      questionID: string;
      getAnswer: boolean;
      _id: string;
    }[];
    currentQuestion: number;
  };
  startGTSGameLaunchAttemptTimerStatus: GTSGameFetchStatus;
  startGTSGameLaunchAttemptTimerErrorMessage?: string;
  currentAttemptSongIsPlaying: boolean;
  abortController?: AbortController;
  showGTSAnswersModal: boolean;
  chosenGTSGameAnswerID?: string;
  stopAnswerTimerController?: AbortController;
  currentAnswerTimeRemained: number;
  checkGTSGameAnswerStatus: GTSGameFetchStatus;
  checkGTSGameAnswerErrorMessage?: string;
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

  currentGTSAttemptData: {
    attemptFullTime: 0,
    attemptTimeRemained: 0,
    songURL: "",
    questionAnswers: [{ text: "", _id: "" }],
    answerTime: 0,
    questionsStatus: [
      {
        questionID: "",
        getAnswer: true,
        _id: "",
      },
    ],
    currentQuestion: 0,
  },
  startGTSGameLaunchAttemptTimerStatus: GTSGameFetchStatus.Ready,
  currentAttemptSongIsPlaying: false,
  showGTSAnswersModal: false,
  currentAnswerTimeRemained: 10,
  checkGTSGameAnswerStatus: GTSGameFetchStatus.Ready,
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
    setCurrentGTSAttemptData(state, action) {
      state.currentGTSAttemptData = action.payload;
    },
    setStartGTSGameLaunchAttemptTimerErrorMessage(state, action) {
      state.startGTSGameLaunchAttemptTimerErrorMessage = action.payload;
    },
    setCurrentAttemptSongIsPlaying(state, action) {
      state.currentAttemptSongIsPlaying = action.payload;
    },
    setAbortController(state, action) {
      state.abortController = action.payload;
    },
    setCurrentAttemptTimeRemained(state, action) {
      state.currentGTSAttemptData.attemptTimeRemained = action.payload;
    },
    setShowGTSAnswersModal(state, action) {
      state.showGTSAnswersModal = action.payload;
    },
    setCurrentAttamptAnswerTime(state, action) {
      state.currentGTSAttemptData.answerTime = action.payload;
    },
    setChosenGTSGameAnswerID(state, action) {
      state.chosenGTSGameAnswerID = action.payload;
    },
    setStopAnswerTimerController(state, action) {
      state.stopAnswerTimerController = action.payload;
    },
    setCurrentAnswerTimeRemained(state, action) {
      state.currentGTSAttemptData.answerTime = action.payload;
    },
    setCheckGTSGameAnswerStatus(state, action) {
      state.checkGTSGameAnswerStatus = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getAvailableGTSGames.pending, (state) => {
      state.fetchGTSGamesArrStatus = GTSGameFetchStatus.Loading;
    });
    builder.addCase(createAttemptAndAddInSlice.pending, (state) => {
      state.createAttemptStatus = GTSGameFetchStatus.Loading;
    });
    builder.addCase(startGTSGameLaunchAttemptTimer.pending, (state) => {
      state.startGTSGameLaunchAttemptTimerStatus = GTSGameFetchStatus.Loading;
    });
    builder.addCase(checkGTSGameAnswerAndSetQuestion.pending, (state) => {
      state.checkGTSGameAnswerStatus = GTSGameFetchStatus.Loading;
    });
    builder.addCase(getAvailableGTSGames.fulfilled, (state) => {
      state.fetchGTSGamesArrStatus = GTSGameFetchStatus.Resolve;
    });
    builder.addCase(createAttemptAndAddInSlice.fulfilled, (state) => {
      state.createAttemptStatus = GTSGameFetchStatus.Resolve;
    });
    builder.addCase(startGTSGameLaunchAttemptTimer.fulfilled, (state) => {
      state.startGTSGameLaunchAttemptTimerStatus = GTSGameFetchStatus.Resolve;
    });
    builder.addCase(checkGTSGameAnswerAndSetQuestion.fulfilled, (state) => {
      state.checkGTSGameAnswerStatus = GTSGameFetchStatus.Resolve;
    });
    builder.addCase(getAvailableGTSGames.rejected, (state) => {
      state.fetchGTSGamesArrStatus = GTSGameFetchStatus.Error;
    });
    builder.addCase(createAttemptAndAddInSlice.rejected, (state) => {
      state.createAttemptStatus = GTSGameFetchStatus.Error;
    });
    builder.addCase(startGTSGameLaunchAttemptTimer.rejected, (state) => {
      state.startGTSGameLaunchAttemptTimerStatus = GTSGameFetchStatus.Error;
    });
    builder.addCase(checkGTSGameAnswerAndSetQuestion.rejected, (state) => {
      state.checkGTSGameAnswerStatus = GTSGameFetchStatus.Error;
    });
  },
});

export const guessThatSongActions = guessThatSongSlice.actions;
