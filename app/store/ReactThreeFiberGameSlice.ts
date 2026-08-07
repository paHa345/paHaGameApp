import { RapierRigidBody } from "@react-three/rapier";
import { createSlice } from "@reduxjs/toolkit";
import * as THREE from "three";
import { conditionPatternStatus } from "../types";

export interface IReactThreeFiberGameSlice {
  ReactThreeFiberGameState: {
    blocksCount: number;
    blockSeed: number;
    gamePauseStatus: boolean;
    cameraPosition: [number, number, number];

    mouseCoords: { x: number; y: number };

    /**
     * Players
     */

    playerBodyRef?: RapierRigidBody | null;

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
    canvasRef?: HTMLCanvasElement;
    canvasHeight: number;
    canvasWidth: number;

    /**
     * Enemyes
     */
    rotateZombieTimer: number;
    enemyNPCData: {
      [id: string]: {
        rotationTimer: number;
        conditionPatternStatus: conditionPatternStatus;
      };
    };
    zombieWalkStatus: boolean;
  };
}

interface IReactThreeFiberGameState {
  blocksCount: number;
  blockSeed: number;
  gamePauseStatus: boolean;
  cameraPosition: [number, number, number];
  mouseCoords: { x: number; y: number };

  playerBodyRef?: RapierRigidBody | null;

  startTime: number;
  endTime: number;
  phase: "ready" | "playing" | "ended";
  animationsName: "idle" | "walk" | "holding-both";
  rotatePlayerModel: number;
  canvasRef?: HTMLCanvasElement;
  canvasHeight: number;
  canvasWidth: number;
  rotateZombieTimer: number;

  enemyNPCData: {
    [id: string]: {
      rotationTimer: number;
      conditionPatternStatus: conditionPatternStatus;
    };
  };
  zombieWalkStatus: boolean;
}

const initReactThreeFiberGameState: IReactThreeFiberGameState = {
  blocksCount: 10,
  blockSeed: 0,
  gamePauseStatus: true,
  cameraPosition: [0, 10, 0],
  mouseCoords: { x: 0, y: 0 },

  startTime: 0,
  endTime: 0,
  phase: "ready",
  animationsName: "idle",
  rotatePlayerModel: 0,
  canvasHeight: 0,
  canvasWidth: 0,
  rotateZombieTimer: 0,
  enemyNPCData: {},

  zombieWalkStatus: false,
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
    setCanvasElement(state, action) {
      console.log(action.payload);
      state.canvasRef = action.payload;
    },
    setCanvasWidthHeight(state, action) {
      state.canvasHeight = action.payload.height;
      state.canvasWidth = action.payload.width;
    },
    setMouseCoords(state, action) {
      state.mouseCoords.x = state.mouseCoords.x + action.payload.x / 3;

      if (
        state.mouseCoords.y + action.payload.y / 10 < 0.005 &&
        state.mouseCoords.y + action.payload.y / 10 > -0.1
      ) {
        state.mouseCoords.y = state.mouseCoords.y + action.payload.y / 10;
      }
    },
    setGamePauseStatus(state) {
      console.log(state.gamePauseStatus);
      if (state.gamePauseStatus) {
        state.gamePauseStatus = false;
        state.cameraPosition = [0, 0, 0];
      } else {
        state.gamePauseStatus = true;
        state.cameraPosition = [0, 10, 0];
      }
    },
    setCameraPosition(
      state,
      action: {
        payload: THREE.Vector3;
        type: string;
      },
    ) {
      state.cameraPosition = [action.payload.x, action.payload.y, action.payload.z];
    },
    setRotateZombieTimer(state, action) {
      state.rotateZombieTimer = action.payload;
    },
    setCurrentEnemyObjData(
      state,
      action: {
        payload: {
          id: string;
          rotationTimer: number;
          conditionPatternStatus: conditionPatternStatus;
        };
        type: string;
      },
    ) {
      state.enemyNPCData[action.payload.id] = {
        rotationTimer: action.payload.rotationTimer,
        conditionPatternStatus: action.payload.conditionPatternStatus,
      };
    },
    setCurrentEnemyConditionStatus(state, action) {
      state.enemyNPCData[action.payload.id].conditionPatternStatus =
        action.payload.conditionPatternStatus;
    },
    setCurrentZombieRotateTimestamp(
      state,
      action: {
        payload: { id: string; elapsedTime: number };
        type: string;
      },
    ) {
      state.enemyNPCData[action.payload.id].rotationTimer = action.payload.elapsedTime;
    },
    setZombieWalkStatus(state) {
      state.zombieWalkStatus = true;
    },

    setPlayerBodyRef(state, action) {
      console.log(action.payload);
      state.playerBodyRef = action.payload;
    },
  },
});

export const ReactThreeFiberGameActions = ReactThreeFiberGameSlice.actions;
