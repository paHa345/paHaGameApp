import { AppDispatch } from "@/app/store";
import { appStateActions, IAppSlice } from "@/app/store/appStateSlice";
import { CoopGameMessageType, CoopGamesActions, ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faGamepad,
  faHandFist,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RoomGameField from "./RoomGameField";
import { isTelegramWebApp } from "../Layout/MainLayout";

const RoomComponentMain = () => {
  const [startTouchCoord, setStartTouchCoord] = useState<any>({ x: 0, y: 0 });
  const [moveDitection, setmoveDitection] = useState<any>();
  const roomElRef = useRef<HTMLDivElement>(null);

  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);
  const currentJoinedRoomID = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.currentJoinedRoomID
  );
  const currentRoomUsers = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.currentRoomUsersArr
  );
  const messagesArr = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.messagesArr);
  const [message, setMessage] = useState("");

  const cooldownStatus = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.attackStatusObj
  );

  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  const messagesContainerEnd = useRef<HTMLDivElement>(null);

  const currentResolution = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.currentResolution
  );

  const mapSize = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.currentMapSize);

  const dispatch = useDispatch<AppDispatch>();

  const userImgWalk = new Image();
  const userImgAttack = new Image();
  const userStatsIcon = new Image();
  const userImgGetDamageImg = new Image();
  const grassTextureImg = new Image();
  const rockTextureImg = new Image();
  const orcImgWalkImg = new Image();
  const orcImgAttackImg = new Image();
  const orcImgGetDamageImg = new Image();
  const orcImgDeathImg = new Image();
  const NPCHPImg = new Image();
  const rocksAndStones = new Image();
  const prepareAttackArea = new Image();
  const roadTile = new Image();
  const trees = new Image();
  const exterior = new Image();
  const characterPannel = new Image();

  // console.log(mapSize);

  useEffect(() => {
    userImgWalk.onload = () => {
      console.log("Images load");
    };
    const imageSources = [
      { name: grassTextureImg, src: "/grassImg.png" },
      { name: userImgAttack, src: "/Swordsman/Lvl1/Swordsman_lvl1_Walk_Attack_with_shadow.png" },
      { name: userImgWalk, src: "/Swordsman/Lvl1/Swordsman_lvl1_Walk_with_shadow.png" },
      { name: userImgGetDamageImg, src: "/Swordsman/Lvl1/Swordsman_lvl1_Hurt_with_shadow.png" },
      { name: orcImgWalkImg, src: "/Orc/orc3_walk_with_shadow.png" },
      { name: orcImgAttackImg, src: "/Orc/orc3_walk_attack_with_shadow.png" },
      {
        name: rockTextureImg,
        src: "/RockAndStones/Objects_separately/Rokc3_snow_shadow_dark1.png",
      },
      {
        name: orcImgGetDamageImg,
        src: "/Orc/orc3_hurt_with_shadow.png",
      },
      {
        name: orcImgDeathImg,
        src: "/Orc/orc3_death_with_shadow.png",
      },
      {
        name: NPCHPImg,
        src: "/HPImage/NPCHPImage.png",
      },
      {
        name: userStatsIcon,
        src: "/UserStatImages/userStatsIcon.png",
      },
      {
        name: rocksAndStones,
        src: "/RocksAndStones/Rocks_source_texture_shadow_dark.png",
      },
      {
        name: prepareAttackArea,
        src: "/PrepareAttack/prepareAttackArea.png",
      },
      {
        name: roadTile,
        src: "/MainCharactersHome/exterior.png",
      },
      {
        name: trees,
        src: "/MainCharactersHome/Trees_animation.png",
      },
      {
        name: exterior,
        src: "/MainCharactersHome/exterior.png",
      },
      {
        name: characterPannel,
        src: "/RPGUI/character_pannel2.2.png",
      },
    ];

    const setImgSrc = () => {
      imageSources.forEach((imageObj) => {
        imageObj.name.src = imageObj.src;
        imageObj.name.onload = () => {
          console.log("Load");
        };
      });
    };

    setImgSrc();

    dispatch(
      CoopGamesActions.setImgResources({
        userImgWalk: userImgWalk,
        userImgAttack: userImgAttack,
        userImgGetDamageImg: userImgGetDamageImg,
        rockTextureImg: rockTextureImg,
        grassTextureImg: grassTextureImg,
        orcImgWalkImg: orcImgWalkImg,
        orcImgAttackImg: orcImgAttackImg,
        orcImgGetDamageImg: orcImgGetDamageImg,
        orcImgDeathImg: orcImgDeathImg,
        NPCHPImg: NPCHPImg,
        userStatsIcon: userStatsIcon,
        rocksAndStones: rocksAndStones,
        prepareAttackArea: prepareAttackArea,
        roadTile: roadTile,
        trees: trees,
        exterior: exterior,
        characterPannel: characterPannel,
      })
    );

    // const preloadImgResource = (currentImg: any, src: any, callback: any) => {
    //   currentImg.src = src;
    //   currentImg.onLoad = callback(null, src);
    //   currentImg.onError = (error: any) => callback(error, src);
    // };

    // const imgResourcesPromises = imageSources.map((imageObj) => {
    //   return new Promise((resolve, reject) => {
    //     preloadImgResource(imageObj.name, imageObj.src, (error: any) => {
    //       if (error) {
    //         reject(error);
    //       } else {
    //         resolve("data");
    //       }
    //     });
    //   });
    // });

    // Promise.all(imgResourcesPromises)
    //   .then(() => {
    //     console.log("All images loading");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

  const leaveRoomHandler = () => {
    socket?.emit("leave_room", {
      roomID: currentJoinedRoomID,
      telegramUser,
      type: CoopGameMessageType.notification,
    });
    dispatch(CoopGamesActions.setShowRoomStatus(false));
    dispatch(CoopGamesActions.setCurrentJoinedRoomID(undefined));
    // socket?.emit("disconnectServer");
    // console.log(socket?.id);
    // socket?.close();
    // dispatch(CoopGamesActions.setSocket(undefined));
  };

  const currentRoomJoinedUsersEl = currentRoomUsers.map((user) => {
    return (
      <div className=" flex flex-col justify-center items-center" key={user.socketID}>
        <img
          className=" h-14 w-14 rounded-full"
          alt="userImage"
          src={
            user.photoURL
              ? user.photoURL
              : "https://cdn.vectorstock.com/i/500p/20/92/user-icon-man-silhouette-vector-25482092.jpg"
          }
        ></img>
        {user.socketID === socket?.id ? (
          <h1 className=" text-lg font-bold">Вы</h1>
        ) : user.username ? (
          <h1>{user.username}</h1>
        ) : (
          <h1>{user.userID}</h1>
        )}
      </div>
    );
  });

  const messagesEl =
    currentJoinedRoomID && messagesArr[currentJoinedRoomID] ? (
      messagesArr[currentJoinedRoomID].map((messageObj, index) => {
        const self = telegramUser?.id === messageObj.telegramUserID;
        const name =
          messageObj.type === CoopGameMessageType.notification ? (
            <div></div>
          ) : messageObj.telegramUserName ? (
            <h1>{messageObj.telegramUserName} : </h1>
          ) : (
            <h1> {messageObj.telegramUserID} : </h1>
          );

        return (
          <div className={`py-2 border-b-2 ${self && "bg-teal-50"} `} key={`${index}_${message}`}>
            <div className=" flex justify-start items-center flex-row">
              {messageObj.type === CoopGameMessageType.message && messageObj.photo_url && (
                <div className=" h-14 w-14 mr-3 flex justify-center items-center">
                  <img
                    className=" h-14 w-14 rounded-full"
                    alt="userImage"
                    src={messageObj.photo_url}
                  ></img>
                </div>
              )}
              {self ? <div className=" pr-7">Вы : </div> : <div className=" pr-7">{name}</div>}
              <div>
                <h1>{messageObj.message}</h1>
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <div></div>
    );

  const changeMessageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendRoomMessageHandler = (e: any) => {
    e.preventDefault();
    if (socket && telegramUser) {
      socket.emit("GTSGameRoomMessage", {
        message,
        currentJoinedRoomID,
        telegramUser,
        type: CoopGameMessageType.message,
      });
      socket.emit("getSocketID");
      setMessage("");
    }
  };

  const startGameHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("Start game");
    socket?.emit("startGame", currentJoinedRoomID);
    // const element = roomElRef.current;
    // if (element !== null && element.requestFullscreen) {
    //   element?.requestFullscreen();
    // }
  };

  const attackUserClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("Attack Mouse");
    socket?.emit("clientStartAttack", {
      roomID: currentJoinedRoomID,
    });
  };

  const attackUserTouchHandler = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log("Attack touch");
    socket?.emit("clientStartAttack", {
      roomID: currentJoinedRoomID,
    });
  };

  const hoverMouseHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints !== 0) return;

    const target = e.target as any;
    if (!target.closest("div").dataset.direction) {
      return;
    }

    if (moveDitection !== target.closest("div").dataset.direction) {
      setmoveDitection(target.closest("div").dataset.direction);
      socket?.emit("clientStartMove", {
        direction: target.closest("div").dataset.direction,
        roomID: currentJoinedRoomID,
      });
    }
  };

  const touchStartHandler = (e: React.TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;

    const target = e.target as any;
    if (!target.closest("div").dataset.direction) {
      return;
    }

    setStartTouchCoord({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
    // if (moveDitection !== target.closest("div").dataset.direction) {
    //   setmoveDitection(target.closest("div").dataset.direction);
    //   socket?.emit("clientStartMove", {
    //     direction: target.closest("div").dataset.direction,
    //     roomID: currentJoinedRoomID,
    //   });
    // }
  };

  let currentDirection: any;
  let xOrYMove: any;
  const touchMoveHandler = (e: React.TouchEvent<HTMLDivElement>) => {
    if (window.navigator.maxTouchPoints === 0) return;

    xOrYMove =
      (startTouchCoord.y - e.targetTouches[0].clientY) *
        (startTouchCoord.y - e.targetTouches[0].clientY) >
      (startTouchCoord.x - e.targetTouches[0].clientX) *
        (startTouchCoord.x - e.targetTouches[0].clientX)
        ? "y"
        : "x";

    if (startTouchCoord.x - e.targetTouches[0].clientX > 5 && xOrYMove === "x") {
      currentDirection = "down";
    }
    if (startTouchCoord.x - e.targetTouches[0].clientX < -5 && xOrYMove === "x") {
      currentDirection = "up";
    }
    if (startTouchCoord.y - e.targetTouches[0].clientY > 5 && xOrYMove === "y") {
      currentDirection = "left";
    }
    if (startTouchCoord.y - e.targetTouches[0].clientY < -5 && xOrYMove === "y") {
      currentDirection = "right";
    }

    if (currentDirection !== moveDitection) {
      console.log("change direction");

      setmoveDitection(currentDirection);
      socket?.emit("clientStartMove", {
        direction: currentDirection,
        roomID: currentJoinedRoomID,
      });
    }

    // console.log(e.targetTouches[0].clientX);
    // console.log(e.targetTouches[0].clientY);

    // if (!target.closest("div").dataset.direction) {
    //   return;
    // }
    // setTouchEl(target.closest("div").dataset.direction);
    // dispatch(CoopGamesActions.setTouchEl(target.closest("div").dataset.direction));
  };

  const clientMoveHandler = function (this: { direction: string }) {
    socket?.emit("clientStartMove", { direction: this.direction, roomID: currentJoinedRoomID });
  };

  const stopMoveHandler = () => {
    console.log("Stop Move");
    socket?.emit("clientStopMove", currentJoinedRoomID);
    setmoveDitection(null);
  };

  useEffect(() => {
    socket?.on("joinRoomUserMessage", (data) => {
      console.log(data);
      dispatch(CoopGamesActions.addJoinedRoomMessage(data));
    });
    socket?.on("leaveRoomUserMessage", (data) => {
      console.log(data);
      dispatch(CoopGamesActions.addJoinedRoomMessage(data));
    });

    socket?.on("addUserInRoom", (currentRoomJoinedUsers) => {
      console.log("add user in room");
      dispatch(CoopGamesActions.setCurrentRoomUsersArr(currentRoomJoinedUsers));
      // if (currentJoinedRoomID) {
      //   const usersObj = data[currentJoinedRoomID].users;
      //   console.log(usersObj);
      // }
    });

    socket?.on("deleteUserFromRoom", (currentRoomJoinedUsers) => {
      dispatch(CoopGamesActions.setCurrentRoomUsersArr(currentRoomJoinedUsers));
    });

    socket?.on(
      "roomGTSGameMessage",
      (messageData: {
        message: string;
        telegramUserID: string;
        telegramUserName: string;
        messageDate: number;
        photo_url: string | undefined;
        type: CoopGameMessageType;
      }) => {
        dispatch(
          CoopGamesActions.addMessageInArr({
            message: messageData.message,
            roomID: currentJoinedRoomID,
            telegramUserID: messageData.telegramUserID,
            telegramUserName: messageData.telegramUserName,
            messageDate: messageData.messageDate,
            photo_url: messageData.photo_url,
            type: messageData.type,
          })
        );
      }
    );

    socket?.on("startGameInRoom", (gameData) => {
      console.log(socket.id);
      console.log(gameData);

      if (!socket.id) return;
      // console.log(gameData.statsObj.gamers[socket.id]);
      dispatch(CoopGamesActions.addDataInFrameObject(gameData.frameObject.objects));
      dispatch(CoopGamesActions.setSquareCoordinates(gameData.usersData));
      dispatch(CoopGamesActions.setGameFieldData(gameData.gameFieldData));
      dispatch(CoopGamesActions.setStatObj(gameData.statsObj));
      dispatch(CoopGamesActions.setCurrentMapSize(gameData.mapSize));
    });
    socket?.on("serverMove", (gameData) => {
      dispatch(CoopGamesActions.setSquareCoordinates(gameData));
    });

    socket?.on("serverStartAttack", (attackObjectData: { attackObjectID: string }) => {
      console.log(attackObjectData.attackObjectID);
      dispatch(CoopGamesActions.setObjectStartFrame(attackObjectData.attackObjectID));

      // dispatch(CoopGamesActions.setAttackStatusObj(serverAttackData.attackStatusObj));
    });
    socket?.on(
      "serverStopAttack",
      (serverAttackData: {
        [objectID: string]: {
          time?: number | undefined;
          isCooldown: boolean;
          isActive: boolean;
        };
      }) => {
        console.log(serverAttackData);
        dispatch(CoopGamesActions.setAttackStatusObj(serverAttackData));
      }
    );
    socket?.on(
      "serverResetCooldown",
      (serverAttackData: {
        [objectID: string]: {
          time?: number | undefined;
          isCooldown: boolean;
          isActive: boolean;
        };
      }) => {
        dispatch(CoopGamesActions.setAttackStatusObj(serverAttackData));
      }
    );
    socket?.on("sendDataFromServer", (serverData: any) => {
      dispatch(CoopGamesActions.setSquareCoordinates(serverData.users));
      dispatch(CoopGamesActions.setAttackStatusObj(serverData.attackStatus));
      // dispatch(CoopGamesActions.setGameFieldData(serverData.gameField));
      // dispatch(CoopGamesActions.setFraneObj(serverData.frameObj));
    });
    socket?.on(
      "serverUnderAttackObjectStat",
      (serverData: {
        underAttackObjID: string;
        underAttackObjectType: "NPC" | "gamer";
        underAttackObjStat: {
          baseHP: number;
          currentArmour: number;
          currentDamage: number;
          currentHP: number;
          percentHP: number;
          currentLVL: number;
          currentLVLUserPoint: number;
          currentLVLMaxPoint: number;
        };
      }) => {
        console.log(serverData);
        dispatch(CoopGamesActions.setObjectStartFrame(serverData.underAttackObjID));
        dispatch(CoopGamesActions.setUnderAttackNPCObjStat(serverData));
      }
    );
    socket?.on(
      "serverIncreaseUserXP",
      (increasedUserData: {
        userStat: {
          baseHP: number;
          currentArmour: number;
          currentDamage: number;
          currentHP: number;
          percentHP: number;
          currentLVL: number;
          currentLVLUserPoint: number;
          currentLVLMaxPoint: number;
        };
        userID: string;
      }) => {
        console.log(increasedUserData);
        dispatch(CoopGamesActions.setIncreasedUserXP(increasedUserData));
      }
    );

    socket?.on("serverNPCDeathAnimationStatus0", (serverData: { underAttackObjectID: string }) => {
      dispatch(CoopGamesActions.setObjectStartFrame(serverData.underAttackObjectID));
    });

    socket?.on("serverNPCViewArea", (serverData) => {
      console.log(serverData);
    });
    socket?.on("NPCChanksUnderAttack", (serverData) => {
      console.log(serverData);
      dispatch(CoopGamesActions.setNPCUnderAttackChanksObj(serverData));
    });

    return () => {
      socket?.off("roomGTSGameMessage");
      socket?.off("send-message");
      socket?.off("joinRoomUserMessage");
      socket?.off("leaveRoomUserMessage");
      socket?.off("addUserInRoom");
      socket?.off("deleteUserFromRoom");
      socket?.off("startGameInRoom");
      // socket?.off("serverMoveDown");
      // socket?.off("serverMoveUp");
      // socket?.off("serverMoveLeft");
      // socket?.off("serverMoveRight");
      socket?.off("serverMove");
      socket?.off("serverStartAttack");
      socket?.off("serverStopAttack");
      socket?.off("serverResetCooldown");
      socket?.off("sendDataFromServer");
      socket?.off("serverUnderAttackObjectStat");
      socket?.off("serverNPCDeathAnimationStatus");
      socket?.off("serverNPCViewArea");
      socket?.off("NPCChanksUnderAttack");
      socket?.off("serverIncreaseUserXP");
    };
  }, [socket]);

  useEffect(() => {
    if (messagesContainerEnd.current) {
      messagesContainerEnd.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [messagesArr]);

  useEffect(() => {
    const handleEvent = (ev: KeyboardEvent) => {
      if (ev.code === "Space") {
        console.log(`yourkey is ${ev.code}!`);
        socket?.emit("clientStartAttack", {
          roomID: currentJoinedRoomID,
        });
      }
    };

    window.addEventListener("keyup", handleEvent);

    return () => {
      window.removeEventListener("keyup", handleEvent);
    };
  }, [socket]);

  useEffect(() => {
    dispatch(CoopGamesActions.setCurrentHeightResolution(window.innerHeight));
    dispatch(CoopGamesActions.setCurrentWidthResolution(window.innerWidth));

    const handleResize = () => {
      dispatch(CoopGamesActions.setCurrentWidthResolution(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className=" pt-5">
        {" "}
        {mapSize <= 0 && (
          <div>
            <div>
              <h1>Ширина: {currentResolution.width}</h1>
            </div>
            <div>
              <h1>Высота: {currentResolution.height}</h1>
            </div>
            <br />
            <div className=" flex">
              <div className=" cursor-pointer buttonBackCoopRoom" onClick={leaveRoomHandler}>
                <FontAwesomeIcon className=" fa-fw" icon={faArrowLeft} />К списку cерверов
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <div className=" min-h-[70vh]">
        <div className="h-[20vh] overflow-x-scroll  w-full flex justify-center items-center flex-wrap  gap-6">
          {currentRoomJoinedUsersEl}
        </div>

        <div className=" h-[50vh] overflow-x-scroll">
          <div className=" py-5">{messagesEl}</div>
          <div ref={messagesContainerEnd}></div>
        </div>

        <form action={sendRoomMessageHandler}>
          <div className=" flex justify-center items-center gap-4 flex-col py-5">
            <div className=" px-3 py-3 border-2 border-spacing-1 border-slate-500 border-solid flex justify-center items-center gap-4">
              <input
                className=" basis-4/5 border-2 border-spacing-1 border-slate-300 border-solid"
                type="text"
                placeholder="Текст сообщения"
                value={message}
                onChange={changeMessageHandler}
              />
              <button className="buttonStudent " onClick={sendRoomMessageHandler}>
                Отправить сообщение
              </button>
            </div>
          </div>
        </form>
      </div> */}
      {mapSize <= 0 && (
        <div>
          <div onClick={startGameHandler} className=" buttonStudent">
            Начать игру
          </div>
        </div>
      )}
      {mapSize > 0 && (
        <div>
          <div className=" py-3">
            <RoomGameField></RoomGameField>
          </div>
          <div className="absolute z-50 bottom-10 w-full touch-none py-3 my-3 flex justify-center items-center gap-2">
            <div className=" flex justify-around items-center w-full">
              <div
                onClick={attackUserClickHandler}
                onTouchStart={attackUserTouchHandler}
                className=" flex items-center justify-center buttonCoopJoystick h-20 w-20"
              >
                <FontAwesomeIcon className="  fa-fw fa-2x" icon={faHandFist} />
              </div>
              <div
                onMouseMove={hoverMouseHandler}
                onMouseLeave={stopMoveHandler}
                onTouchStart={touchStartHandler}
                onTouchEnd={stopMoveHandler}
                onTouchMove={touchMoveHandler}
                className=" touch-none flex items-center justify-center flex-col"
              >
                <div data-direction={"up"}>
                  <FontAwesomeIcon className=" buttonBackCoopRoom fa-fw" icon={faArrowUp} />
                </div>
                <div className=" flex justify-center items-center">
                  <div data-direction={"left"}>
                    <FontAwesomeIcon className=" buttonBackCoopRoom fa-fw" icon={faArrowLeft} />
                  </div>
                  <div className=" px-1 py-1">
                    <FontAwesomeIcon className="  fa-fw fa-2x" icon={faGamepad} />
                  </div>
                  <div data-direction={"right"}>
                    <FontAwesomeIcon className=" buttonBackCoopRoom fa-fw" icon={faArrowRight} />
                  </div>
                </div>
                <div data-direction={"down"}>
                  <FontAwesomeIcon className=" buttonBackCoopRoom fa-fw" icon={faArrowDown} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomComponentMain;
