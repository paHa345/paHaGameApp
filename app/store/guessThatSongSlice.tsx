import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GTSCreateGameActions } from "./GTSCreateGameSlice";
import { isTelegramWebApp } from "../components/Layout/MainLayout";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { redirect } from "next/navigation";

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
        dispatch(guessThatSongActions.setCurrentGTSAttemptData(createdGTSGameAttempt.result[0]));
        dispatch(
          guessThatSongActions.setAttemptQuestionStatus(
            createdGTSGameAttempt.result[0].attemptQuestionStatus
          )
        );
      } else {
        dispatch(guessThatSongActions.setCurrentGTSGameAttemptID(createdGTSGameAttempt.result._id));
        dispatch(guessThatSongActions.setCurrentGTSAttemptData(createdGTSGameAttempt.result));
        dispatch(
          guessThatSongActions.setAttemptQuestionStatus(
            createdGTSGameAttempt.result.attemptQuestionStatus
          )
        );
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
      dispatch(guessThatSongActions.setCurrentGTSAttemptData(getGTSGameStartData.result));
      dispatch(
        guessThatSongActions.setArtistAnswerArr([
          {
            text: "",
            id: "opop",
          },
        ])
      );

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
      dispatch(guessThatSongActions.setBonusTime(-1));
      dispatch(guessThatSongActions.setAnswerIsCorrect(null));
      let telegramUserID;
      if (isTelegramWebApp()) {
        const { initData } = retrieveLaunchParams();

        telegramUserID = initData?.user?.id;
      } else {
        telegramUserID = 777777;
      }

      const getArtistsListReq = await fetch(
        `/api/guessThatSong/GTSGame/getCurrentAttemptArtistsList/${attemptID}/${telegramUserID}`
      );

      if (!getArtistsListReq.ok) {
        throw new Error("Ошибка сервера");
      }

      const getArtistsList = await getArtistsListReq.json();

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

      const setAttemptFullAnswerTimeReq = await fetch(
        `/api/guessThatSong/GTSGame/setAttemptFullAnswerTime/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ telegramUserID, answerID, attemptID }),
        }
      );

      if (!setAttemptFullAnswerTimeReq.ok) {
        throw new Error("Ошибка сервера");
      }

      const setAttemptFullAnswerTime = await setAttemptFullAnswerTimeReq.json();

      dispatch(guessThatSongActions.setBonusTime(checkAnswer.result.bonusTime));
      dispatch(guessThatSongActions.setAnswerIsCorrect(checkAnswer.result.isCorrect));
      dispatch(guessThatSongActions.setImageURL(checkAnswer.result.imageURL));

      const getCurrentAttemptReq = await fetch(
        `/api/guessThatSong/GTSGame/getCurrentAttempt/${attemptID}/${telegramUserID}`
      );

      if (!getCurrentAttemptReq.ok) {
        throw new Error("Ошибка сервера");
      }

      const getCurrentAttempt = await getCurrentAttemptReq.json();

      dispatch(
        guessThatSongActions.setAttemptCurrentQuestion(getCurrentAttempt.result.currentQuestion)
      );
      dispatch(
        guessThatSongActions.setAttemptQuestionStatus(
          getCurrentAttempt.result.attemptQuestionStatus
        )
      );

      dispatch(
        guessThatSongActions.setCurrentAttemptTimeRemained(getCurrentAttempt.result.timeRemained)
      );
      dispatch(
        guessThatSongActions.setCurrentAttamptAnswerTime(getCurrentAttempt.result.answerTime)
      );

      dispatch(guessThatSongActions.setArtistAnswerArr(getArtistsList.result.artistAnswerArr));

      if (checkAnswer.result.attemptIsCompleted) {
        setTimeout(() => {
          dispatch(
            guessThatSongActions.setCurrentUserCompletedGTSAttempt(checkAnswer.result.attempt)
          );
          dispatch(guessThatSongActions.setStartGameStatus(false));
          dispatch(guessThatSongActions.setShowGTSAnswersModal(false));
          // dispatch(guessThatSongActions.setCurrentGTSGameAttemptID(""));
          dispatch(guessThatSongActions.setNextQuestionNotification(undefined));
          dispatch(guessThatSongActions.setImageURL(undefined));
          dispatch(guessThatSongActions.setAnswerIsCorrect(null));
          // dispatch(guessThatSongActions.setCheckGTSGameAnswerStatus(GTSGameFetchStatus.Loading));

          redirect("/results");
        }, 4000);
      }

      //тут устанавливаем уведомление "Переходим к следующему вопросу"

      dispatch(
        guessThatSongActions.setNextQuestionNotification("Переходим к следующему вопросу...")
      );

      setTimeout(() => {
        // console.log("Переходим к следующему вопросу");
        dispatch(guessThatSongActions.setStartGameStatus(false));
        dispatch(guessThatSongActions.setShowGTSAnswersModal(false));
        dispatch(guessThatSongActions.setNextQuestionNotification(undefined));
        dispatch(guessThatSongActions.setImageURL(undefined));
        dispatch(guessThatSongActions.setAnswerIsCorrect(null));
      }, 4000);
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
      attemptTime: number;
      timeRemained: number;
      songURL: string;
      questionAnswers: { text: string; _id: string }[];
      answerTime: number;
      questionsStatus: {
        questionID: string;
        getAnswer: boolean;
        answerIsCorrect?: boolean;
        _id: string;
        userAnswerSongName?: string;
        correctAnswerSongName?: string;
        bonusTime?: number;
      }[];
      currentQuestion: number;
      bonusTime: number;
      answerIsCorrect: boolean | null;
      imageURL?: string;
      artistAnswerArr: {
        text: string;
        _id: string;
      }[];
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
    currentUserCompletedGTSAttempt?: {
      _id: string;
      telegramUserName?: string;
      telegramID: number;
      startDate: Date;
      GTSGameID: string;
      GTSGameName: string;
      timeRemained: number;
      attemptTime: number;
      isCompleted: boolean;
      currentQuestion: number;
      answerTime: number;
      attemptQuestionStatus: {
        _id: string;
        questionID: string;
        getAnswer: boolean;
        answerIsCorrect?: boolean;
        userAnswerSongName?: string;
        correctAnswerSongName?: string;
        bonusTime?: number;
      }[];
      firstName?: string;
      lastName?: string;
      userPhoto?: string;
    };
    nextQuestionNotification?: string;
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
    attemptTime: number;
    timeRemained: number;
    songURL: string;
    questionAnswers: { text: string; _id: string }[];
    answerTime: number;
    questionsStatus: {
      questionID: string;
      getAnswer: boolean;
      _id: string;
      userAnswerSongName?: string;
      correctAnswerSongName?: string;
      answerIsCorrect?: boolean;
    }[];
    currentQuestion: number;
    bonusTime: number;
    answerIsCorrect?: boolean | null;
    imageURL?: string;
    artistAnswerArr: {
      text: string;
      _id: string;
    }[];
  };

  currentUserCompletedGTSAttempt?: {
    _id: string;
    telegramUserName?: string;
    telegramID: number;
    startDate: Date;
    GTSGameID: string;
    GTSGameName: string;
    timeRemained: number;
    attemptTime: number;
    isCompleted: boolean;
    currentQuestion: number;
    answerTime: number;
    attemptQuestionStatus: {
      _id: string;

      questionID: string;
      getAnswer: boolean;
      answerIsCorrect?: boolean;
      userAnswerSongName?: string;
      correctAnswerSongName?: string;
      bonusTime?: number;
    }[];
    firstName?: string;
    lastName?: string;
    userPhoto?: string;
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
  nextQuestionNotification?: string;
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
    attemptTime: 0,
    timeRemained: 0,
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
    bonusTime: -1,
    answerIsCorrect: null,
    artistAnswerArr: [
      {
        text: "",
        _id: "",
      },
    ],
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

    setAttemptCurrentQuestion(state, action) {
      state.currentGTSAttemptData.currentQuestion = action.payload;
    },
    setAttemptQuestionStatus(state, action) {
      state.currentGTSAttemptData.questionsStatus = action.payload;
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
      state.currentGTSAttemptData.timeRemained = action.payload;
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
    setBonusTime(state, action) {
      state.currentGTSAttemptData.bonusTime = action.payload;
    },
    setAnswerIsCorrect(state, action) {
      state.currentGTSAttemptData.answerIsCorrect = action.payload;
    },
    setCurrentUserCompletedGTSAttempt(state, action) {
      state.currentUserCompletedGTSAttempt = action.payload;
    },
    setNextQuestionNotification(state, action) {
      state.nextQuestionNotification = action.payload;
    },
    setImageURL(state, action) {
      state.currentGTSAttemptData.imageURL = action.payload;
    },
    setArtistAnswerArr(state, action) {
      state.currentGTSAttemptData.artistAnswerArr = action.payload;
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
