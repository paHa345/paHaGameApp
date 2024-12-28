import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AddedWordDirection } from "./crosswordSlice";
import { redirect } from "next/navigation";
import { ICrossword, ICrosswordSchema } from "../types";

export const getAvailableCrosswords = createAsyncThunk(
  "crosswordGameState/getAvailableCrosswords",
  async function (getCrosswordsData: { page?: number }, { rejectWithValue, dispatch }) {
    try {
      dispatch(crossworGamedActions.setShowHideCrosswordsList(false));

      const getCurrentUserCrosswordsReq = await fetch(
        `/api/crosswordGame/getAllCrosswords?page=${getCrosswordsData?.page ? getCrosswordsData?.page : 1}`
      );
      const crosswords = await getCurrentUserCrosswordsReq.json();
      if (!getCurrentUserCrosswordsReq.ok) {
        throw new Error(crosswords.message);
      }

      console.log(crosswords.result.isLastPage);
      dispatch(crossworGamedActions.setAvailableCrosswordGamesArr(crosswords.result.crosswords));
      dispatch(crossworGamedActions.setCrosswordsListCurrentPage(getCrosswordsData.page));
      dispatch(crossworGamedActions.setIsLastCrosswordsListPage(crosswords.result.isLastPage));
      dispatch(crossworGamedActions.setShowHideCrosswordsList(true));
    } catch (error: any) {
      dispatch(crossworGamedActions.setShowHideCrosswordsList(true));

      return rejectWithValue(error.message);
    }
  }
);

export const getUserCurrentAttempt = createAsyncThunk(
  "crosswordGameState/getUserCurrentAttempt",
  async function (
    attemptData: {
      telegramUserID: number | undefined;
      attemptID: String | undefined;
    },
    { rejectWithValue, dispatch }
  ) {
    try {
      const getUserCurrentAttemptReq = await fetch(
        `/api/attempts/getUserCurrentAttempt/${attemptData.attemptID}/${attemptData.telegramUserID}`
      );
      const attempt = await getUserCurrentAttemptReq.json();
      if (!getUserCurrentAttemptReq.ok) {
        localStorage.removeItem("currentCrosswordGame");
        localStorage.removeItem("currentAttemptID");
        throw new Error(attempt.message);
      }
      // dispatch(crossworGamedActions.setAvailableCrosswordGamesArr(crosswords.result));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const setAvailableCrosswordGame = createAsyncThunk(
  "crosswordGameState/setAvailableCrosswordGame",
  async function (
    crosswordUserData: {
      telegramUserID: number | undefined;
      crosswordID: String;
    },
    { rejectWithValue, dispatch }
  ) {
    try {
      const crosswordGameReq = await fetch(
        `/api/crosswordGame/${crosswordUserData.crosswordID}/${crosswordUserData.telegramUserID}`
      );
      const crosswordGame = await crosswordGameReq.json();
      if (!crosswordGameReq.ok) {
        console.log(crosswordGameReq);
        throw new Error(crosswordGame.message);
      }
      console.log(crosswordGame.message);
      dispatch(crossworGamedActions.setCrosswordGame(crosswordGame.result));
      // console.log(crosswordGame.result.crosswordObj.length);
      dispatch(crossworGamedActions.setCrosswordSize(crosswordGame.result.crosswordObj.length));

      setTimeout(() => {
        redirect("/crosswordGame/game");
      }, 2000);
    } catch (error: any) {
      dispatch(crossworGamedActions.setAvailableCrosswordGameErrorMessage(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const setHighlightedElementAndDirection = createAsyncThunk(
  "crosswordGameState/setHighlightedElementAndDirection",
  async function (
    data: {
      selectedCell: {
        row: number;
        col: number;
      };
      highlightedCell: {
        row: number;
        col: number;
      };
      direction: AddedWordDirection;
    },
    { rejectWithValue, dispatch }
  ) {
    if (data.selectedCell !== null) {
      await dispatch(crossworGamedActions.setShowCrosswordGameCellMenu(false));

      await dispatch(crossworGamedActions.setSelectedAndHighLightedCell(data.selectedCell));

      // console.log(data.highlightedCell);
      await dispatch(crossworGamedActions.setHighlightedCell(data.highlightedCell));

      //direction
      await dispatch(crossworGamedActions.changeDirection(data.direction));

      // if (data.highlightedCell.questionObj.horizontal?.value) {
      //   await dispatch(crossworGamedActions.changeDirection(AddedWordDirection.Horizontal));
      // } else {
      //   await dispatch(crossworGamedActions.changeDirection(AddedWordDirection.Vertical));
      // }
      //direction

      await dispatch(crossworGamedActions.setShowCrosswordGameCellMenu(true));

      //обновляем value у конкретного поля и highlighted, это будет сумма всех букв

      // const hihlightedDirection = data.highlightedCell.questionObj?.horizontal
      //   ? AddedWordDirection.Horizontal
      //   : AddedWordDirection.Vertical;

      dispatch(crossworGamedActions.setHighlightedWordObj());
      dispatch(crossworGamedActions.updateCellAndHaghlightedValue());
    } else {
      await dispatch(crossworGamedActions.setHighlightedCell(data.highlightedCell));
    }
  }
);

export const createStartAttempt = createAsyncThunk(
  "crosswordGameState/createStartAttempt",
  async function (
    attemptData: {
      telegramUserName?: string;
      telegramID: number | undefined;
      isCompleted: boolean;
      crosswordID: string;
      completedCorrectly?: boolean;
    },
    { rejectWithValue, dispatch }
  ) {
    try {
      const startAttemptReq = await fetch(`/api/crosswordGame/createAttempt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attemptData),
      });
      const startAttempt = await startAttemptReq.json();
      if (!startAttemptReq.ok) {
        throw new Error(startAttempt.message);
      }

      // dispatch(crossworGamedActions.setAvailableCrosswordGame(data.result));
      if (startAttempt.result.length === 1) {
        dispatch(crossworGamedActions.setAttemptID(startAttempt.result[0]._id));
        window.localStorage.setItem("currentAttemptID", JSON.stringify(startAttempt.result[0]._id));
      } else {
        dispatch(crossworGamedActions.setAttemptID(startAttempt.result._id));
        window.localStorage.setItem("currentAttemptID", JSON.stringify(startAttempt.result._id));
      }

      // if (startAttempt.result.isArray) {
      //   window.localStorage.setItem("currentAttemptID", JSON.stringify(startAttempt.result[0]._id));
      // } else {
      //   window.localStorage.setItem("currentAttemptID", JSON.stringify(startAttempt.result._id));
      // }

      dispatch(crossworGamedActions.setStartGameStatus(true));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const finishAttempt = createAsyncThunk(
  "crosswordGameState/finishAttempt",
  async function (attemptData: any, { rejectWithValue, dispatch }) {
    try {
      console.log(attemptData.crossword);

      const currentCrossword: {
        key: string;
        value: string;
        number: number;
        row: number;
        paragraph: number;
        paragraphNum?: number;
        inputStatus: number;
        inputValue: number;
        textQuestionStatus: number;
        questionObj: {
          horizontal: {
            value: string;
            questionNumber: number;
            cell: { row: number; col: number };
          } | null;
          vertical: {
            value: string;
            questionNumber: number;
            cell: { row: number; col: number };
          } | null;
        };
        addedWordCell: number;
        addedWordLetter?: string | null;
        addedWordDirectionJbj: {
          horizontal: Boolean;
          vertical: Boolean;
        };
        addedWordArr: {
          direction: AddedWordDirection;
          value?: string;
          addedWordArr: { row: number; col: number; addedLetter?: string }[];
        }[];
      }[][] = attemptData.crossword;

      const answersArr: {
        row: number;
        col: number;
        addedWordArr: {
          direction: AddedWordDirection;
          value: string;
          question: string | undefined;
        }[];
      }[] = [];

      currentCrossword.forEach((line, x: number) => {
        line.forEach((cell) => {
          if (cell.addedWordArr.length > 0) {
            const addedWord: {
              direction: AddedWordDirection;
              value: string;
              question: string | undefined;
            }[] = [];
            cell.addedWordArr.forEach((addedWordObj) => {
              const word: any[] = [];
              addedWordObj.addedWordArr.forEach((addedWordCellCoord) => {
                if (
                  currentCrossword[addedWordCellCoord.row][addedWordCellCoord.col]
                    .addedWordLetter !== null &&
                  currentCrossword[addedWordCellCoord.row][addedWordCellCoord.col]
                    .addedWordLetter !== undefined
                ) {
                  word.push(
                    currentCrossword[addedWordCellCoord.row][addedWordCellCoord.col].addedWordLetter
                  );
                }
              });

              addedWord.push({
                question:
                  addedWordObj.direction === AddedWordDirection.Horizontal
                    ? cell.questionObj.horizontal?.value
                    : cell.questionObj.vertical?.value,
                direction: addedWordObj.direction,
                value: word.join(""),
              });
            });

            answersArr.push({
              row: x,
              col: cell.number,
              addedWordArr: addedWord,
            });
          }
        });
      });

      const finishAttemptReq = await fetch(`/api/crosswordGame/finishAttempt`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attemptID: attemptData.attemptID,
          crosswordID: attemptData.crosswordID,
          telegramID: attemptData.telegramID,
          telegramUser: attemptData.telegramUser,
          answersArr: answersArr,
          userPhoto: attemptData.userPhoto,
          firstName: attemptData?.firstName,
          lastName: attemptData?.lastName,
        }),
      });
      const finishAttempt = await finishAttemptReq.json();
      if (!finishAttemptReq.ok) {
        throw new Error(finishAttempt.message);
      }

      window.localStorage.removeItem("currentCrosswordGame");
      window.localStorage.removeItem("currentAttemptID");

      // нужно включить потом, очистка данных после завершения попытки
      // добавляем данные о только что законченной попытке
      dispatch(crossworGamedActions.setCurrentUserCompletedAttempt(finishAttempt.result));
      dispatch(crossworGamedActions.clearAttemptData());
      // dispatch(crossworGamedActions.setShowEndGameModal(false));
      // dispatch(crossworGamedActions.setEndAttempt(true));

      // setTimeout(() => {
      //   redirect("/results");
      // }, 2000);
    } catch (error: any) {
      // dispatch(crossworGamedActions.setShowEndGameModal(false));

      return rejectWithValue(error.message);
    }
  }
);

export enum crosswordGameFetchStatus {
  Ready = "ready",
  Loading = "loading",
  Resolve = "resolve",
  Error = "error",
}

export interface ICrosswordGameSlice {
  crosswordGameState: {
    browserType: string;
    crosswordSize: number;
    phoneLetters: string;
    showEndGameModal: boolean;
    endAttempt: boolean;
    showHideCurrentUserAttemptAnswers: boolean;

    crosswordsListCurrentPage: number;
    isLastCrosswordsListPage: boolean;
    showHideCrosswordsList: boolean;
    crosswordsListTransitionClasses: string;

    startGameStatus: boolean;
    currentWord: string;
    index: number;
    baseInput: string;
    showChooseCrosswordModal: boolean;
    fetchCrosswordsArrStatus: crosswordGameFetchStatus;
    attemptID?: string;
    availableCrosswordGamesArr: {
      _id: string;
      name: string;
      iserId: string;
      changeDate: Date;
    }[];
    addedWordDirection: AddedWordDirection;
    showCrosswordGameCellMenu: boolean;

    fetchAvailableCrosswordGamesStatus: crosswordGameFetchStatus;
    createStartAttemptStatus: crosswordGameFetchStatus;
    finishAttemptStatus: crosswordGameFetchStatus;

    highlightedWordObj: {
      startRow: number;
      endRow: number;
      startCol: number;
      endCol: number;
    } | null;
    highlightedCell: {
      key: string;
      value: string;
      number: number;
      row: number;
      paragraph: number;
      paragraphNum?: number;
      inputStatus: number;
      inputValue: number;
      textQuestionStatus: number;
      questionObj: {
        horizontal: {
          value: string;
          questionNumber: number;
          cell: { row: number; col: number };
        } | null;
        vertical: {
          value: string;
          questionNumber: number;
          cell: { row: number; col: number };
        } | null;
      };
      addedWordCell: number;
      addedWordDirectionJbj?: {
        horizontal: Boolean;
        vertical: Boolean;
      };
      baseCell: {
        horizontal?: { row: number; col: number } | null;
        vertical?: { row: number; col: number } | null;
      };
      addedWordArr: {
        direction: AddedWordDirection;
        value?: string;
        addedWordArr: {
          row: number;
          col: number;
          addedLetter?: string;
        }[];
      }[];
    } | null;

    selectedCell?: {
      key: string;
      value: string;
      number: number;
      row: number;
      paragraph: number;
      paragraphNum?: number;
      inputStatus: number;
      inputValue: number;
      textQuestionStatus: number;
      questionObj: {
        horizontal: {
          value: string;
          questionNumber: number;
          cell: { row: number; col: number };
        } | null;
        vertical: {
          value: string;
          questionNumber: number;
          cell: { row: number; col: number };
        } | null;
      };
      addedWordCell: number;
      addedWordDirectionJbj?: {
        horizontal: Boolean;
        vertical: Boolean;
      };
      baseCell: {
        horizontal?: { row: number; col: number } | null;
        vertical?: { row: number; col: number } | null;
      };
      addedWordArr: {
        direction: AddedWordDirection;
        value?: string;
        addedWordArr: {
          row: number;
          col: number;
          addedLetter?: string;
        }[];
      }[];
    };

    crosswordGame: {
      _id: string;
      crosswordLength: number;
      name: string;
      userId: string;
      isCompleted: boolean;
      questionsArr: {
        direction: AddedWordDirection;
        value: string;
        questionNumber: number;
        cell: { row: number; col: number };
      }[];
      crosswordObj: {
        key: string;
        value: string;
        number: number;
        row: number;
        paragraph: number;
        paragraphNum?: number;
        inputStatus: number;
        inputValue: number;
        textQuestionStatus: number;
        addedWordLetter?: string | null;
        questionObj: {
          horizontal: {
            value: string;
            questionNumber: number;
            cell: { row: number; col: number };
          } | null;
          vertical: {
            value: string;
            questionNumber: number;
            cell: { row: number; col: number };
          } | null;
        };
        addedWordCell: number;
        // addedWordLetter: string | null;
        addedWordDirectionJbj?: {
          horizontal: Boolean;
          vertical: Boolean;
        };
        baseCell: {
          horizontal?: { row: number; col: number } | null;
          vertical?: { row: number; col: number } | null;
        };
        addedWordArr: {
          direction: AddedWordDirection;
          value?: string;
          addedWordArr: {
            row: number;
            col: number;
            addedLetter?: string;
          }[];
        }[];
      }[][];
    };
    addedWord: {
      direction: AddedWordDirection;
      value: string;
      addedWordArr: { row: number; col: number; addedLetter: string }[];
    };
    currentUserCompletedAttempt?: {
      telegramUserName?: string;
      telegramID: number;
      startDate: Date;
      isCompleted: boolean;
      crosswordID: string;
      completedCorrectly?: boolean;
      finishDate?: Date;
      duration?: string;
      crosswordName?: string;
      userPhoto?: string;
      durationNumberMs?: number;
      firstName?: string;
      lastName?: string;
      userAnswers?: {
        row: number;
        col: number;
        addedWordArr: {
          direction: AddedWordDirection;
          value: string;
          isCorrect?: boolean;
          question: string | undefined;

          _id: string;
        }[];
      }[];
    };
    availableCrosswordGameErrorMessage?: string;
  };
}

interface ICrosswordGameState {
  browserType: string;

  crosswordSize: number;
  phoneLetters: string;
  showEndGameModal: boolean;
  endAttempt: boolean;
  showHideCurrentUserAttemptAnswers: boolean;

  crosswordsListCurrentPage: number;
  isLastCrosswordsListPage: boolean;
  showHideCrosswordsList: boolean;
  crosswordsListTransitionClasses: string;

  currentWord: string;
  startGameStatus: boolean;
  attemptID?: string;

  index: number;

  baseInput: string;
  showChooseCrosswordModal: boolean;
  fetchCrosswordsArrStatus: crosswordGameFetchStatus;
  addedWordDirection: AddedWordDirection;
  showCrosswordGameCellMenu: boolean;

  availableCrosswordGamesArr: {
    _id: string;
    name: string;
    iserId: string;
    changeDate: Date;
  }[];
  fetchAvailableCrosswordGamesStatus: crosswordGameFetchStatus;
  createStartAttemptStatus: crosswordGameFetchStatus;
  finishAttemptStatus: crosswordGameFetchStatus;

  highlightedWordObj: {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
  } | null;

  highlightedCell: {
    key: string;
    value: string;
    number: number;
    row: number;
    paragraph: number;
    paragraphNum?: number;
    inputStatus: number;
    inputValue: number;
    textQuestionStatus: number;
    questionObj: {
      horizontal: {
        value: string;
        questionNumber: number;
        cell: { row: number; col: number };
      } | null;
      vertical: {
        value: string;
        questionNumber: number;
        cell: { row: number; col: number };
      } | null;
    };
    addedWordCell: number;
    addedWordDirectionJbj?: {
      horizontal: Boolean;
      vertical: Boolean;
    };
    baseCell: {
      horizontal?: { row: number; col: number } | null;
      vertical?: { row: number; col: number } | null;
    };
    addedWordArr: {
      direction: AddedWordDirection;
      value?: string;

      addedWordArr: {
        row: number;
        col: number;
        addedLetter?: string;
      }[];
    }[];
  } | null;

  selectedCell?: {
    key: string;
    value: string;
    number: number;
    row: number;
    paragraph: number;
    paragraphNum?: number;
    inputStatus: number;
    inputValue: number;
    textQuestionStatus: number;
    questionObj: {
      horizontal: {
        value: string;
        questionNumber: number;
        cell: { row: number; col: number };
      } | null;
      vertical: {
        value: string;
        questionNumber: number;
        cell: { row: number; col: number };
      } | null;
    };
    addedWordCell: number;
    addedWordDirectionJbj?: {
      horizontal: Boolean;
      vertical: Boolean;
    };
    baseCell: {
      horizontal?: { row: number; col: number } | null;
      vertical?: { row: number; col: number } | null;
    };
    addedWordArr: {
      direction: AddedWordDirection;
      value?: string;
      addedWordArr: {
        row: number;
        col: number;
        addedLetter?: string;
      }[];
    }[];
  };

  crosswordGame: {
    _id: string;
    name: string;
    userId: string;
    isCompleted: boolean;
    crosswordLength: number;

    questionsArr: {
      direction: AddedWordDirection;
      value: string;
      questionNumber: number;
      cell: { row: number; col: number };
    }[];
    crosswordObj: {
      key: string;
      value: string;
      number: number;
      row: number;
      paragraph: number;
      paragraphNum?: number;
      inputStatus: number;
      inputValue: number;
      textQuestionStatus: number;
      addedWordLetter?: string | null;
      questionObj: {
        horizontal: {
          value: string;
          questionNumber: number;
          cell: { row: number; col: number };
        } | null;
        vertical: {
          value: string;
          questionNumber: number;
          cell: { row: number; col: number };
        } | null;
      };
      addedWordCell: number;
      // addedWordLetter: string | null;
      addedWordDirectionJbj?: {
        horizontal: Boolean;
        vertical: Boolean;
      };
      baseCell: {
        horizontal?: { row: number; col: number } | null;
        vertical?: { row: number; col: number } | null;
      };
      addedWordArr: {
        direction: AddedWordDirection;
        value?: string;
        addedWordArr: {
          row: number;
          col: number;
          addedLetter?: string;
        }[];
      }[];
    }[][];
  };
  addedWord: {
    direction: AddedWordDirection;
    value: string;
    addedWordArr: { row: number; col: number; addedLetter: string }[];
  };
  currentUserCompletedAttempt?: {
    telegramUserName?: string;
    telegramID: number;
    startDate: Date;
    isCompleted: boolean;
    crosswordID: string;
    completedCorrectly?: boolean;
    finishDate?: Date;
    duration?: string;
    crosswordName?: string;
    userPhoto?: string;
    durationNumberMs?: number;
    firstName?: string;
    lastName?: string;
    userAnswers?: {
      row: number;
      col: number;
      addedWordArr: {
        direction: AddedWordDirection;
        value: string;
        isCorrect?: boolean;
        question: string | undefined;

        _id: string;
      }[];
    }[];
  };
  availableCrosswordGameErrorMessage?: string;
}

export const initCrosswordGameState: ICrosswordGameState = {
  browserType: "",

  crosswordSize: 10,
  phoneLetters: "",
  showEndGameModal: false,
  endAttempt: false,
  showHideCurrentUserAttemptAnswers: false,

  crosswordsListCurrentPage: 1,
  isLastCrosswordsListPage: false,
  showHideCrosswordsList: true,
  crosswordsListTransitionClasses: "games-list-left",

  index: 0,
  currentWord: "",
  startGameStatus: false,

  baseInput: "",
  showChooseCrosswordModal: false,
  fetchCrosswordsArrStatus: crosswordGameFetchStatus.Ready,
  addedWordDirection: AddedWordDirection.Horizontal,
  showCrosswordGameCellMenu: false,

  availableCrosswordGamesArr: [],
  fetchAvailableCrosswordGamesStatus: crosswordGameFetchStatus.Ready,
  createStartAttemptStatus: crosswordGameFetchStatus.Ready,
  finishAttemptStatus: crosswordGameFetchStatus.Ready,

  highlightedWordObj: null,
  highlightedCell: null,
  crosswordGame: {
    crosswordLength: 10,
    _id: "",
    name: "",
    userId: "",
    isCompleted: false,
    questionsArr: [],
    crosswordObj: [],
  },
  addedWord: {
    direction: AddedWordDirection.Horizontal,
    value: "",
    addedWordArr: [],
  },
};

export const crosswordGameSlice = createSlice({
  name: "crosswordGameState",
  initialState: initCrosswordGameState,
  reducers: {
    setShowChooseCrosswordModal(state, action) {
      state.showChooseCrosswordModal = action.payload;
    },
    setCrosswordSize(state, action) {
      state.crosswordSize = action.payload;
    },
    setAvailableCrosswordGamesArr(state, action) {
      state.availableCrosswordGamesArr = action.payload;
    },
    setCrosswordGame(state, action) {
      state.crosswordGame._id = action.payload._id;
      state.crosswordGame.isCompleted = action.payload.isCompleted;
      state.crosswordGame.name = action.payload.name;
      state.crosswordGame.userId = action.payload.userId;
      state.crosswordGame.crosswordObj = action.payload.crosswordObj;
      state.crosswordGame.questionsArr = action.payload.questionsArr;
      state.crosswordGame.crosswordLength = action.payload.crosswordObj.length;

      window.localStorage.setItem("currentCrosswordGame", JSON.stringify(state.crosswordGame));
    },
    setFetchAvailableCrosswordGamesStatus(state, action) {
      state.fetchAvailableCrosswordGamesStatus = action.payload;
    },
    changeDirection(state, action) {
      state.addedWordDirection = action.payload;
    },
    changeAddedWordDirectionAndSetHighlightedCells(state, action) {
      state.addedWordDirection = action.payload;

      if (state.highlightedCell !== null) {
        const hihlightedDirection = state.addedWordDirection;

        console.log(state.selectedCell?.baseCell.horizontal);
        console.log(state.selectedCell?.baseCell.vertical);

        if (
          state.selectedCell?.baseCell.horizontal !== null &&
          hihlightedDirection === AddedWordDirection.Horizontal &&
          state.selectedCell?.baseCell.horizontal?.row
        ) {
          console.log(state.selectedCell?.baseCell.horizontal?.row);
          console.log(state.selectedCell?.baseCell.horizontal?.col);
          state.highlightedCell =
            state.crosswordGame.crosswordObj[state.selectedCell?.baseCell.horizontal?.row][
              state.selectedCell?.baseCell.horizontal?.col
            ];
        }

        if (
          state.selectedCell?.baseCell.vertical !== null &&
          hihlightedDirection === AddedWordDirection.Vertical &&
          state.selectedCell?.baseCell.vertical?.row
        ) {
          console.log(state.selectedCell?.baseCell.vertical?.row);
          console.log(state.selectedCell?.baseCell.vertical?.col);
          state.highlightedCell =
            state.crosswordGame.crosswordObj[state.selectedCell?.baseCell.vertical?.row][
              state.selectedCell?.baseCell.vertical?.col
            ];
        }

        const highlightedDirectionCells = state.highlightedCell.addedWordArr.filter(
          (el) => el.direction === hihlightedDirection
        );

        const highlightedWordObj = {
          startRow: highlightedDirectionCells[0].addedWordArr[0].row,
          endRow:
            highlightedDirectionCells[0].addedWordArr[
              highlightedDirectionCells[0].addedWordArr.length - 1
            ].row,
          startCol: highlightedDirectionCells[0].addedWordArr[0].col,
          endCol:
            highlightedDirectionCells[0].addedWordArr[
              highlightedDirectionCells[0].addedWordArr.length - 1
            ].col,
        };

        state.highlightedWordObj = highlightedWordObj;
      }
    },
    setShowCrosswordGameCellMenu(state, action) {
      state.showCrosswordGameCellMenu = action.payload;
    },
    setHighlightedCell(state, action) {
      state.highlightedCell =
        state.crosswordGame.crosswordObj[action.payload.row][action.payload.col];
    },
    setHighlightedWordObj(state) {
      const highlightedDirectionCells = state.highlightedCell?.addedWordArr.filter(
        (el: any) => el.direction === state.addedWordDirection
      );

      if (highlightedDirectionCells) {
        const highlightedWordObj = {
          startRow: highlightedDirectionCells[0].addedWordArr[0].row,
          endRow:
            highlightedDirectionCells[0].addedWordArr[
              highlightedDirectionCells[0].addedWordArr.length - 1
            ].row,
          startCol: highlightedDirectionCells[0].addedWordArr[0].col,
          endCol:
            highlightedDirectionCells[0].addedWordArr[
              highlightedDirectionCells[0].addedWordArr.length - 1
            ].col,
        };

        state.highlightedWordObj = highlightedWordObj;
      }
    },

    setCurrentWord(state, action) {
      state.currentWord = action.payload;
    },

    changeAddedWordValue(state, action) {
      const value = action.payload.split("");
      const currentDirectionWordObj = state.highlightedCell?.addedWordArr.find(
        (el) => el.direction === state.addedWordDirection
      )?.addedWordArr;

      //проверки

      if (!currentDirectionWordObj) {
        return;
      }
      if (value.length > currentDirectionWordObj?.length) {
        return;
      }

      //

      if (state.highlightedCell) {
        const index = state.highlightedCell?.addedWordArr.findIndex(
          (el) => el.direction === state.addedWordDirection
        );

        state.highlightedCell.addedWordArr[index].value = action.payload;

        const currentEl = {
          col: state.highlightedCell?.number,
          row: state.highlightedCell?.row,
        };

        //сначала очищаеи все клетки

        currentDirectionWordObj.map((el, index) => {
          if (
            state.addedWordDirection === AddedWordDirection.Horizontal &&
            state.crosswordGame.crosswordObj[el.row][el.col].addedWordDirectionJbj?.vertical ===
              true
          ) {
            state.crosswordGame.crosswordObj[el.row][el.col].addedWordDirectionJbj = {
              horizontal: false,
              vertical: true,
            };
          }

          if (
            state.addedWordDirection === AddedWordDirection.Horizontal &&
            state.crosswordGame.crosswordObj[el.row][el.col].addedWordDirectionJbj?.vertical ===
              false
          ) {
            state.crosswordGame.crosswordObj[el.row][el.col].addedWordDirectionJbj = {
              horizontal: false,
              vertical: false,
            };
          }

          if (
            state.addedWordDirection === AddedWordDirection.Vertical &&
            state.crosswordGame.crosswordObj[el.row][el.col].addedWordDirectionJbj?.horizontal ===
              true
          ) {
            state.crosswordGame.crosswordObj[el.row][el.col].addedWordDirectionJbj = {
              horizontal: true,
              vertical: false,
            };
          }

          if (
            state.addedWordDirection === AddedWordDirection.Vertical &&
            state.crosswordGame.crosswordObj[el.row][el.col].addedWordDirectionJbj?.horizontal ===
              false
          ) {
            state.crosswordGame.crosswordObj[el.row][el.col].addedWordDirectionJbj = {
              horizontal: false,
              vertical: false,
            };
          }

          if (
            state.crosswordGame.crosswordObj[el.row][el.col].addedWordDirectionJbj?.horizontal ===
              false &&
            state.crosswordGame.crosswordObj[el.row][el.col].addedWordDirectionJbj?.vertical ===
              false
          ) {
            state.crosswordGame.crosswordObj[el.row][el.col].addedWordLetter = "";
          }
        });

        //затем заполняем клетки

        value.map((letter: string, index: number) => {
          if (
            state.crosswordGame.crosswordObj[currentDirectionWordObj[index].row][
              currentDirectionWordObj[index].col
            ].addedWordDirectionJbj === undefined
          ) {
            state.crosswordGame.crosswordObj[currentDirectionWordObj[index].row][
              currentDirectionWordObj[index].col
            ].addedWordDirectionJbj = { horizontal: false, vertical: false };
          }
          if (
            state.addedWordDirection === AddedWordDirection.Horizontal &&
            state.crosswordGame.crosswordObj[currentDirectionWordObj[index].row][
              currentDirectionWordObj[index].col
            ].addedWordDirectionJbj?.vertical === false
          ) {
            state.crosswordGame.crosswordObj[currentDirectionWordObj[index].row][
              currentDirectionWordObj[index].col
            ].addedWordDirectionJbj = { horizontal: true, vertical: false };
          }

          if (
            state.addedWordDirection === AddedWordDirection.Horizontal &&
            state.crosswordGame.crosswordObj[currentDirectionWordObj[index].row][
              currentDirectionWordObj[index].col
            ].addedWordDirectionJbj?.vertical === true
          ) {
            state.crosswordGame.crosswordObj[currentDirectionWordObj[index].row][
              currentDirectionWordObj[index].col
            ].addedWordDirectionJbj = { horizontal: true, vertical: true };
          }

          if (
            state.addedWordDirection === AddedWordDirection.Vertical &&
            state.crosswordGame.crosswordObj[currentDirectionWordObj[index].row][
              currentDirectionWordObj[index].col
            ].addedWordDirectionJbj?.horizontal === false
          ) {
            state.crosswordGame.crosswordObj[currentDirectionWordObj[index].row][
              currentDirectionWordObj[index].col
            ].addedWordDirectionJbj = { horizontal: false, vertical: true };
          }

          if (
            state.addedWordDirection === AddedWordDirection.Vertical &&
            state.crosswordGame.crosswordObj[currentDirectionWordObj[index].row][
              currentDirectionWordObj[index].col
            ].addedWordDirectionJbj?.horizontal === true
          ) {
            state.crosswordGame.crosswordObj[currentDirectionWordObj[index].row][
              currentDirectionWordObj[index].col
            ].addedWordDirectionJbj = { horizontal: true, vertical: true };
          }

          state.crosswordGame.crosswordObj[currentDirectionWordObj[index].row][
            currentDirectionWordObj[index].col
          ].addedWordLetter = letter;
        });

        state.crosswordGame.crosswordObj[currentEl.row][currentEl.col].addedWordArr[index].value =
          action.payload;
      }
    },
    updateCellAndHaghlightedValue(state) {
      if (state.highlightedCell) {
        let currentValue: any[] = [];
        state.crosswordGame.crosswordObj[state.highlightedCell?.row][
          state.highlightedCell?.number
        ].addedWordArr
          .filter((el) => el.direction === state.addedWordDirection)[0]
          .addedWordArr.forEach((el) => {
            if (state.crosswordGame.crosswordObj[el.row][el.col]?.addedWordLetter === undefined) {
              currentValue.push(" ");
            }
            if (
              state.crosswordGame.crosswordObj[el.row][el.col]?.addedWordLetter !== undefined &&
              state.crosswordGame.crosswordObj[el.row][el.col]?.addedWordLetter !== null
            ) {
              currentValue.push(state.crosswordGame.crosswordObj[el.row][el.col]?.addedWordLetter);
            }
          });
        state.crosswordGame.crosswordObj[state.highlightedCell.row][
          state.highlightedCell.number
        ].addedWordArr.filter((el) => el.direction === state.addedWordDirection)[0].value =
          currentValue.join("");
        state.highlightedCell.addedWordArr.filter(
          (el) => el.direction === state.addedWordDirection
        )[0].value = currentValue.join("");
      }
    },
    changeInput(state, action) {
      let value = action.payload.value;
      if (action.payload.value.length === 0) {
        value = " ";
      }
      state.crosswordGame.crosswordObj[action.payload.cell.row][
        action.payload.cell.col
      ].addedWordLetter = value;
    },

    setStartGameStatus(state, action) {
      state.startGameStatus = action.payload;
    },
    setCreateStartAttemptStatusToReady(state) {
      state.createStartAttemptStatus = crosswordGameFetchStatus.Ready;
    },
    setAttemptID(state, action) {
      state.attemptID = action.payload;
      // window.localStorage.setItem("currentAttemptID", JSON.stringify("Attempt"));
    },
    setFinishAttemptStatusToReady(state) {
      state.finishAttemptStatus = crosswordGameFetchStatus.Ready;
    },
    clearAttemptData(state) {
      state.attemptID = undefined;
      state.startGameStatus = false;
      state.createStartAttemptStatus = crosswordGameFetchStatus.Ready;
      state.selectedCell = undefined;
      state.highlightedCell = null;
      state.highlightedWordObj = null;
      state.finishAttemptStatus = crosswordGameFetchStatus.Ready;
      state.showCrosswordGameCellMenu = false;
      state.showHideCurrentUserAttemptAnswers = false;
      state.showEndGameModal = false;
      state.endAttempt = false;
      state.startGameStatus = false;
    },
    setCurrentUserCompletedAttempt(state, action) {
      state.currentUserCompletedAttempt = action.payload;
    },
    clearCurrentUserCompletedAttempt(state) {
      state.currentUserCompletedAttempt = undefined;
    },
    setAvailableCrosswordGameErrorMessage(state, action) {
      state.availableCrosswordGameErrorMessage = action.payload;
    },
    setSelectedAndHighLightedCell(state, action) {
      state.selectedCell = state.crosswordGame.crosswordObj[action.payload.row][action.payload.col];
      // if (state.selectedCell?.baseCell?.horizontal) {
      //   state.highlightedCell =
      //     state.crosswordGame.crosswordObj[state.selectedCell?.baseCell.horizontal?.row][
      //       state.selectedCell?.baseCell.horizontal?.col
      //     ];
      //   console.log(state.highlightedCell.key);
      // } else {
      //   if (state.selectedCell?.baseCell?.vertical) {
      //     state.highlightedCell =
      //       state.crosswordGame.crosswordObj[state.selectedCell?.baseCell.vertical?.row][
      //         state.selectedCell?.baseCell.vertical?.col
      //       ];
      //   }
      // }
    },
    setPhoneLetter(state, action) {
      state.phoneLetters = action.payload;
    },
    setSelectedElLetter(state, action) {
      const isBack = action.payload === "Backspace";
      state.phoneLetters = action.payload;
      if (
        state.selectedCell?.number &&
        state.selectedCell?.row &&
        state.highlightedWordObj?.endCol &&
        state.highlightedWordObj?.endRow
      ) {
        const cellLetterIsEmpty =
          state.crosswordGame.crosswordObj[state.selectedCell?.row][state.selectedCell?.number]
            .addedWordLetter;

        // если жмём на клавишу Backspace
        // удаляем символ из текущей клетки
        if (action.payload === "Backspace") {
          state.crosswordGame.crosswordObj[state.selectedCell?.row][
            state.selectedCell?.number
          ].addedWordLetter = null;
        } else {
          state.crosswordGame.crosswordObj[state.selectedCell?.row][
            state.selectedCell?.number
          ].addedWordLetter = action.payload.toLowerCase();
        }

        //set local storage attempt dat
        // with changed cell letter
        window.localStorage.setItem("currentCrosswordGame", JSON.stringify(state.crosswordGame));
        window.localStorage.setItem("currentAttemptID", JSON.stringify(state.attemptID));
        //

        if (state.addedWordDirection === AddedWordDirection.Horizontal) {
          if (state.selectedCell.number === state.highlightedWordObj?.startCol && isBack) {
            state.baseInput = "";
            return;
          }
          if (state.selectedCell.number >= state.highlightedWordObj?.endCol && !isBack) {
            state.baseInput = "";
            return;
          }
        } else {
          if (state.selectedCell.row === state.highlightedWordObj?.startRow && isBack) {
            state.baseInput = "";
            return;
          }
          if (state.selectedCell.row >= state.highlightedWordObj?.endRow && !isBack) {
            state.baseInput = "";
            return;
          }
        }

        if (!isBack) {
          console.log("Go to next cell");
          // const nextCell =
          //   state.addedWordDirection === AddedWordDirection.Horizontal
          //     ? (state.selectedCell =
          //         state.crosswordGame.crosswordObj[state.selectedCell?.row][
          //           state.selectedCell?.number + 1
          //         ])
          //     : (state.selectedCell =
          //         state.crosswordGame.crosswordObj[state.selectedCell?.row + 1][
          //           state.selectedCell?.number
          //         ]);

          // console.log(nextCell.key);
          state.addedWordDirection === AddedWordDirection.Horizontal
            ? (state.selectedCell =
                state.crosswordGame.crosswordObj[state.selectedCell?.row][
                  state.selectedCell?.number + 1
                ])
            : (state.selectedCell =
                state.crosswordGame.crosswordObj[state.selectedCell?.row + 1][
                  state.selectedCell?.number
                ]);
        }

        if (isBack && cellLetterIsEmpty === null) {
          state.addedWordDirection === AddedWordDirection.Horizontal
            ? (state.selectedCell =
                state.crosswordGame.crosswordObj[state.selectedCell?.row][
                  state.selectedCell?.number - 1
                ])
            : (state.selectedCell =
                state.crosswordGame.crosswordObj[state.selectedCell?.row - 1][
                  state.selectedCell?.number
                ]);

          state.crosswordGame.crosswordObj[state.selectedCell?.row][
            state.selectedCell?.number
          ].addedWordLetter = null;
        }
      }

      state.baseInput = "";
    },
    changeBaseInput(state, action) {
      if (action.payload === "Backspace") {
        state.baseInput = "";
        return;
      }
      state.baseInput = action.payload;
    },
    setShowEndGameModal(state, action) {
      state.showEndGameModal = action.payload;
    },
    setEndAttempt(state, action) {
      state.endAttempt = action.payload;
    },
    setShowHideCurrentUserAttemptAnswers(state) {
      state.showHideCurrentUserAttemptAnswers = !state.showHideCurrentUserAttemptAnswers;
    },

    setCrosswordsListCurrentPage(state, action) {
      state.crosswordsListCurrentPage = action.payload;
    },
    setIsLastCrosswordsListPage(state, action) {
      state.isLastCrosswordsListPage = action.payload;
    },
    setShowHideCrosswordsList(state, action) {
      state.showHideCrosswordsList = action.payload;
    },
    setCrosswordsListTransitionClasses(state, action) {
      state.crosswordsListTransitionClasses = action.payload;
    },
    setBrowserType(state, action) {
      state.browserType = action.payload;
    },
    setCrosswordGameID(state, action) {
      state.crosswordGame._id = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getAvailableCrosswords.pending, (state) => {
      state.fetchCrosswordsArrStatus = crosswordGameFetchStatus.Loading;
    });
    builder.addCase(setAvailableCrosswordGame.pending, (state) => {
      state.fetchAvailableCrosswordGamesStatus = crosswordGameFetchStatus.Loading;
    });
    builder.addCase(createStartAttempt.pending, (state) => {
      state.createStartAttemptStatus = crosswordGameFetchStatus.Loading;
    });
    builder.addCase(finishAttempt.pending, (state) => {
      state.finishAttemptStatus = crosswordGameFetchStatus.Loading;
    });
    builder.addCase(getAvailableCrosswords.fulfilled, (state) => {
      state.fetchCrosswordsArrStatus = crosswordGameFetchStatus.Resolve;
    });
    builder.addCase(setAvailableCrosswordGame.fulfilled, (state) => {
      state.fetchAvailableCrosswordGamesStatus = crosswordGameFetchStatus.Resolve;
    });
    builder.addCase(createStartAttempt.fulfilled, (state) => {
      state.createStartAttemptStatus = crosswordGameFetchStatus.Resolve;
    });
    builder.addCase(finishAttempt.fulfilled, (state) => {
      state.finishAttemptStatus = crosswordGameFetchStatus.Resolve;
    });
    builder.addCase(getAvailableCrosswords.rejected, (state) => {
      state.fetchCrosswordsArrStatus = crosswordGameFetchStatus.Error;
    });
    builder.addCase(setAvailableCrosswordGame.rejected, (state) => {
      state.fetchAvailableCrosswordGamesStatus = crosswordGameFetchStatus.Error;
    });
    builder.addCase(createStartAttempt.rejected, (state) => {
      state.createStartAttemptStatus = crosswordGameFetchStatus.Error;
    });
    builder.addCase(finishAttempt.rejected, (state) => {
      state.finishAttemptStatus = crosswordGameFetchStatus.Error;
    });
  },
});

export const crossworGamedActions = crosswordGameSlice.actions;
