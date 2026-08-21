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
    cameraRotationStatus: boolean;

    mouseCoords: { x: number; y: number };

    /**
     * Players
     */

    playerBodyRef?: RapierRigidBody | null;
    playerAttackStatus: boolean;
    playerMoveStatus: boolean;

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
    animationsName: "idle" | "walk" | "holding-both" | "attack-melee-right";
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
        currentAnimationName: string;
      };
    };
    enemyNPCRefs: {
      [id: string]: {
        enemyBodyRef?: RapierRigidBody | null;
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
  cameraRotationStatus: boolean;

  mouseCoords: { x: number; y: number };

  playerBodyRef?: RapierRigidBody | null;
  playerAttackStatus: boolean;
  playerMoveStatus: boolean;

  startTime: number;
  endTime: number;
  phase: "ready" | "playing" | "ended";
  animationsName: "idle" | "walk" | "holding-both" | "attack-melee-right";
  rotatePlayerModel: number;
  canvasRef?: HTMLCanvasElement;
  canvasHeight: number;
  canvasWidth: number;
  rotateZombieTimer: number;

  enemyNPCData: {
    [id: string]: {
      rotationTimer: number;
      conditionPatternStatus: conditionPatternStatus;
      currentAnimationName: string;
    };
  };
  enemyNPCRefs: {
    [id: string]: {
      enemyBodyRef?: RapierRigidBody | null;
    };
  };

  zombieWalkStatus: boolean;
}

const initReactThreeFiberGameState: IReactThreeFiberGameState = {
  blocksCount: 10,
  blockSeed: 0,
  gamePauseStatus: true,
  cameraPosition: [0, 10, 0],
  cameraRotationStatus: false,

  mouseCoords: { x: 0, y: 0 },
  playerAttackStatus: false,
  playerMoveStatus: false,

  startTime: 0,
  endTime: 0,
  phase: "ready",
  animationsName: "idle",
  rotatePlayerModel: 0,
  canvasHeight: 0,
  canvasWidth: 0,
  rotateZombieTimer: 0,
  enemyNPCData: {},

  enemyNPCRefs: {},

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
      if (state.animationsName !== "walk" && !state.playerAttackStatus) {
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
          animationName: string;
        };
        type: string;
      },
    ) {
      state.enemyNPCData[action.payload.id] = {
        rotationTimer: action.payload.rotationTimer,
        conditionPatternStatus: action.payload.conditionPatternStatus,
        currentAnimationName: action.payload.animationName,
      };
    },
    setEnemyBodyRef(state, action) {
      if (!state.enemyNPCRefs[action.payload.id]) {
        state.enemyNPCRefs[action.payload.id] = {};
      }
      state.enemyNPCRefs[action.payload.id].enemyBodyRef = action.payload.enemyBodyRef;
    },
    setCurrentEnemyConditionStatus(state, action) {
      state.enemyNPCData[action.payload.id].conditionPatternStatus =
        action.payload.conditionPatternStatus;
    },
    setCurrentEnemyAnimationName(state, action) {
      state.enemyNPCData[action.payload.id].currentAnimationName = action.payload.animationName;
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
      state.playerBodyRef = action.payload;
    },
    setCameraRotationStatus(state) {
      if (state.cameraRotationStatus) {
        state.cameraRotationStatus = false;
      } else {
        state.cameraRotationStatus = true;
      }
    },
    setPlayerStartAttack(state) {
      if (!state.gamePauseStatus && !state.playerAttackStatus) {
        state.animationsName = "attack-melee-right";
        state.playerAttackStatus = true;
      }
    },
    setPlayerEndAttack(state) {
      if (!state.gamePauseStatus && state.playerAttackStatus) {
        state.animationsName = "idle";
        state.playerAttackStatus = false;
      }
    },
    setPlayerMove(state) {
      if (state.playerMoveStatus) return;
      state.playerMoveStatus = true;
      if (!state.playerAttackStatus) {
        state.animationsName = "walk";
      }
    },
    setPlayerNotMove(state) {
      if (!state.playerAttackStatus) {
        state.animationsName = "idle";
      }

      if (!state.playerMoveStatus) return;
      state.playerMoveStatus = false;
    },
  },
});

export const ReactThreeFiberGameActions = ReactThreeFiberGameSlice.actions;
