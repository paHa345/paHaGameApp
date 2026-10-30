import { RapierRigidBody } from "@react-three/rapier";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as THREE from "three";
import { conditionPatternStatus, IInventoryItem, inventoryItemTypes } from "../types";
import { useRapier, vec3 } from "@react-three/rapier";
import * as rapier from "@dimforge/rapier3d-compat";
import { RootState } from "@react-three/fiber";
import { section } from "framer-motion/client";

function calculatePlayerExtraStats(state: {
  weapon: IInventoryItem;
  shield: IInventoryItem;
  helmet: IInventoryItem;
  armour: IInventoryItem;
}) {
  const extraDamage =
    (state.shield.damage ?? 0) +
    (state.helmet.damage ?? 0) +
    (state.armour.damage ?? 0) +
    (state.weapon.damage ?? 0);
  const extraDefense =
    (state.shield.defense ?? 0) +
    (state.helmet.defense ?? 0) +
    (state.armour.defense ?? 0) +
    (state.weapon.defense ?? 0);
  return {
    extraDamage: extraDamage,
    extraDefense: extraDefense,
  };
}

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

export const calculatePlayerAttackImpact = createAsyncThunk(
  "ReactThreeFiberGameState/calculatePlayerAttackImpact",
  async function (
    enemyObjectID: { enemyObjectID: string },
    { rejectWithValue, dispatch, getState },
  ) {
    try {
      const state = getState() as IReactThreeFiberGameSlice;
      if (!state.ReactThreeFiberGameState.playerAttackStatus) return;
      const playerDamage =
        state.ReactThreeFiberGameState.playerStat.baseDamage +
        state.ReactThreeFiberGameState.playerStat.extraDamage;

      dispatch(
        ReactThreeFiberGameActions.setNPCReduceHP({
          id: enemyObjectID.enemyObjectID,
          damage: playerDamage,
        }),
      );
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
        dispatch(
          ReactThreeFiberGameActions.setCurrentPlayerReduceHP(
            state.ReactThreeFiberGameState.enemyNPCStat[attackData.id].baseDamage,
          ),
        );
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
  async function (_, { rejectWithValue, dispatch, getState }) {
    try {
      const state = getState() as IReactThreeFiberGameSlice;

      if (state.ReactThreeFiberGameState.playerThrowBarrelStatus.status) return;
      if (!state.ReactThreeFiberGameState.playerPickedUpBarrel.id) return;

      dispatch(ReactThreeFiberGameActions.setPlayerThrowBarrelStatus(true));
      dispatch(ReactThreeFiberGameActions.setPlayerThrowBarrelTimestamp());

      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // dispatch(ReactThreeFiberGameActions.setPlayerThrowBarrelStatus(false));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const stopPlayerThrowBarrelAndCalculateImpact = createAsyncThunk(
  "ReactThreeFiberGameState/stopPlayerThrowBarrelAndCalculateImpact",
  async function (
    barrelAndObjectData: {
      barrelID: string;
      enemyObjectData: { id: string | undefined; type: string | undefined };
    },

    { rejectWithValue, dispatch, getState },
  ) {
    try {
      const state = getState() as IReactThreeFiberGameSlice;
      if (state.ReactThreeFiberGameState.playerThrowedBarrelSpeed < 12) return;
      if (!state.ReactThreeFiberGameState.playerThrowBarrelStatus.status) return;

      dispatch(ReactThreeFiberGameActions.stopPlayerThrowBarrel());
      console.log(state.ReactThreeFiberGameState.playerThrowedBarrelSpeed);

      if (!barrelAndObjectData.enemyObjectData.id) return;
      dispatch(
        ReactThreeFiberGameActions.setNPCReduceHP({
          id: barrelAndObjectData.enemyObjectData.id,
          damage: 50,
        }),
      );
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const getPointerCoords = createAsyncThunk(
  "ReactThreeFiberGameState/getPointerCoords",
  async function (
    _,

    { rejectWithValue, dispatch, getState },
  ) {
    try {
      const state = getState() as IReactThreeFiberGameSlice;
      return state.ReactThreeFiberGameState.pointerCoords;
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

    windowHeightWidth: {
      height: number;
      width: number;
    };

    mouseCoords: { x: number; y: number };
    pointerCoords: { x: number; y: number };

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
      baseDamage: number;
      extraDamage: number;
      baseDefence: number;
      extraDefence: number;
    };

    playerItems: {
      equipment: {
        weapon: IInventoryItem;
        shield: IInventoryItem;
        helmet: IInventoryItem;
        armour: IInventoryItem;
      };
      inventory: IInventoryItem[];
      dragItem: {
        itemIndexInInventory: number;
        item: IInventoryItem;
      };
    };

    playerBlockStatus: boolean;

    playerCanPickUpBarrelStatus: {
      canPickUp: boolean;
      barrelID: string | undefined;
    };
    playerPickedUpBarrel: {
      id: undefined | string;
      index: number;
    };
    playerThrowBarrelStatus: {
      status: boolean;
      index: number;
      barrelID: string | undefined;
    };
    playerThrowBarrelTimestamp: string;
    playerThrowedBarrelSpeed: number;

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
      damage: number;
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
        baseDamage?: number;
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

    /**
     * UI
     */
    showInventory: boolean;
  };
}

interface IReactThreeFiberGameState {
  blocksCount: number;
  blockSeed: number;
  gamePauseStatus: boolean;
  cameraPosition: [number, number, number];
  cameraRotationStatus: boolean;
  windowHeightWidth: {
    height: number;
    width: number;
  };

  mouseCoords: { x: number; y: number };
  pointerCoords: { x: number; y: number };

  playerBodyRef?: RapierRigidBody | null;
  playerMesh?: THREE.Mesh;

  playerAttackStatus: boolean;
  playerMoveStatus: boolean;
  playerStat: {
    baseHP: number;
    currentHP: number;
    baseDamage: number;
    extraDamage: number;
    baseDefence: number;
    extraDefence: number;
  };

  playerItems: {
    equipment: {
      weapon: IInventoryItem;
      shield: IInventoryItem;
      helmet: IInventoryItem;
      armour: IInventoryItem;
    };
    inventory: IInventoryItem[];
    dragItem: {
      itemIndexInInventory: number;
      item: IInventoryItem;
    };
  };
  playerBlockStatus: boolean;
  playerCanPickUpBarrelStatus: {
    canPickUp: boolean;
    barrelID: string | undefined;
  };
  playerPickedUpBarrel: {
    id: undefined | string;
    index: number;
  };
  playerThrowBarrelStatus: {
    status: boolean;
    index: number;
    barrelID: string | undefined;
  };
  playerThrowBarrelTimestamp: string;
  playerThrowedBarrelSpeed: number;

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
    damage: number;

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
      baseDamage?: number;
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
  showInventory: boolean;
}

const initReactThreeFiberGameState: IReactThreeFiberGameState = {
  blocksCount: 10,
  blockSeed: 0,
  gamePauseStatus: true,
  cameraPosition: [0, 10, 0],
  cameraRotationStatus: false,
  windowHeightWidth: {
    height: 0,
    width: 0,
  },

  mouseCoords: { x: 0, y: 0 },
  pointerCoords: { x: 0, y: 0 },

  playerAttackStatus: false,
  playerMoveStatus: false,
  playerStat: {
    baseHP: 500,
    currentHP: 500,
    baseDamage: 50,
    extraDamage: 0,
    baseDefence: 0,
    extraDefence: 0,
  },

  playerItems: {
    equipment: {
      weapon: {},
      shield: {
        type: inventoryItemTypes.Shield,
        name: "shield1",
        id: "shield1",
        defense: 40,
        position: {
          top: 5,
          left: -44,
          xlTop: 6,
          xlLeft: -65,
          equipmentTop: 5,
          equipmentLeft: -59,
          equipmentXlTop: 6,
          equipmentXlLeft: -80,
        },
      },
      helmet: {},
      armour: {},
    },
    inventory: [
      {
        type: inventoryItemTypes.Shield,
        name: "shield11",
        id: "shield11",
        defense: 40,

        position: {
          top: 5,
          left: 2,
          xlTop: 6,
          xlLeft: 5,
          equipmentTop: 5,
          equipmentLeft: 2,
          equipmentXlTop: 6,
          equipmentXlLeft: 5,
        },
      },
      {
        type: inventoryItemTypes.Shield,
        name: "shield1",
        id: "shield1",
        defense: 30,

        position: {
          top: 5,
          left: -44,
          xlTop: 6,
          xlLeft: -65,
          equipmentTop: 5,
          equipmentLeft: -59,
          equipmentXlTop: 6,
          equipmentXlLeft: -80,
        },
      },
      {
        type: inventoryItemTypes.Weapon,
        name: "sword23",
        id: "sword23",
        damage: 100,
        position: {
          top: -44,
          left: 2,
          xlTop: -70,
          xlLeft: 5,
          equipmentTop: -332,
          equipmentLeft: -52,
          equipmentXlTop: -384,
          equipmentXlLeft: -60,
        },
      },
      {
        type: inventoryItemTypes.Weapon,
        name: "sword7",
        id: "sword7",
        damage: 30,

        position: {
          top: -44,
          left: -44,
          xlTop: -70,
          xlLeft: -65,
          equipmentTop: -284,
          equipmentLeft: -107,
          equipmentXlTop: -328,
          equipmentXlLeft: -128,
        },
      },
      {
        type: inventoryItemTypes.Weapon,
        name: "sword7",
        id: "sword7",
        damage: 50,
        position: {
          top: -44,
          left: -44,
          xlTop: -70,
          xlLeft: -65,
          equipmentTop: -284,
          equipmentLeft: -107,
          equipmentXlTop: -328,
          equipmentXlLeft: -128,
        },
      },
    ],
    dragItem: {
      itemIndexInInventory: -1,
      item: {},
      //   type: "sword",
      //   name: "sword7",
      //   id: "sword7",
      //   position: {
      //     top: -44,
      //     left: -44,
      //     xlTop: -70,
      //     xlLeft: -65,
      //     equipmentTop: -44,
      //     equipmentLeft: -59,
      //     equipmentXlTop: -70,
      //     equipmentXlLeft: -80,
      //   },
    },
  },
  playerBlockStatus: false,
  playerCanPickUpBarrelStatus: {
    canPickUp: false,
    barrelID: undefined,
  },
  playerPickedUpBarrel: {
    id: undefined,
    index: -1,
  },
  playerThrowBarrelStatus: { status: false, index: -1, barrelID: undefined },
  playerThrowBarrelTimestamp: "",
  playerThrowedBarrelSpeed: 0,

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
      damage: 50,
      position: { x: -5, y: 0, z: -2 },
      rotationTimer: 5,
      animation: "walk",
      conditionPatternStatus: conditionPatternStatus.Peaceful,
    },
    {
      name: "orc2",
      damage: 50,
      position: { x: 2, y: 0, z: -2 },
      rotationTimer: 8,
      animation: "walk",
      conditionPatternStatus: conditionPatternStatus.Peaceful,
    },
    {
      name: "orc3",
      damage: 50,
      position: { x: 5, y: 0, z: -2 },
      rotationTimer: 4,
      animation: "walk",
      conditionPatternStatus: conditionPatternStatus.Peaceful,
    },

    {
      name: "orc4",
      damage: 50,
      position: { x: 15, y: 0, z: 20 },
      rotationTimer: 6,
      animation: "walk",
      conditionPatternStatus: conditionPatternStatus.Peaceful,
    },
    {
      name: "orc5",
      damage: 50,
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
  showInventory: false,
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
      // console.log(action.payload);

      // if (state.showInventory) {
      //   // if (state.pointerCoords.y + action.payload.y * 100 < 0) return;
      //   // if (state.pointerCoords.x + action.payload.x * 100 < 0) return;

      //   if (state.pointerCoords.x + action.payload.x * 100 > state.windowHeightWidth.width) {
      //     state.pointerCoords.x = state.windowHeightWidth.width;
      //   } else {
      //     state.pointerCoords.x =
      //       state.pointerCoords.x + action.payload.x * 100 < 0
      //         ? 0
      //         : state.pointerCoords.x + action.payload.x * 100;
      //   }
      //   if (state.pointerCoords.y + action.payload.y * 100 > state.windowHeightWidth.height) {
      //     state.pointerCoords.y = state.windowHeightWidth.height;
      //   } else {
      //     state.pointerCoords.y =
      //       state.pointerCoords.y + action.payload.y * 100 < 0
      //         ? 0
      //         : state.pointerCoords.y + action.payload.y * 100;
      //   }
      // }

      if (state.showInventory) return;

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
        payload: { id: string; baseHP: number; currentHP: number; baseDamage: number };
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
      state.enemyNPCStat[action.payload.id].baseDamage = state.enemyNPCStat[action.payload.id]
        .baseDamage
        ? state.enemyNPCStat[action.payload.id].baseDamage
        : action.payload.baseDamage;
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
      state.playerStat.currentHP =
        state.playerStat.currentHP -
        action.payload *
          ((100 - (state.playerStat.baseDefence + state.playerStat.extraDefence)) / 100);
    },

    // {
    //           id: enemyUserData.id,
    //           damage: 50,
    //         }

    setNPCReduceHP(
      state,
      action: {
        payload: {
          id: string;
          damage: number;
        };
        type: string;
      },
    ) {
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

      state.playerCanPickUpBarrelStatus = {
        barrelID: action.payload.barrelID,
        canPickUp: action.payload.canPickUpStatus,
      };
    },
    setPlayerPickedUpBarrelID(state) {
      if (!state.playerCanPickUpBarrelStatus.canPickUp) return;
      if (state.playerCanPickUpBarrelStatus.barrelID === undefined) return;
      console.log(state.playerCanPickUpBarrelStatus.barrelID);
      const index = state.barrelsArr.findIndex(
        (el) => el.id === state.playerCanPickUpBarrelStatus.barrelID,
      );

      state.playerPickedUpBarrel = {
        id: state.playerCanPickUpBarrelStatus.barrelID,
        index: index,
      };
      state.playerThrowBarrelStatus = {
        status: false,
        index: -1,
        barrelID: undefined,
      };
    },
    deletePlayerPickedUpBarrelID(state) {
      state.playerPickedUpBarrel = {
        id: undefined,
        index: -1,
      };
    },
    setPlayerThrowBarrelStatus(state, action) {
      state.playerThrowBarrelStatus = {
        status: action.payload,
        index: state.playerPickedUpBarrel.index,
        barrelID: state.playerPickedUpBarrel.id,
      };
    },
    stopPlayerThrowBarrel(
      state,
      // action,
      // action: {
      //   payload: {
      //     barrelID: string;
      //     enemyObjectData: { id: string | undefined; type: string | undefined };
      //   };
      //   type: string;
      // },
    ) {
      console.log(state.playerThrowedBarrelSpeed);
      if (
        // state.playerThrowBarrelStatus.barrelID === action.payload.barrelID &&
        state.playerThrowBarrelStatus.status
      ) {
        state.playerThrowBarrelStatus = {
          status: false,
          index: -1,
          barrelID: undefined,
        };
        console.log(state.playerThrowedBarrelSpeed);
        // if (action.payload.enemyObjectData.id && action.payload.enemyObjectData.type === "npc") {
        //   console.log(state.enemyNPCStat[action.payload.enemyObjectData.id].currentHP);
        // }
      }
    },
    setPlayerThrowBarrelTimestamp(state) {
      state.playerThrowBarrelTimestamp = String(`${Date.now()}_${state.playerPickedUpBarrel.id}`);
    },
    setPlayerThrowedBarrelSpeed(state, action) {
      state.playerThrowedBarrelSpeed = action.payload;
    },
    setShowHideInventory(state, action) {
      console.log(action.payload);
      if (action.payload === state.showInventory) return;
      state.showInventory = action.payload;
    },
    setWindowHeightWidth(state, action) {
      state.windowHeightWidth.height = action.payload.height;
      state.windowHeightWidth.width = action.payload.width;
    },
    addInventoryItemToDragContainer(state, action) {
      state.playerItems.dragItem.item = {};
      if (state.playerItems.dragItem.item.id) return;
      state.playerItems.dragItem.itemIndexInInventory = action.payload.dragItemIndex;

      const dragItem = state.playerItems.inventory[action.payload.dragItemIndex];
      state.playerItems.dragItem.item = dragItem;
    },
    addEquipmentItemToDragContainer(
      state,
      action: {
        payload: { equipmentItemType: inventoryItemTypes };
        type: string;
      },
    ) {
      state.playerItems.dragItem.item = {};
      state.playerItems.dragItem.item =
        state.playerItems.equipment[action.payload.equipmentItemType];
      state.playerItems.equipment[action.payload.equipmentItemType] = {};
    },
    clearDragItemContainer(state) {
      if (
        state.playerItems.dragItem.itemIndexInInventory !== -1 &&
        state.playerItems.dragItem.item?.id
      ) {
        state.playerItems.dragItem.item = {};
        state.playerItems.dragItem.itemIndexInInventory = -1;
      }
      if (
        state.playerItems.dragItem.itemIndexInInventory === -1 &&
        state.playerItems.dragItem.item?.id
      ) {
        const itemType = state.playerItems.dragItem.item.type as inventoryItemTypes;

        state.playerItems.equipment[itemType] = state.playerItems.dragItem.item;

        state.playerItems.dragItem.item = {};
        state.playerItems.dragItem.itemIndexInInventory = -1;
      }
    },
    addDragItemToEquipment(
      state,
      action: {
        payload: { addedEquipmentType: inventoryItemTypes };
        type: string;
      },
    ) {
      if (
        state.playerItems.dragItem.itemIndexInInventory === -1 &&
        state.playerItems.dragItem.item.type
      ) {
        state.playerItems.equipment[state.playerItems.dragItem.item?.type] =
          state.playerItems.dragItem.item;
        state.playerItems.dragItem.item = {};
        state.playerItems.dragItem.itemIndexInInventory = -1;
        return;
      }
      if (state.playerItems.dragItem.item.type !== action.payload.addedEquipmentType) {
        state.playerItems.dragItem.item = {};
        state.playerItems.dragItem.itemIndexInInventory = -1;

        return;
      }

      if (state.playerItems.dragItem.item.type === action.payload.addedEquipmentType) {
        if (state.playerItems.equipment[action.payload.addedEquipmentType]?.id) {
          state.playerItems.inventory.push(
            state.playerItems.equipment[action.payload.addedEquipmentType],
          );
          state.playerItems.equipment[action.payload.addedEquipmentType] = {};
        }

        state.playerItems.equipment[action.payload.addedEquipmentType] =
          state.playerItems.inventory[state.playerItems.dragItem.itemIndexInInventory];

        state.playerItems.inventory.splice(state.playerItems.dragItem.itemIndexInInventory, 1);

        state.playerItems.dragItem.item = {};
        state.playerItems.dragItem.itemIndexInInventory = -1;
      }

      // calculate extra stats
      const extraStats = calculatePlayerExtraStats(state.playerItems.equipment);
      state.playerStat.extraDamage = extraStats.extraDamage;
      state.playerStat.extraDefence = extraStats.extraDefense;
    },
    addDragItemToInventory(state) {
      if (
        state.playerItems.dragItem.item.id &&
        state.playerItems.dragItem.item.name &&
        state.playerItems.dragItem.item.position &&
        state.playerItems.dragItem.item.type &&
        state.playerItems.dragItem.itemIndexInInventory === -1
      ) {
        state.playerItems.inventory.push(state.playerItems.dragItem.item);
        state.playerItems.dragItem.item = {};
        state.playerItems.dragItem.itemIndexInInventory = -1;

        // calculate extra stats
        const extraStats = calculatePlayerExtraStats(state.playerItems.equipment);
        state.playerStat.extraDamage = extraStats.extraDamage;
        state.playerStat.extraDefence = extraStats.extraDefense;
      }
    },
  },
});

export const ReactThreeFiberGameActions = ReactThreeFiberGameSlice.actions;
