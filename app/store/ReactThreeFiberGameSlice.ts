import { RapierRigidBody } from "@react-three/rapier";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as THREE from "three";
import { conditionPatternStatus } from "../types";
import { useRapier, vec3 } from "@react-three/rapier";
import * as rapier from "@dimforge/rapier3d-compat";
import { RootState } from "@react-three/fiber";

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
      dispatch(
        ReactThreeFiberGameActions.setNPCStartAttackPatternStatus({
          id: attackData.id,
        }),
      );

      dispatch(ReactThreeFiberGameActions.setNPCWeaponSwing({ id: attackData.id }));
      await new Promise((resolve) => setTimeout(resolve, 2000));

      dispatch(ReactThreeFiberGameActions.setNPCStartHitAttack({ id: attackData.id }));
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Атака закончилась, устанавливаем статус на "агрессивный"
      dispatch(ReactThreeFiberGameActions.setNPCFinishHitAttack({ id: attackData.id }));

      dispatch(
        ReactThreeFiberGameActions.setNPCFinishAttackPatternStatus({
          id: attackData.id,
        }),
      );
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

export const NPCAttackImpact = createAsyncThunk(
  "ReactThreeFiberGameState/NPCAttackImpact",
  async function (
    attackData: {
      playerID: string;
      id: string;
      timestamp: number;
      targetPos: THREE.Vector3;
    },
    { rejectWithValue, dispatch, getState },
  ) {
    try {
      const state = getState() as IReactThreeFiberGameSlice;

      if (!state.ReactThreeFiberGameState.playerBlockStatus) {
        dispatch(ReactThreeFiberGameActions.setCurrentPlayerReduceHP(50));
        return { attackInBlock: false };
      } else {
        dispatch(
          createAndControlSparks({
            playerID: attackData.playerID,
            id: String(Date.now() + attackData.id),
            timestamp: attackData.timestamp,
            position: [attackData.targetPos?.x, attackData.targetPos?.y, attackData.targetPos?.z],
          }),
        );
        return { attackInBlock: true };
      }
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

export const setStartBlockAction = createAsyncThunk(
  "ReactThreeFiberGameState/setStartBlockAction",
  async function (attackData: { id: string }, { rejectWithValue, dispatch, getState }) {
    try {
      const state = getState() as IReactThreeFiberGameSlice;
      if (state.ReactThreeFiberGameState.playerBlockStatus) return;

      dispatch(ReactThreeFiberGameActions.setPlayerBlockStatus(true));
      dispatch(ReactThreeFiberGameActions.setPlayerStartBlock());

      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(ReactThreeFiberGameActions.setPlayerBlockStatus(false));
      dispatch(ReactThreeFiberGameActions.setPlayerEndBlock());
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const createAndControlSparks = createAsyncThunk(
  "ReactThreeFiberGameState/createAndControlSparks",
  async function (
    sparkElData: {
      playerID: string;
      id: string;
      position: [number, number, number];
      timestamp: number;
    },
    { rejectWithValue, dispatch, getState },
  ) {
    try {
      const state = getState() as IReactThreeFiberGameSlice;
      dispatch(
        ReactThreeFiberGameActions.createSparkEffectEl({
          playerID: sparkElData.playerID,

          id: sparkElData.id,
          timestamp: sparkElData.timestamp,
          position: sparkElData.position,
        }),
      );

      await new Promise((resolve) => setTimeout(resolve, 5000));
      dispatch(
        ReactThreeFiberGameActions.deleteSparkEffectEl({
          playerID: sparkElData.playerID,
          id: sparkElData.id,
        }),
      );
      return state.ReactThreeFiberGameState.effects.sparks;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const throwBarrelAction = createAsyncThunk(
  "ReactThreeFiberGameState/throwBarrelAction",
  async function (attackData: { id: string }, { rejectWithValue, dispatch, getState }) {
    try {
      const state = getState() as IReactThreeFiberGameSlice;
      if (state.ReactThreeFiberGameState.playerBlockStatus) return;

      await new Promise((resolve) => setTimeout(resolve, 100));
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
    playerMesh?: THREE.Mesh;
    playerAttackStatus: boolean;
    playerMoveStatus: boolean;
    playerStat: {
      baseHP: number;
      currentHP: number;
    };
    playerBlockStatus: boolean;

    playerCanPickUpBarrelStatus: {
      canPickUp: boolean;
      barrelID: string | undefined;
    };
    playerPickedUpBarrelID: undefined | string;
    playerThrowBarrelStatus: boolean;

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
    animationsName:
      | "idle"
      | "walk"
      | "holding-both"
      | "attack-melee-right"
      | "holding-right-shoot"
      | "holding-left";
    rotatePlayerModel: number;
    canvasRef?: HTMLCanvasElement;
    canvasHeight: number;
    canvasWidth: number;

    /**
     * NPC
     */
    rotateZombieTimer: number;

    NPCArr: {
      name: string;
      position: { x: number; y: number; z: number };
      rotationTimer: number;
      animation: string;
      conditionPatternStatus: conditionPatternStatus;
    }[];

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
    /**
     * Effects
     */
    effects: {
      sparks: {
        [playerID: string]: {
          [id: string]: {
            id: string;
            timestamp: number;
            position: [number, number, number];
          };
        };
      };
    };

    /**
     * Objects
     */
    barrelsArr: {
      id: string;
      position: THREE.Vector3;
    }[];
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
  playerMesh?: THREE.Mesh;

  playerAttackStatus: boolean;
  playerMoveStatus: boolean;
  playerStat: {
    baseHP: number;
    currentHP: number;
  };
  playerBlockStatus: boolean;
  playerCanPickUpBarrelStatus: {
    canPickUp: boolean;
    barrelID: string | undefined;
  };
  playerPickedUpBarrelID: undefined | string;
  playerThrowBarrelStatus: boolean;

  startTime: number;
  endTime: number;
  phase: "ready" | "playing" | "ended";
  animationsName:
    | "idle"
    | "walk"
    | "holding-both"
    | "attack-melee-right"
    | "holding-right-shoot"
    | "holding-left";
  rotatePlayerModel: number;
  canvasRef?: HTMLCanvasElement;
  canvasHeight: number;
  canvasWidth: number;
  rotateZombieTimer: number;

  NPCArr: {
    name: string;
    position: { x: number; y: number; z: number };
    rotationTimer: number;
    animation: string;
    conditionPatternStatus: conditionPatternStatus;
  }[];

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

  effects: {
    sparks: {
      [playerID: string]: {
        [id: string]: {
          id: string;
          timestamp: number;
          position: [number, number, number];
        };
      };
    };
  };
  barrelsArr: {
    id: string;
    position: THREE.Vector3;
  }[];
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
  playerBlockStatus: false,
  playerCanPickUpBarrelStatus: {
    canPickUp: false,
    barrelID: undefined,
  },
  playerPickedUpBarrelID: undefined,
  playerThrowBarrelStatus: false,

  startTime: 0,
  endTime: 0,
  phase: "ready",
  animationsName: "idle",
  rotatePlayerModel: 0,
  canvasHeight: 0,
  canvasWidth: 0,
  rotateZombieTimer: 0,

  NPCArr: [
    {
      name: "orc1",
      position: { x: -5, y: 0, z: -2 },
      rotationTimer: 5,
      animation: "walk",
      conditionPatternStatus: conditionPatternStatus.Peaceful,
    },
    {
      name: "orc2",
      position: { x: 2, y: 0, z: -2 },
      rotationTimer: 8,
      animation: "walk",
      conditionPatternStatus: conditionPatternStatus.Peaceful,
    },
    {
      name: "orc3",
      position: { x: 5, y: 0, z: -2 },
      rotationTimer: 4,
      animation: "walk",
      conditionPatternStatus: conditionPatternStatus.Peaceful,
    },

    {
      name: "orc4",
      position: { x: 15, y: 0, z: 20 },
      rotationTimer: 6,
      animation: "walk",
      conditionPatternStatus: conditionPatternStatus.Peaceful,
    },
    {
      name: "orc5",
      position: { x: 22, y: 0, z: 22 },
      rotationTimer: 7,
      animation: "walk",
      conditionPatternStatus: conditionPatternStatus.Peaceful,
    },
  ],
  enemyNPCData: {},

  enemyNPCRefs: {},
  enemyNPCStat: {},

  zombieWalkStatus: false,
  effects: {
    sparks: {
      player: {},
    },
  },

  barrelsArr: [
    {
      id: "barrel1",
      position: new THREE.Vector3(20, 2, 20),
    },
    {
      id: "barrel2",
      position: new THREE.Vector3(21, 1, 20),
    },
    {
      id: "barrel3",
      position: new THREE.Vector3(20, 2, 21),
    },
    {
      id: "barrel4",
      position: new THREE.Vector3(20, 1, 20),
    },
    {
      id: "barrel5",
      position: new THREE.Vector3(22, 2, 22),
    },
    {
      id: "barrel6",
      position: new THREE.Vector3(22, 1, 22),
    },
  ],
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
      if (
        state.animationsName !== "walk" &&
        !state.playerAttackStatus &&
        !state.playerBlockStatus
      ) {
        state.animationsName = "walk";
      }
    },
    setRotatePlayerModel(state, action) {
      state.rotatePlayerModel = action.payload;
    },
    setCanvasElement(state, action) {
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
    setNPCStat(
      state,
      action: {
        payload: { id: string; baseHP: number; currentHP: number };
        type: string;
      },
    ) {
      if (!state.enemyNPCStat[action.payload.id]) {
        state.enemyNPCStat[action.payload.id] = {};
      }
      state.enemyNPCStat[action.payload.id].baseHP = state.enemyNPCStat[action.payload.id].baseHP
        ? state.enemyNPCStat[action.payload.id].baseHP
        : action.payload.baseHP;
      state.enemyNPCStat[action.payload.id].currentHP = state.enemyNPCStat[action.payload.id]
        .currentHP
        ? state.enemyNPCStat[action.payload.id].currentHP
        : action.payload.currentHP;
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
    setPlayerMeshRef(state, action) {
      state.playerMesh = action.payload;
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
    setPlayerStartBlock(state) {
      state.animationsName = "holding-left";
    },
    setPlayerEndBlock(state) {
      state.animationsName = "idle";
    },
    setPlayerMove(state) {
      if (state.playerMoveStatus) return;
      state.playerMoveStatus = true;
      if (!state.playerAttackStatus && !state.playerBlockStatus) {
        state.animationsName = "walk";
      }
    },
    setPlayerNotMove(state) {
      if (!state.playerAttackStatus && !state.playerBlockStatus) {
        state.animationsName = "idle";
      }

      if (!state.playerMoveStatus) return;
      state.playerMoveStatus = false;
    },
    setNPCStartAttackPatternStatus(state, action) {
      if (state.enemyNPCData[action.payload.id].attackStatus) return;
      state.enemyNPCData[action.payload.id].attackStatus = true;
    },
    setNPCFinishAttackPatternStatus(state, action) {
      if (state.enemyNPCData[action.payload.id].attackStatus) {
        state.enemyNPCData[action.payload.id].attackStatus = false;
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
      if (state.playerBlockStatus) {
        console.log(`Block NPC attack ${Date.now()}`);
      }
      state.playerStat.currentHP = state.playerStat.currentHP - action.payload;
    },

    setNPCReduceHP(state, action) {
      const NPCHP = state.enemyNPCStat[action.payload.id].currentHP;
      if (NPCHP) {
        state.enemyNPCStat[action.payload.id].currentHP = NPCHP - action.payload.damage;
        const NPCHPAfterReduce = state.enemyNPCStat[action.payload.id].currentHP;
        if (NPCHPAfterReduce === undefined) return;
        if (NPCHPAfterReduce <= 0) {
          console.log("Delete orc");
          //delete npc from position arr
          state.NPCArr = state.NPCArr.filter((NPC) => NPC.name !== action.payload.id);
          //delete npc stat
          delete state.enemyNPCStat[action.payload.id];
          //delete npc ref

          delete state.enemyNPCRefs[action.payload.id];
        }
      }
    },
    deleteNPCFromArr(state, action) {
      state.NPCArr = state.NPCArr.filter((NPC) => NPC.name !== action.payload.id);
    },
    setPlayerBlockStatus(state, action) {
      state.playerBlockStatus = action.payload;
    },
    createSparkEffectEl(
      state,
      action: {
        payload: {
          playerID: string;
          id: string;
          position: [number, number, number];
          timestamp: number;
        };
        type: string;
      },
    ) {
      if (state.effects.sparks[action.payload.playerID][action.payload.id]) return;

      if (!state.effects.sparks[action.payload.playerID]) {
        state.effects.sparks[action.payload.playerID] = {};
      }

      state.effects.sparks[action.payload.playerID][action.payload.id] = {
        id: action.payload.id,
        timestamp: action.payload.timestamp,
        position: action.payload.position,
      };
    },
    deleteSparkEffectEl(state, action) {
      if (!state.effects.sparks[action.payload.playerID][action.payload.id]) return;
      delete state.effects.sparks[action.payload.playerID][action.payload.id];
    },
    setPlayerPickUpStatus(
      state,
      action: {
        payload: {
          barrelID: string | undefined;
          canPickUpStatus: boolean;
        };
        type: string;
      },
    ) {
      if (
        action.payload.canPickUpStatus === state.playerCanPickUpBarrelStatus.canPickUp &&
        state.playerCanPickUpBarrelStatus.barrelID === action.payload.barrelID
      )
        return;

      console.log("Set Can Pick Up");
      state.playerCanPickUpBarrelStatus = {
        barrelID: action.payload.barrelID,
        canPickUp: action.payload.canPickUpStatus,
      };
    },
    setPlayerPickedUpBarrelID(state) {
      if (!state.playerCanPickUpBarrelStatus.canPickUp) return;
      if (state.playerCanPickUpBarrelStatus.barrelID === undefined) return;
      console.log(state.playerCanPickUpBarrelStatus.barrelID);

      state.playerPickedUpBarrelID = state.playerCanPickUpBarrelStatus.barrelID;
    },
    setPlayerThrowBarrelStatus(state, action) {
      state.playerThrowBarrelStatus = action.payload;
    },
  },
});

export const ReactThreeFiberGameActions = ReactThreeFiberGameSlice.actions;
