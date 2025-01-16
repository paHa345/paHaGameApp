import { createSlice } from "@reduxjs/toolkit";

export interface IGTSCreateGameSlice {
  GTSCreateGameState: {
    createdGgameValue: number;
    createdGameName: string;
    gameIsBeingCreated: boolean;
    gameIsBeingUpdated: boolean;
    updatedQuestionNumber?: number;

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
  gameIsBeingCreated: boolean;
  gameIsBeingUpdated: boolean;
  updatedQuestionNumber?: number;

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
      console.log(action.payload);
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
      console.log(action);
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
  },
  extraReducers(builder) {},
});

export const GTSCreateGameActions = GTSCreateGameSlice.actions;
