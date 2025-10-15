import { AppDispatch } from "@/app/store";
import { IAppSlice } from "@/app/store/appStateSlice";
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
import { div, h1 } from "framer-motion/client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RoomGameField from "./RoomGameField";

const RoomComponentMain = () => {
  const [startTouchCoord, setStartTouchCoord] = useState<any>();
  const [moveDitection, setmoveDitection] = useState<any>();

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

  const dispatch = useDispatch<AppDispatch>();

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

  const startGameHandler = () => {
    console.log("Start game");
    socket?.emit("startGame", currentJoinedRoomID);
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
      currentDirection = "left";
    }
    if (startTouchCoord.x - e.targetTouches[0].clientX < -5 && xOrYMove === "x") {
      currentDirection = "right";
    }
    if (startTouchCoord.y - e.targetTouches[0].clientY > 5 && xOrYMove === "y") {
      currentDirection = "up";
    }
    if (startTouchCoord.y - e.targetTouches[0].clientY < -5 && xOrYMove === "y") {
      currentDirection = "down";
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
      dispatch(CoopGamesActions.addDataInFrameObject(gameData.frameObject.objects));
      dispatch(CoopGamesActions.setSquareCoordinates(gameData.usersData));
      dispatch(CoopGamesActions.setGameFieldData(gameData.gameFieldData));
    });
    socket?.on("serverMove", (gameData) => {
      dispatch(CoopGamesActions.setSquareCoordinates(gameData));
    });

    socket?.on(
      "serverStartAttack",
      (serverAttackData: {
        attackStatusObj: {
          [objectID: string]: {
            time?: number | undefined;
            isCooldown: boolean;
            isActive: boolean;
          };
        };
        roomID: string;
        socketID: string;
      }) => {
        console.log(serverAttackData);
        // dispatch(
        //   CoopGamesActions.setUserAttackStatus({
        //     isCooldown: serverAttackData.attackStatus.isCooldown,
        //     time: serverAttackData.attackStatus.time,
        //     socketID: serverAttackData.socketID,
        //   })
        // );
        dispatch(CoopGamesActions.setAttackStatusObj(serverAttackData.attackStatusObj));
      }
    );
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
      dispatch(CoopGamesActions.setFraneObj(serverData.frameObj));
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

  return (
    <>
      <div className=" pt-5">
        {" "}
        <div className=" flex">
          <div className=" cursor-pointer buttonBackCoopRoom" onClick={leaveRoomHandler}>
            <FontAwesomeIcon className=" fa-fw" icon={faArrowLeft} />К списку cерверов
          </div>
        </div>
      </div>
      <div className=" min-h-[70vh]">
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
      </div>
      <div>
        <div onClick={startGameHandler} className=" buttonStudent">
          Начать игру
        </div>
      </div>
      <div className=" py-3">
        <RoomGameField></RoomGameField>
      </div>
      <div className=" touch-none py-3 my-3 flex justify-center items-center gap-2 border-2 border-solid border-orange-500 rounded-full ">
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
    </>
  );
};

export default RoomComponentMain;
