import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as io from "socket.io-client";
import { ImageNames, IUserInventoryAndEquipmentObj, IUserInventoryObj } from "../types";

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

export enum UserMoveDirections {
  right = "right",
  down = "down",
  up = "up",
  left = "left",
  stop = "stop",
}

export enum CoopGameMessageType {
  message = "message",
  notification = "notification",
}

export interface ICoopGamesSlice {
  CoopGamesState: {
    currentResolution: {
      height: number;
      width: number;
    };
    showLevelsComponent: boolean;
    showInteractWithInventoryAndEquipmentElStatus: {
      showStatus: boolean;
      interactTo: "inventory" | "equipment";
      XCoord: number;
      YCoord: number;
    };
    userSelectedEquipmentElID: string;
    showInteractWithEquipmentElStatus: boolean;
    showEquipmentComponent: boolean;
    imgResources: {
      userImgWalk?: HTMLImageElement;
      userImgAttack?: HTMLImageElement;
      userImgGetDamageImg?: HTMLImageElement;
      rockTextureImg?: HTMLImageElement;
      grassTextureImg?: HTMLImageElement;
      orcImgWalkImg?: HTMLImageElement;
      orcImgAttackImg?: HTMLImageElement;
      orcImgGetDamageImg?: HTMLImageElement;
      orcImgDeathImg?: HTMLImageElement;
      NPCHPImg?: HTMLImageElement;
      userStatsIcon?: HTMLImageElement;
      rocksAndStones?: HTMLImageElement;
      prepareAttackArea?: HTMLImageElement;
      roadTile?: HTMLImageElement;
      trees?: HTMLImageElement;
      exterior?: HTMLImageElement;
      characterPannel?: HTMLImageElement;
      levelUserWindow?: HTMLImageElement;
      equipmentUserWindow?: HTMLImageElement;
      equipment?: HTMLImageElement;
      userActionButtons?: HTMLImageElement;
      userActionButtons2?: HTMLImageElement;
      inventoryEquipmentInteract?: HTMLImageElement;
    };

    actionButtonData: {
      showButtonStatus: boolean;
      XButtonImageCoord: number;
      YButtonImageCoord: number;
    };

    test: string;
    basePosition: {
      x: number;
      y: number;
    };
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

    frameObj: {
      mainFrame: number;
      objects: {
        [id: string]: {
          idFrame: number;
        };
      };
    };

    attackStatusObj: {
      [objectID: string]: {
        time?: number | undefined;
        isCooldown: boolean;
        isActive: boolean;
      };
    };

    statObj: {
      NPC: {
        [objectID: string]: {
          currentHP: number;
          baseHP: number;
          currentArmour: number;
          currentDamage: number;
          percentHP: number;
        };
      };
      gamers: {
        [objectID: string]: {
          currentHP: number;
          baseHP: number;
          currentArmour: number;
          currentDamage: number;
          percentHP: number;
          currentLVL: number;
          currentLVLUserPoint: number;
          currentLVLMaxPoint: number;
          levelPoints: number;
        };
      };
    };

    currentMapSize: number;

    socket?: io.Socket;
    showRoomStatus: boolean;
    currentJoinedRoomID?: string;
    allGamesRoomsList: { _id: string; name: string; isStarted: boolean }[];
    fetchAllGameRoomsStatus: CoopGamesFetchStatus;
    squareCoordinates?: {
      [socketID: string]: {
        type: "gamer" | "NPC";
        objectType: string;
        getDamageStatus: boolean;
        imgName: ImageNames;
        square: {
          prevCoord: {
            topLeft: {
              x: number;
              y: number;
            };
            topRight: {
              x: number;
              y: number;
            };
            bottomLeft: {
              x: number;
              y: number;
            };
            bottomRight: {
              x: number;
              y: number;
            };
          };
          currentCoord: {
            topLeft: {
              x: number;
              y: number;
            };
            topRight: {
              x: number;
              y: number;
            };
            bottomLeft: {
              x: number;
              y: number;
            };
            bottomRight: {
              x: number;
              y: number;
            };
          };
        };
        chanks: {
          topChanks?: { [coord: string]: { x: number; y: number } };
          bottomChanks?: { [coord: string]: { x: number; y: number } };
          rightChanks?: { [coord: string]: { x: number; y: number } };
          leftChanks?: { [coord: string]: { x: number; y: number } };
        };
        moveDirection: UserMoveDirections;
        NPCViewDirection?: UserMoveDirections;

        userRole: string;
        attackStatus: { time?: number };
      };
    };
    touchEl: string;
    gameFieldData: {
      [row: number]: {
        [col: number]: {
          // isUserChank: boolean;
          type?: string;
          notMove: boolean;

          chankUnderAttack: boolean;
          objectDataChank: {
            objectID?: string;
            isObjectChank: boolean;
            isGamerChank: boolean | null;
          };

          // type: string;
          coord: {
            topLeft: { x: number; y: number };
            topRight: { x: number; y: number };
            bottomLeft: { x: number; y: number };
            bottomRight: { x: number; y: number };
          };

          textureObj?: {
            imageName: ImageNames;
            XSpriteCoord: number;
            YSpriteCoord: number;
            sourceX?: number;
            sourceY?: number;
            heigthChanks?: number;
            widthChanks?: number;
          };
        };
      };
    };
    dropObject: {
      [chanks: string]: {
        XChank: number;
        YChank: number;
        imageName: ImageNames;
        XSpriteCoord: number;
        YSpriteCoord: number;
        sourceX: number;
        sourceY: number;
        heigthChanks: number;
        widthChanks: number;
      }[];
    };

    userInventory: IUserInventoryAndEquipmentObj[];

    userEquipment: {
      helmet: IUserInventoryAndEquipmentObj[];
      weapon: IUserInventoryAndEquipmentObj[];
      shield: IUserInventoryAndEquipmentObj[];
      armour: IUserInventoryAndEquipmentObj[];
      boots: IUserInventoryAndEquipmentObj[];
      ring: IUserInventoryAndEquipmentObj[];
      amulet: IUserInventoryAndEquipmentObj[];
    };

    NPCUnderAttackChanksObj: {
      [NPCID: string]: {
        underAttackArea: {
          baseChankX: number;
          baseChankY: number;
          heightChanksNum: number;
          widthChanksNum: number;
        };
      };
    };
  };
}

interface ICoopGamesState {
  test: string;
  currentResolution: {
    height: number;
    width: number;
  };
  showLevelsComponent: boolean;
  showInteractWithInventoryAndEquipmentElStatus: {
    showStatus: boolean;
    interactTo: "inventory" | "equipment";
    XCoord: number;
    YCoord: number;
  };
  userSelectedEquipmentElID: string;

  showInteractWithEquipmentElStatus: boolean;

  showEquipmentComponent: boolean;

  imgResources: {
    userImgWalk?: HTMLImageElement;
    userImgAttack?: HTMLImageElement;
    userImgGetDamageImg?: HTMLImageElement;
    rockTextureImg?: HTMLImageElement;
    grassTextureImg?: HTMLImageElement;
    orcImgWalkImg?: HTMLImageElement;
    orcImgAttackImg?: HTMLImageElement;
    orcImgGetDamageImg?: HTMLImageElement;
    orcImgDeathImg?: HTMLImageElement;
    NPCHPImg?: HTMLImageElement;
    userStatsIcon?: HTMLImageElement;
    rocksAndStones?: HTMLImageElement;
    prepareAttackArea?: HTMLImageElement;
    roadTile?: HTMLImageElement;
    trees?: HTMLImageElement;
    exterior?: HTMLImageElement;
    characterPannel?: HTMLImageElement;
    levelUserWindow?: HTMLImageElement;
    equipmentUserWindow?: HTMLImageElement;
    equipment?: HTMLImageElement;
    userActionButtons?: HTMLImageElement;
    userActionButtons2?: HTMLImageElement;
    inventoryEquipmentInteract?: HTMLImageElement;
  };

  actionButtonData: {
    showButtonStatus: boolean;
    XButtonImageCoord: number;
    YButtonImageCoord: number;
  };

  basePosition: {
    x: number;
    y: number;
  };
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
  frameObj: {
    mainFrame: number;
    objects: {
      [id: string]: {
        idFrame: number;
      };
    };
  };

  attackStatusObj: {
    [objectID: string]: {
      time?: number | undefined;
      isCooldown: boolean;
      isActive: boolean;
    };
  };

  statObj: {
    NPC: {
      [objectID: string]: {
        currentHP: number;
        baseHP: number;
        currentArmour: number;
        currentDamage: number;
        percentHP: number;
      };
    };
    gamers: {
      [objectID: string]: {
        currentHP: number;
        baseHP: number;
        currentArmour: number;
        currentDamage: number;
        percentHP: number;
        currentLVL: number;
        currentLVLUserPoint: number;
        currentLVLMaxPoint: number;
        levelPoints: number;
      };
    };
  };
  socket?: io.Socket;
  showRoomStatus: boolean;
  currentJoinedRoomID?: string;
  currentMapSize: number;

  allGamesRoomsList: { _id: string; name: string; isStarted: boolean }[];
  fetchAllGameRoomsStatus: CoopGamesFetchStatus;
  squareCoordinates?: {
    [socketID: string]: {
      type: "gamer" | "NPC";
      objectType: string;
      getDamageStatus: boolean;
      imgName: ImageNames;

      square: {
        prevCoord: {
          topLeft: {
            x: number;
            y: number;
          };
          topRight: {
            x: number;
            y: number;
          };
          bottomLeft: {
            x: number;
            y: number;
          };
          bottomRight: {
            x: number;
            y: number;
          };
        };
        currentCoord: {
          topLeft: {
            x: number;
            y: number;
          };
          topRight: {
            x: number;
            y: number;
          };
          bottomLeft: {
            x: number;
            y: number;
          };
          bottomRight: {
            x: number;
            y: number;
          };
        };
      };
      chanks: {
        topChanks?: { [coord: string]: { x: number; y: number } };
        bottomChanks?: { [coord: string]: { x: number; y: number } };
        rightChanks?: { [coord: string]: { x: number; y: number } };
        leftChanks?: { [coord: string]: { x: number; y: number } };
      };
      moveDirection: UserMoveDirections;
      NPCViewDirection?: UserMoveDirections;

      userRole: string;
      attackStatus: { time?: number };
    };
  };
  touchEl: string;
  gameFieldData: {
    [row: number]: {
      [col: number]: {
        // type: string;
        // isUserChank: boolean;
        type?: string;
        notMove: boolean;

        chankUnderAttack: boolean;
        objectDataChank: {
          objectID?: string;
          isObjectChank: boolean;
          isGamerChank: boolean | null;
        };

        coord: {
          topLeft: { x: number; y: number };
          topRight: { x: number; y: number };
          bottomLeft: { x: number; y: number };
          bottomRight: { x: number; y: number };
        };
        textureObj?: {
          imageName: ImageNames;
          XSpriteCoord: number;
          YSpriteCoord: number;
          sourceX?: number;
          sourceY?: number;
          heigthChanks?: number;
          widthChanks?: number;
        };
      };
    };
  };
  dropObject: {
    [chanks: string]: {
      XChank: number;
      YChank: number;
      imageName: ImageNames;
      XSpriteCoord: number;
      YSpriteCoord: number;
      sourceX: number;
      sourceY: number;
      heigthChanks: number;
      widthChanks: number;
    }[];
  };
  userInventory: IUserInventoryAndEquipmentObj[];
  userEquipment: {
    helmet: IUserInventoryAndEquipmentObj[];
    weapon: IUserInventoryAndEquipmentObj[];
    shield: IUserInventoryAndEquipmentObj[];
    armour: IUserInventoryAndEquipmentObj[];
    boots: IUserInventoryAndEquipmentObj[];
    ring: IUserInventoryAndEquipmentObj[];
    amulet: IUserInventoryAndEquipmentObj[];
  };
  NPCUnderAttackChanksObj: {
    [NPCID: string]: {
      underAttackArea: {
        baseChankX: number;
        baseChankY: number;
        heightChanksNum: number;
        widthChanksNum: number;
      };
    };
  };
}

export const CoopGamesState: ICoopGamesState = {
  test: "",
  currentResolution: {
    height: 0,
    width: 0,
  },
  actionButtonData: {
    showButtonStatus: false,
    XButtonImageCoord: 0,
    YButtonImageCoord: 0,
  },
  showLevelsComponent: false,
  showInteractWithInventoryAndEquipmentElStatus: {
    showStatus: false,
    interactTo: "equipment",
    XCoord: 0,
    YCoord: 0,
  },
  userSelectedEquipmentElID: "",

  showInteractWithEquipmentElStatus: false,

  showEquipmentComponent: false,
  imgResources: {},
  frameObj: {
    mainFrame: 0,
    objects: {},
  },
  basePosition: {
    x: 0,
    y: 0,
  },
  currentMapSize: 0,
  attackStatusObj: {},
  statObj: {
    NPC: {},
    gamers: {},
  },
  currentRoomUsersArr: [],
  messagesArr: {},
  allGamesRoomsList: [],
  showRoomStatus: false,
  fetchAllGameRoomsStatus: CoopGamesFetchStatus.Ready,
  touchEl: "init",
  gameFieldData: {},
  dropObject: {},
  userInventory: [],
  userEquipment: {
    helmet: [],
    weapon: [],
    shield: [],
    armour: [],
    boots: [],
    ring: [],
    amulet: [],
  },
  NPCUnderAttackChanksObj: {},
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
      state.squareCoordinates = action.payload;
    },
    setTouchEl(state, action) {
      state.touchEl = action.payload;
    },
    setGameFieldData(state, action) {
      state.gameFieldData = action.payload;
    },
    setAttackStatusObj(state, action) {
      state.attackStatusObj = action.payload;
    },
    stopObjectAttack(state, action) {
      state.attackStatusObj[action.payload].time = undefined;
    },
    setFraneObj(state, action) {
      state.frameObj = action.payload;
    },
    addDataInFrameObject(state, action) {
      state.frameObj.objects = action.payload;
    },
    increaseFrameNumber(state) {
      // if (state.frameObj.mainFrame === 5) {
      //   state.frameObj.mainFrame = 0;
      //   for (const key in state.frameObj.objects) {
      //     state.frameObj.objects[key].idFrame = 0;
      //   }
      // } else {
      if (state.frameObj.mainFrame === 5) {
        state.frameObj.mainFrame = 0;
      } else {
        state.frameObj.mainFrame = state.frameObj.mainFrame + 1;
      }
      for (const key in state.frameObj.objects) {
        if (state.frameObj.objects[key].idFrame === 5) {
          state.frameObj.objects[key].idFrame = 0;
        } else {
          state.frameObj.objects[key].idFrame = state.frameObj.objects[key].idFrame + 1;
        }
      }
      // }
    },
    resetFrameNumber(state) {
      state.frameObj.mainFrame = 0;
      for (const key in state.frameObj.objects) {
        state.frameObj.objects[key].idFrame = 0;
      }
    },

    setObjectStartFrame(state, action) {
      state.frameObj.objects[action.payload].idFrame = 0;
    },

    setTest(state, action) {
      state.test = action.payload;
    },
    setImgResources(state, action) {
      state.imgResources = action.payload;
    },
    setStatObj(state, action) {
      state.statObj = action.payload;
    },
    setUnderAttackNPCObjStat(state, action) {
      if (action.payload.underAttackObjectType === "NPC") {
        state.statObj.NPC[action.payload.underAttackObjID] = action.payload.underAttackObjStat;
      }

      console.log(action.payload.underAttackObjStat);
      if (action.payload.underAttackObjectType === "gamer") {
        state.statObj.gamers[action.payload.underAttackObjID] = action.payload.underAttackObjStat;
      }
    },
    setIncreasedUserXP(state, action) {
      console.log(action.payload);
      state.statObj.gamers[action.payload.userID] = action.payload.userStat;
    },
    setCurrentMapSize(state, action) {
      state.currentMapSize = action.payload;
    },
    setBasePosition(state, action) {
      state.basePosition = action.payload;
    },
    setNPCUnderAttackChanksObj(state, action) {
      state.NPCUnderAttackChanksObj = action.payload;
    },
    setCurrentHeightResolution(state, action) {
      console.log("Change");
      state.currentResolution.height = action.payload;
    },
    setCurrentWidthResolution(state, action) {
      state.currentResolution.width = action.payload;
    },
    setShowLevelsComponent(state, action) {
      state.showLevelsComponent = action.payload;
    },
    setShowEquipmentComponent(state, action) {
      state.showEquipmentComponent = action.payload;
    },
    setDropObject(state, action) {
      state.dropObject = action.payload;
    },
    setActionButtonData(state, action) {
      state.actionButtonData = action.payload;
    },
    setUserInventory(state, action) {
      state.userInventory = action.payload;
    },
    showInteractWithInventoryElStatus(
      state,
      action: {
        payload: {
          showStatus: boolean;
          interactTo: "inventory" | "equipment";
          XCoord: number;
          YCoord: number;
        };
      }
    ) {
      state.showInteractWithInventoryAndEquipmentElStatus = action.payload;
    },
    showInteractWithEquipmentElStatus(state, action) {
      state.showInteractWithEquipmentElStatus = action.payload;
    },
    setUserEquipment(state, action) {
      state.userEquipment = action.payload;
    },
    setUserSelectedEquipmentElID(state, action) {
      state.userSelectedEquipmentElID = action.payload;
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
