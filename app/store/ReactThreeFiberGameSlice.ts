import { createSlice } from "@reduxjs/toolkit";

export interface IReactThreeFiberGameSlice {
  ReactThreeFiberGameState: {
    blocksCount: number;

    /**
     * Phases
     */
    phase: "ready" | "playing" | "ended";
  };
}

interface IReactThreeFiberGameState {
  blocksCount: number;
  phase: "ready" | "playing" | "ended";
}

const initReactThreeFiberGameState: IReactThreeFiberGameState = {
  blocksCount: 3,
  phase: "ready",
};

export const ReactThreeFiberGameSlice = createSlice({
  name: "ReactThreeFiberGameState",
  initialState: initReactThreeFiberGameState,
  reducers: {
    getTestName(state, action) {
      state.blocksCount = action.payload;
    },
    start(state) {
      if (state.phase === "ready") {
        state.phase = "playing";
      }
    },
    restart(state) {
      if (state.phase === "playing" || state.phase === "ended") {
        state.phase = "ready";
      }
    },
    end(state) {
      if (state.phase === "playing") {
        state.phase = "ended";
      }
    },
  },
});

export const ReactThreeFiberGameActions = ReactThreeFiberGameSlice.actions;
