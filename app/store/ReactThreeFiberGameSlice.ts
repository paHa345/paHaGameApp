import { RapierRigidBody } from "@react-three/rapier";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as THREE from "three";
import { conditionPatternStatus } from "../types";
import { useRapier, vec3 } from "@react-three/rapier";
import * as rapier from "@dimforge/rapier3d-compat";

export const setStartAttackStatus = createAsyncThunk(
  "ReactThreeFiberGameState/setStartAttackStatus",
  async function (
    attackData: { page?: number; gameType: string | undefined },
    { rejectWithValue, dispatch, getState },
  ) {
    try {
      const state = getState() as IReactThreeFiberGameSlice;
      if (state.ReactThreeFiberGameState.playerAttackStatus) return;

      dispatch(ReactThreeFiberGameActions.setPlayerStartAttack());

      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(ReactThreeFiberGameActions.setPlayerEndAttack());
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const NPCAttackHandler = createAsyncThunk(
  "ReactThreeFiberGameState/NPCAttackHandler",
  async function (attackData: { id: string }, { rejectWithValue, dispatch, getState }) {
    try {
      const state = getState() as IReactThreeFiberGameSlice;
      if (state.ReactThreeFiberGameState.enemyNPCData[attackData.id].attackStatus) return;

      // Устанавливаем статус на атаку
      dispatch(ReactThreeFiberGameActions.setNPCStartAttackPatternStatus({ id: attackData.id }));

      dispatch(ReactThreeFiberGameActions.setNPCWeaponSwing({ id: attackData.id }));
      await new Promise((resolve) => setTimeout(resolve, 2000));

      dispatch(ReactThreeFiberGameActions.setNPCStartHitAttack({ id: attackData.id }));
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Атака закончилась, устанавливаем статус на "агрессивный"
      dispatch(ReactThreeFiberGameActions.setNPCFinishHitAttack({ id: attackData.id }));

      dispatch(ReactThreeFiberGameActions.setNPCFinishAttackPatternStatus({ id: attackData.id }));
      dispatch(
        ReactThreeFiberGameActions.setCurrentEnemyConditionStatus({
          id: attackData.id,
          conditionPatternStatus: conditionPatternStatus.Agressive,
        }),
      );
      dispatch(
        ReactThreeFiberGameActions.setCurrentEnemyAnimationName({
          id: attackData.id,
          animationName: "walk",
        }),
      );
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

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
    playerStat: {
      baseHP: number;
      currentHP: number;
    };

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
    animationsName: "idle" | "walk" | "holding-both" | "attack-melee-right" | "holding-right-shoot";
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
        attackStatus: boolean;
        hitStatus: boolean;
      };
    };
    enemyNPCRefs: {
      [id: string]: {
        enemyBodyRef?: RapierRigidBody | null;
      };
    };
    enemyNPCStat: {
      [id: string]: {
        baseHP?: number;
        currentHP?: number;
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
  playerStat: {
    baseHP: number;
    currentHP: number;
  };

  startTime: number;
  endTime: number;
  phase: "ready" | "playing" | "ended";
  animationsName: "idle" | "walk" | "holding-both" | "attack-melee-right" | "holding-right-shoot";
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
      attackStatus: boolean;
      hitStatus: boolean;
    };
  };
  enemyNPCRefs: {
    [id: string]: {
      enemyBodyRef?: RapierRigidBody | null;
    };
  };

  enemyNPCStat: {
    [id: string]: {
      baseHP?: number;
      currentHP?: number;
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
  playerStat: {
    baseHP: 500,
    currentHP: 500,
  },

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
  enemyNPCStat: {},

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
        attackStatus: false,
        hitStatus: false,
      };
    },
    setEnemyBodyRef(state, action) {
      if (!state.enemyNPCRefs[action.payload.id]) {
        state.enemyNPCRefs[action.payload.id] = {};
      }
      state.enemyNPCRefs[action.payload.id].enemyBodyRef = action.payload.enemyBodyRef;
    },
    setNPCStat(state, action) {
      if (!state.enemyNPCStat[action.payload.id]) {
        state.enemyNPCStat[action.payload.id] = {};
      }
      state.enemyNPCStat[action.payload.id].baseHP = action.payload.baseHP;
      state.enemyNPCStat[action.payload.id].currentHP = action.payload.currentHP;
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
        console.log("Start attack");
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
    setNPCStartAttackPatternStatus(state, action) {
      if (state.enemyNPCData[action.payload.id].attackStatus) return;
      state.enemyNPCData[action.payload.id].attackStatus = true;
      console.log("StartNPCAttack");
    },
    setNPCFinishAttackPatternStatus(state, action) {
      if (state.enemyNPCData[action.payload.id].attackStatus) {
        state.enemyNPCData[action.payload.id].attackStatus = false;

        console.log("FinishNPCAttack");
      }
    },
    setNPCStartHitAttack(state, action) {
      if (!state.enemyNPCData[action.payload.id].hitStatus) {
        state.enemyNPCData[action.payload.id].hitStatus = true;
        state.enemyNPCData[action.payload.id].currentAnimationName = "attack-melee-right";
      }
    },
    setNPCFinishHitAttack(state, action) {
      if (state.enemyNPCData[action.payload.id].hitStatus) {
        state.enemyNPCData[action.payload.id].hitStatus = false;
      }
    },
    setNPCWeaponSwing(state, action) {
      state.enemyNPCData[action.payload.id].currentAnimationName = "holding-right-shoot";
    },

    setCurrentPlayerReduceHP(state, action) {
      console.log((state.playerStat.currentHP / state.playerStat.baseHP) * 100);
      state.playerStat.currentHP = state.playerStat.currentHP - action.payload;
    },
    setNPCReduceHP(state, action) {
      const NPCHP = state.enemyNPCStat[action.payload.id].currentHP;
      if (NPCHP) {
        state.enemyNPCStat[action.payload.id].currentHP = NPCHP - action.payload.damage;
      }
    },
  },
});

export const ReactThreeFiberGameActions = ReactThreeFiberGameSlice.actions;
