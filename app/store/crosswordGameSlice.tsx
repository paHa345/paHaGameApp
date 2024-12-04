import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AddedWordDirection } from "./crosswordSlice";
import { redirect } from "next/navigation";

export const getAvailableCrosswords = createAsyncThunk(
  "crosswordGameState/getAvailableCrosswords",
  async function (_, { rejectWithValue, dispatch }) {
    try {
      const getCurrentUserCrosswordsReq = await fetch("/api/crosswordGame/getAllCrosswords");
      const crosswords = await getCurrentUserCrosswordsReq.json();
      if (!getCurrentUserCrosswordsReq.ok) {
        throw new Error(crosswords.message);
      }
      dispatch(crossworGamedActions.setAvailableCrosswordGamesArr(crosswords.result));
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
      // dispatch(crossworGamedActions.setAvailableCrosswordGame(data.result));
      dispatch(crossworGamedActions.setCrosswordGame(crosswordGame.result));

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
    cell: {
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
          cell: {
            row: number;
            col: number;
          };
        } | null;
        vertical: {
          value: string;
          questionNumber: number;
          cell: {
            row: number;
            col: number;
          };
        } | null;
      };
      addedWordCell: number;
      addedWordDirectionJbj?: {
        horizontal: Boolean;
        vertical: Boolean;
      };
      addedWordArr: {
        direction: AddedWordDirection;
        addedWordArr: {
          row: number;
          col: number;
        }[];
      }[];
    } | null,
    { rejectWithValue, dispatch }
  ) {
    if (cell !== null) {
      await dispatch(crossworGamedActions.setShowCrosswordGameCellMenu(false));

      await dispatch(crossworGamedActions.setHighlightedCell(cell));
      if (cell.questionObj.horizontal?.value) {
        await dispatch(crossworGamedActions.changeDirection(AddedWordDirection.Horizontal));
      } else {
        await dispatch(crossworGamedActions.changeDirection(AddedWordDirection.Vertical));
      }
      await dispatch(crossworGamedActions.setShowCrosswordGameCellMenu(true));

      //обновляем value у конкретного поля и highlighted, это будет суммавсех букв

      const hihlightedDirection = cell.questionObj?.horizontal
        ? AddedWordDirection.Horizontal
        : AddedWordDirection.Vertical;

      const highlightedDirectionCells = cell.addedWordArr.filter(
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
      dispatch(crossworGamedActions.setHighlightedWordObj(highlightedWordObj));
      dispatch(crossworGamedActions.updateCellAndHaghlightedValue());
    } else {
      await dispatch(crossworGamedActions.setHighlightedCell(cell));
    }
  }
);

export const createStartAttempt = createAsyncThunk(
  "crosswordGameState/createStartAttempt",
  async function (
    attemptData: {
      telegramUserName?: string;
      telegramID: number;
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
      dispatch(crossworGamedActions.setAttemptID(startAttempt.result._id));
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
      console.log(attemptData);

      const answersArr: {
        row: number;
        col: number;
        addedWordArr: {
          direction: AddedWordDirection;
          value: string;
        }[];
      }[] = [];
      attemptData.crossword.forEach((col: any, x: number) => {
        col.forEach((cell: any, y: number) => {
          if (cell?.addedWordArr?.length > 0) {
            answersArr.push({
              row: x,
              col: y,
              addedWordArr: cell.addedWordArr.map((el: any) => {
                return {
                  direction: el.direction,
                  value: el.value,
                };
              }),
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
          firstName: attemptData.first_name,
          lastName: attemptData.last_name,
        }),
      });
      const finishAttempt = await finishAttemptReq.json();
      if (!finishAttemptReq.ok) {
        throw new Error(finishAttempt.message);
      }
      // нужно включить потом, очистка данных после завершения попытки
      dispatch(crossworGamedActions.clearAttemptData());
      // добавляем данные о только что законченной попытке
      console.log(finishAttempt.result);
      dispatch(crossworGamedActions.setCurrentUserCompletedAttempt(finishAttempt.result));
    } catch (error: any) {
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
    startGameStatus: boolean;
    currentWord: string;
    index: number;
    test: number;
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

    crosswordGame: {
      _id: string;
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
    };
    availableCrosswordGameErrorMessage?: string;
  };
}

interface ICrosswordGameState {
  currentWord: string;
  startGameStatus: boolean;
  attemptID?: string;

  index: number;

  test: number;
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

  crosswordGame: {
    _id: string;
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
  };
  availableCrosswordGameErrorMessage?: string;
}

export const initCrosswordGameState: ICrosswordGameState = {
  index: 0,
  currentWord: "",
  startGameStatus: false,

  test: 10,
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
    setTest(state, action) {
      state.test = action.payload;
    },
    setShowChooseCrosswordModal(state, action) {
      state.showChooseCrosswordModal = action.payload;
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
      state.highlightedCell = action.payload;
    },
    setHighlightedWordObj(state, action) {
      state.highlightedWordObj = action.payload;
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
      // if (state.highlightedCell?.row !== undefined && state.highlightedCell?.number !== undefined) {
      //   console.log(
      //     (state.crosswordGame.crosswordObj[state.highlightedCell?.row][
      //       state.highlightedCell?.number
      //     ].addedWordLetter = "o")
      //   );
      // }
    },

    setStartGameStatus(state, action) {
      state.startGameStatus = action.payload;
    },
    setCreateStartAttemptStatusToReady(state) {
      state.createStartAttemptStatus = crosswordGameFetchStatus.Ready;
    },
    setAttemptID(state, action) {
      state.attemptID = action.payload;
    },
    setFinishAttemptStatusToReady(state) {
      state.finishAttemptStatus = crosswordGameFetchStatus.Ready;
    },
    clearAttemptData(state) {
      state.attemptID = undefined;
      state.startGameStatus = false;
      state.createStartAttemptStatus = crosswordGameFetchStatus.Ready;
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
