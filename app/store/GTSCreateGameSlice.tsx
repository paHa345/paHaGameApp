import { createSlice } from "@reduxjs/toolkit";

export interface IGTSCreateGameSlice {
  GTSCreateGameState: {
    createdGgameValue: number;
    createdGameName: string;
    gameIsBeingCreated: boolean;
    currentAddedSong?: number;
    currentQuestion?: {
      answersArr?: [{ text: string }];
      correctAnswerIndex?: number;
    };
  };
}

interface IGTSCreateGameState {
  createdGgameValue: number;
  createdGameName: string;
  gameIsBeingCreated: boolean;
  currentAddedSong?: number;
  currentQuestion?: {
    answersArr?: [{ text: string }];
    correctAnswerIndex?: number;
  };
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
    setEmptyCurrentQuestion(state) {
      state.currentQuestion = {};
    },
    setAnswersArr(state, action) {
      if (state.currentQuestion) {
        state.currentQuestion.answersArr = action.payload;
      } else {
        state.currentQuestion = {};
        state.currentQuestion.answersArr = action.payload;
      }
    },
    setCurrentQuestionAnswer(state, action) {
      if (state.currentQuestion?.answersArr) {
        state.currentQuestion.answersArr[action.payload.index].text = action.payload.text;
      }
    },
    setCorrectAnswerIndex(state, action) {
      if (state.currentQuestion) {
        state.currentQuestion.correctAnswerIndex = action.payload;
      }
    },
  },
  extraReducers(builder) {},
});

export const GTSCreateGameActions = GTSCreateGameSlice.actions;
