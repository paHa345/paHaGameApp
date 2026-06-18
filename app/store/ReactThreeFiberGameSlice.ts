import { createSlice } from "@reduxjs/toolkit";

export interface IReactThreeFiberGameSlice {
  ReactThreeFiberGameState: {
    blocksCount: number;
    blockSeed: number;

    /**
     * Time
     */

    startTime: number;
    endTime: number;

    /**
     * Phases
     */
    phase: "ready" | "playing" | "ended";
  };
}

interface IReactThreeFiberGameState {
  blocksCount: number;
  blockSeed: number;

  startTime: number;
  endTime: number;
  phase: "ready" | "playing" | "ended";
}

const initReactThreeFiberGameState: IReactThreeFiberGameState = {
  blocksCount: 10,
  blockSeed: 0,

  startTime: 0,
  endTime: 0,
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
        state.startTime = Date.now();
      }
    },
    restart(state) {
      if (state.phase === "playing" || state.phase === "ended") {
        state.phase = "ready";
        state.blockSeed = Math.random();
      }
    },
    end(state) {
      if (state.phase === "playing") {
        state.phase = "ended";
        state.endTime = Date.now();
      }
    },
  },
});

export const ReactThreeFiberGameActions = ReactThreeFiberGameSlice.actions;
