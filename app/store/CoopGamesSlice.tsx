import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as io from "socket.io-client";

export const getAllRoomsList = createAsyncThunk(
  "CoopGamesState/getAiiRoomsList",
  async function (_, { rejectWithValue, dispatch }) {
    try {
      const allRoomsListReq = await fetch("/api/gameRooms/getAllGameRooms");
      const allRoomsList = await allRoomsListReq.json();
      if (!allRoomsListReq.ok) {
        throw new Error(allRoomsList.message);
      }
      dispatch(CoopGamesActions.setAllGamesRoomsList(allRoomsList.result.allGamesRoomList));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export enum CoopGamesFetchStatus {
  Ready = "ready",
  Loading = "loading",
  Resolve = "resolve",
  Error = "error",
}

export enum CoopGameMessageType {
  message = "message",
  notification = "notification",
}

export interface ICoopGamesSlice {
  CoopGamesState: {
    messagesArr: {
      [name: string]: [
        {
          message: string;
          roomID?: string | undefined;
          telegramUserID?: string;
          telegramUserName?: string;
          messageDate?: number;
          type: CoopGameMessageType;
          photo_url?: string | undefined;
        },
      ];
    };
    currentRoomUsersArr: {
      username: string;
      userID: number;
      photoURL: string | undefined;
      socketID: string;
    }[];

    socket?: io.Socket;
    showRoomStatus: boolean;
    currentJoinedRoomID?: string;
    allGamesRoomsList: { _id: string; name: string; isStarted: boolean }[];
    fetchAllGameRoomsStatus: CoopGamesFetchStatus;
    squareCoordinates?: {
      [socketID: string]: {
        square: {
          prevCoord: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
          };
          currentCoord: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
          };
        };
        userRole: string;
      };
    };
  };
}

interface ICoopGamesState {
  messagesArr: {
    [name: string]: [
      {
        message: string;
        roomID?: string | undefined;
        telegramUserID?: string;
        telegramUserName?: string;
        messageDate?: number;
        type: CoopGameMessageType;
        photo_url?: string | undefined;
      },
    ];
  };
  currentRoomUsersArr: {
    username: string;
    userID: number;
    photoURL: string | undefined;
    socketID: string;
  }[];
  socket?: io.Socket;
  showRoomStatus: boolean;
  currentJoinedRoomID?: string;

  allGamesRoomsList: { _id: string; name: string; isStarted: boolean }[];
  fetchAllGameRoomsStatus: CoopGamesFetchStatus;
  squareCoordinates?: {
    [socketID: string]: {
      square: {
        prevCoord: {
          x1: number;
          x2: number;
          y1: number;
          y2: number;
        };
        currentCoord: {
          x1: number;
          x2: number;
          y1: number;
          y2: number;
        };
      };
      userRole: string;
    };
  };
}

export const CoopGamesState: ICoopGamesState = {
  currentRoomUsersArr: [],
  messagesArr: {},
  allGamesRoomsList: [],
  showRoomStatus: false,
  fetchAllGameRoomsStatus: CoopGamesFetchStatus.Ready,
};

export const CoopGamesSlice = createSlice({
  name: "CoopGames",
  initialState: CoopGamesState,
  reducers: {
    setAllGamesRoomsList(state, action) {
      state.allGamesRoomsList = action.payload;
    },
    setSocket(state, action) {
      state.socket = action.payload;
    },
    addMessageInArr(
      state,
      action: {
        payload: {
          message: string;
          roomID: string | undefined;
          telegramUserID: string;
          telegramUserName: string;
          messageDate: number;
          photo_url: string | undefined;
          type: CoopGameMessageType;
        };
      }
    ) {
      if (action.payload.roomID === undefined) return;
      if (state.messagesArr[action.payload.roomID]) {
        state.messagesArr[action.payload.roomID].push({
          message: action.payload.message,
          roomID: action.payload.roomID,
          telegramUserID: action.payload.telegramUserID,
          telegramUserName: action.payload.telegramUserName,
          messageDate: action.payload.messageDate,
          photo_url: action.payload.photo_url,
          type: action.payload.type,
        });
      } else {
        state.messagesArr[action.payload.roomID] = [
          {
            message: action.payload.message,
            roomID: action.payload.roomID,
            telegramUserID: action.payload.telegramUserID,
            telegramUserName: action.payload.telegramUserName,
            messageDate: action.payload.messageDate,
            photo_url: action.payload.photo_url,
            type: action.payload.type,
          },
        ];
      }
    },
    addJoinedRoomMessage(
      state,
      action: {
        payload: {
          message: string;
          roomID: string | undefined;
          type: CoopGameMessageType;
        };
      }
    ) {
      if (action.payload.roomID === undefined) return;
      if (state.messagesArr[action.payload.roomID]) {
        state.messagesArr[action.payload.roomID].push({
          message: action.payload.message,
          roomID: action.payload.roomID,
          type: action.payload.type,
        });
      } else {
        state.messagesArr[action.payload.roomID] = [
          {
            message: action.payload.message,
            roomID: action.payload.roomID,
            type: action.payload.type,
          },
        ];
      }
    },

    setCurrentRoomUsersArr(state, action) {
      state.currentRoomUsersArr = action.payload;
    },
    setShowRoomStatus(state, action) {
      state.showRoomStatus = action.payload;
    },
    setCurrentJoinedRoomID(state, action) {
      state.currentJoinedRoomID = action.payload;
    },

    setSquareCoordinates(state, action) {
      console.log(action.payload);
      state.squareCoordinates = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllRoomsList.pending, (state) => {
      state.fetchAllGameRoomsStatus = CoopGamesFetchStatus.Loading;
    });
    builder.addCase(getAllRoomsList.fulfilled, (state) => {
      state.fetchAllGameRoomsStatus = CoopGamesFetchStatus.Resolve;
    });
    builder.addCase(getAllRoomsList.rejected, (state) => {
      state.fetchAllGameRoomsStatus = CoopGamesFetchStatus.Error;
    });
  },
});

export const CoopGamesActions = CoopGamesSlice.actions;
