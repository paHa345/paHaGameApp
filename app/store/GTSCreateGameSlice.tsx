import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const uploadGTSGameAndUpdateStore = createAsyncThunk(
  "GTSCreateGameState/uploadGTSGameAndUpdateStore",
  async function (GTSCreatedGameObj: any, { rejectWithValue, dispatch }) {
    try {
      console.log(GTSCreatedGameObj);
      if (GTSCreatedGameObj.gameID) {
        GTSCreatedGameObj.currentGame.gameID = GTSCreatedGameObj.gameID;
      }
      const saveCurrentGTSGameReq = await fetch(`/api/guessThatSong/addGTSGame`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(GTSCreatedGameObj.currentGame),
      });

      const data = await saveCurrentGTSGameReq.json();

      // dispatch(crosswordActions.setCrosswordId(data.result._id));

      if (!saveCurrentGTSGameReq.ok) {
        throw new Error(data.message);
      }

      dispatch(GTSCreateGameActions.setUpdatedGameID(data.result._id));
    } catch (error: any) {
      console.log(error);
      dispatch(GTSCreateGameActions.setUploadCurrentGTSGameErrorMessage(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const downloadCurrentUserAllGTSGame = createAsyncThunk(
  "GTSCreateGameState/downloadCurrentUserAllGTSGame",
  async function (_, { rejectWithValue, dispatch }) {
    try {
      const currentUserGTSGameReq = await fetch(`/api/guessThatSong/getCurrentUserAllGames`);
      if (!currentUserGTSGameReq.ok) {
        throw new Error("Ошибка сервера");
      }
      const GTSGames = await currentUserGTSGameReq.json();
      dispatch(GTSCreateGameActions.setCurrentUserDownloadedAllGTSGame(GTSGames.result));
    } catch (error: any) {
      console.log(error);
      dispatch(GTSCreateGameActions.setdownloadCurrentUserAllGTSGameStatus(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const downloadCurrentUserGTSGameAndAddInState = createAsyncThunk(
  "GTSCreateGameState/downloadCurrentUserGTSGameAndAddInState",
  async function (GTSGameID, { rejectWithValue, dispatch }) {
    try {
      const currentUserGTSGameReq = await fetch(
        `/api/guessThatSong/getCurrentUserGTSGame/${GTSGameID}`
      );
      if (!currentUserGTSGameReq.ok) {
        throw new Error("Ошибка сервера");
      }
      const GTSGames = await currentUserGTSGameReq.json();
      // dispatch(GTSCreateGameActions.setCurrentUserDownloadedAllGTSGame(GTSGames.result));
    } catch (error: any) {
      console.log(error);
      dispatch(
        GTSCreateGameActions.downloadCurrentUserGTSGameAndAddInStateErrorMessage(error.message)
      );
      return rejectWithValue(error.message);
    }
  }
);

export enum GTSCreateGameFetchStatus {
  Ready = "ready",
  Loading = "loading",
  Resolve = "resolve",
  Error = "error",
}

export interface IGTSCreateGameSlice {
  GTSCreateGameState: {
    updatedGameID?: string;
    createdGgameValue: number;
    createdGameName: string;
    gameIsBeingCreated: boolean;
    gameIsBeingUpdated: boolean;
    updatedQuestionNumber?: number;
    deleteQuestionStatus: boolean;
    uploadCurrentGTSGameStatus: GTSCreateGameFetchStatus;
    uploadCurrentGTSGameErrorMessage: string;
    createdGameIsCompleted: boolean;
    showDownloadModalStatus: boolean;
    currentUserDownloadedAllGTSGame?: {
      _id: string;
      name: string;
      userID: string;
      changeDate: Date;
      isCompleted: boolean;
    }[];

    downloadCurrentUserAllGTSGameStatus: GTSCreateGameFetchStatus;
    downloadCurrentUserAllGTSGameErrorMessage: string;
    downloadCurrentUserGTSGameAndAddInStateStatus: GTSCreateGameFetchStatus;
    downloadCurrentUserGTSGameAndAddInStateErrorMessage: string;
    currentAddedSong?: number;
    currentQuestion?: {
      answersArr?: { text: string }[];
      correctAnswerIndex?: number;
      songURL?: string;
    };
    createdGTSGame: {
      answersArr: { text: string }[];
      correctAnswerIndex: number;
      songURL: string;
    }[];
  };
}

interface IGTSCreateGameState {
  createdGgameValue: number;
  createdGameName: string;
  updatedGameID?: string;

  gameIsBeingCreated: boolean;
  gameIsBeingUpdated: boolean;
  updatedQuestionNumber?: number;
  deleteQuestionStatus: boolean;
  uploadCurrentGTSGameStatus: GTSCreateGameFetchStatus;
  uploadCurrentGTSGameErrorMessage: string;
  createdGameIsCompleted: boolean;
  showDownloadModalStatus: boolean;

  currentUserDownloadedAllGTSGame?: {
    _id: string;
    name: string;
    userID: string;
    changeDate: Date;
    isCompleted: boolean;
  }[];

  downloadCurrentUserAllGTSGameStatus: GTSCreateGameFetchStatus;
  downloadCurrentUserAllGTSGameErrorMessage: string;
  downloadCurrentUserGTSGameAndAddInStateStatus: GTSCreateGameFetchStatus;
  downloadCurrentUserGTSGameAndAddInStateErrorMessage: string;

  currentAddedSong?: number;
  currentQuestion?: {
    answersArr?: { text: string }[];
    correctAnswerIndex?: number;
    songURL?: string;
  };
  createdGTSGame: {
    answersArr: { text: string }[];
    correctAnswerIndex: number;
    songURL: string;
  }[];
}

export const initGuessThatSongState: IGTSCreateGameState = {
  createdGgameValue: 0,
  createdGameName: "",
  gameIsBeingCreated: false,
  gameIsBeingUpdated: false,
  deleteQuestionStatus: false,
  showDownloadModalStatus: false,

  uploadCurrentGTSGameStatus: GTSCreateGameFetchStatus.Ready,
  uploadCurrentGTSGameErrorMessage: "",
  createdGameIsCompleted: false,

  downloadCurrentUserAllGTSGameStatus: GTSCreateGameFetchStatus.Ready,
  downloadCurrentUserAllGTSGameErrorMessage: "",

  downloadCurrentUserGTSGameAndAddInStateStatus: GTSCreateGameFetchStatus.Ready,
  downloadCurrentUserGTSGameAndAddInStateErrorMessage: "",

  // currentQuestion: {
  //   answersArr: [{ text: "" }],
  //   correctAnswerIndex: -1,
  // },
  createdGTSGame: [
    // {
    //   answersArr: [{ text: "string" }],
    //   correctAnswerIndex: 0,
    //   songURL: "string",
    // },
  ],
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
    setEmptyCurrentQuestion(state) {
      state.currentQuestion = {};
    },
    setAnswersArr(state, action) {
      if (state.currentQuestion?.answersArr) {
        const addOrDeleteNumberAnswers = (number: number) => {
          if (number > 0 && state.currentQuestion?.answersArr) {
            for (let i = 0; i < number; i++) {
              state.currentQuestion?.answersArr.push({ text: "" });
            }
          }
          if (number < 0 && state.currentQuestion?.answersArr) {
            for (let i = 0; i > number; i--) {
              state.currentQuestion?.answersArr.pop();
            }
          }
        };
        const different = action.payload - state.currentQuestion?.answersArr.length;
        addOrDeleteNumberAnswers(different);
        return;
      }
      const answersArr = [...Array(action.payload)];
      const answersArrFill = answersArr.map(() => {
        return { text: "" };
      });
      if (state.currentQuestion) {
        state.currentQuestion.answersArr = answersArrFill;
      } else {
        state.currentQuestion = {};
        state.currentQuestion.answersArr = answersArrFill;
      }
    },
    setCurrentQuestionAnswer(state, action) {
      const data = { text: action.payload.text };
      if (
        state.currentQuestion?.answersArr &&
        state.currentQuestion?.answersArr[action.payload.index]
      ) {
        state.currentQuestion.answersArr[action.payload.index].text = action.payload.text;
      }

      if (
        state.currentQuestion?.answersArr &&
        state.currentQuestion?.answersArr[action.payload.index] === undefined
      ) {
        state.currentQuestion.answersArr[action.payload.index] = data;
      }
    },
    setCorrectAnswerIndex(state, action) {
      if (state.currentQuestion) {
        state.currentQuestion.correctAnswerIndex = action.payload;
      }
    },
    setSongURL(state, action) {
      if (state.currentQuestion) {
        state.currentQuestion.songURL = action.payload;
      }
    },
    initCreatedGTSGame(state) {
      state.createdGTSGame = [];
    },
    addQuestionInGame(state, action) {
      state.createdGTSGame?.push(action.payload);
    },
    resetCurrentQuestionData(state) {
      state.currentQuestion = {};
      state.currentQuestion.answersArr = [];
    },
    setGameIsBeingUpdated(state, action) {
      state.gameIsBeingUpdated = action.payload;
    },
    setUpdatedQuestionNumber(state, action) {
      state.updatedQuestionNumber = action.payload;
    },
    updateAnswerText(
      state,
      action: {
        payload: {
          updatedAnswer: number;
          index: number;
          text: string;
        };
        type: string;
      }
    ) {
      if (
        state.createdGTSGame !== undefined &&
        state.createdGTSGame[action.payload.updatedAnswer] !== undefined &&
        action.payload.updatedAnswer !== undefined &&
        action.payload.updatedAnswer <= state.createdGTSGame.length &&
        state.createdGTSGame[action.payload.updatedAnswer].answersArr !== undefined &&
        state.createdGTSGame[action.payload.updatedAnswer].answersArr[action.payload.index] !==
          undefined
      ) {
        state.createdGTSGame[action.payload.updatedAnswer].answersArr[action.payload.index].text =
          action.payload.text;
      }
    },
    updateCorrectAnswerNumber(state, action) {
      state.createdGTSGame[action.payload.updatedAnswer].correctAnswerIndex =
        action.payload.correctAnswerIndex;
    },
    updateAnswersArr(
      state,
      action: {
        payload: {
          updatedQuestion: number;
          setAnswerNumber: number;
        };
        type: string;
      }
    ) {
      const addOrDeleteNumberAnswers = (number: number) => {
        if (number > 0 && state.createdGTSGame[action.payload.updatedQuestion].answersArr) {
          for (let i = 0; i < number; i++) {
            state.createdGTSGame[action.payload.updatedQuestion].answersArr.push({ text: "" });
          }
        }
        if (number < 0 && state.createdGTSGame[action.payload.updatedQuestion].answersArr) {
          for (let i = 0; i > number; i--) {
            state.createdGTSGame[action.payload.updatedQuestion].answersArr.pop();
          }
        }
      };
      const different =
        action.payload.setAnswerNumber -
        state.createdGTSGame[action.payload.updatedQuestion].answersArr.length;
      addOrDeleteNumberAnswers(different);
    },
    updateQuestionSongURL(state, action) {
      state.createdGTSGame[action.payload.updatedQuestion].songURL = action.payload.songURL;
    },
    setDeleteQuestionStatus(state, action) {
      state.deleteQuestionStatus = action.payload;
    },
    deleteQuestion(state, action) {
      state.createdGTSGame.splice(action.payload, 1);
    },
    setUploadCurrentGTSGameStatus(state, action) {
      state.uploadCurrentGTSGameStatus = action.payload;
    },
    setUploadCurrentGTSGameErrorMessage(state, action) {
      state.uploadCurrentGTSGameErrorMessage = action.payload;
    },
    setCreatedGameIsCompletedStatus(state, action) {
      state.createdGameIsCompleted = action.payload;
    },
    setUpdatedGameID(state, action) {
      state.updatedGameID = action.payload;
    },
    setDownloadModalStatus(state, action) {
      state.showDownloadModalStatus = action.payload;
    },
    setCurrentUserDownloadedAllGTSGame(state, action) {
      state.currentUserDownloadedAllGTSGame = action.payload;
    },
    setdownloadCurrentUserAllGTSGameStatus(state, action) {
      state.downloadCurrentUserAllGTSGameStatus = action.payload;
    },
    downloadCurrentUserAllGTSGameErrorMessage(state, action) {
      state.downloadCurrentUserAllGTSGameErrorMessage = action.payload;
    },
    setDownloadCurrentUserGTSGameAndAddInStateStatus(state, action) {
      state.downloadCurrentUserGTSGameAndAddInStateStatus = action.payload;
    },
    downloadCurrentUserGTSGameAndAddInStateErrorMessage(state, action) {
      state.downloadCurrentUserGTSGameAndAddInStateErrorMessage = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(uploadGTSGameAndUpdateStore.pending, (state) => {
      state.uploadCurrentGTSGameStatus = GTSCreateGameFetchStatus.Loading;
    });
    builder.addCase(downloadCurrentUserAllGTSGame.pending, (state) => {
      state.downloadCurrentUserAllGTSGameStatus = GTSCreateGameFetchStatus.Loading;
    });
    builder.addCase(downloadCurrentUserGTSGameAndAddInState.pending, (state) => {
      state.downloadCurrentUserGTSGameAndAddInStateStatus = GTSCreateGameFetchStatus.Loading;
    });
    builder.addCase(uploadGTSGameAndUpdateStore.fulfilled, (state) => {
      state.uploadCurrentGTSGameStatus = GTSCreateGameFetchStatus.Resolve;
    });
    builder.addCase(downloadCurrentUserAllGTSGame.fulfilled, (state) => {
      state.downloadCurrentUserAllGTSGameStatus = GTSCreateGameFetchStatus.Resolve;
    });
    builder.addCase(downloadCurrentUserGTSGameAndAddInState.fulfilled, (state) => {
      state.downloadCurrentUserGTSGameAndAddInStateStatus = GTSCreateGameFetchStatus.Resolve;
    });
    builder.addCase(uploadGTSGameAndUpdateStore.rejected, (state, action) => {
      state.uploadCurrentGTSGameStatus = GTSCreateGameFetchStatus.Error;
    });
    builder.addCase(downloadCurrentUserAllGTSGame.rejected, (state, action) => {
      state.downloadCurrentUserAllGTSGameStatus = GTSCreateGameFetchStatus.Error;
    });
    builder.addCase(downloadCurrentUserGTSGameAndAddInState.rejected, (state, action) => {
      state.downloadCurrentUserGTSGameAndAddInStateStatus = GTSCreateGameFetchStatus.Error;
    });
  },
});

export const GTSCreateGameActions = GTSCreateGameSlice.actions;
