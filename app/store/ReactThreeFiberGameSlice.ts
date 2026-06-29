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

    /**
     * Animations
     */
    animationsName: "idle" | "walk" | "holding-both";
    rotatePlayerModel: number;
  };
}

interface IReactThreeFiberGameState {
  blocksCount: number;
  blockSeed: number;

  startTime: number;
  endTime: number;
  phase: "ready" | "playing" | "ended";
  animationsName: "idle" | "walk" | "holding-both";
  rotatePlayerModel: number;
}

const initReactThreeFiberGameState: IReactThreeFiberGameState = {
  blocksCount: 10,
  blockSeed: 0,

  startTime: 0,
  endTime: 0,
  phase: "ready",
  animationsName: "idle",
  rotatePlayerModel: 0,
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
    setIdleAnimation(state) {
      if (state.animationsName !== "idle") {
        state.animationsName = "idle";
      }
    },
    setJumpAnimation(state) {
      if (state.animationsName !== "holding-both") {
        state.animationsName = "holding-both";
      }
    },
    setWalkAnimation(state) {
      if (state.animationsName !== "walk") {
        state.animationsName = "walk";
      }
    },
    setRotatePlayerModel(state, action) {
      state.rotatePlayerModel = action.payload;
    },
  },
});

export const ReactThreeFiberGameActions = ReactThreeFiberGameSlice.actions;
