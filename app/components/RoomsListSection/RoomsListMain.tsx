"use client";
import { AppDispatch } from "@/app/store";
import {
  CoopGamesActions,
  CoopGamesFetchStatus,
  getAllRoomsList,
  ICoopGamesSlice,
} from "@/app/store/CoopGamesSlice";
import { div } from "framer-motion/client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CoopGameRoom from "./CoopGameRoom";
import * as io from "socket.io-client";

const RoomsListMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchAllGamesRoomsList = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.fetchAllGameRoomsStatus
  );
  const allGamesRoomsList = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.allGamesRoomsList
  );

  const messagesArr = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.messagesArr);

  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);

  //   const [socket, setSocket] = useState<io.Socket>();
  const [message, setMessage] = useState("");

  //   const [messagesArr, setMessagesArr] = useState([]);

  //   const socket = io.connect("http://localhost:3111");
  //   let socket: io.Socket<DefaultEventsMap, DefaultEventsMap>;

  useEffect(() => {
    dispatch(
      CoopGamesActions.setSocket(
        io.connect(process.env.NEXT_PUBLIC_WEB_SOCKET_SERVER_URL, {
          transports: ["websocket"],
        })
      )
    );
  }, []);

  const sendMessageHandler = function (this: string) {
    if (socket) {
      socket.emit("send-message", message);
    }
    // setMessage("");
    // socket.emit("test_action", { message: "wieuyrwieuyr" });
  };

  const roomChooseHandler = function (this: string) {
    console.log(this);
    if (socket) {
      socket.emit("join_room", this);
    }
    console.log("emitted");
  };

  const disconnectedFromSocketHandler = () => {
    console.log(socket?.connected);
    if (socket?.connected) {
      socket.disconnect();
    } else {
      socket?.connect();
    }
  };

  const sendGTSGameRoomMessage = () => {
    socket?.emit("GTSGameRoomMessage", "GTSGameRoomMessage");
  };

  const changeMessageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const roomsEl = allGamesRoomsList.map((room) => {
    return (
      <div key={room._id} onClick={roomChooseHandler.bind(room._id)}>
        <CoopGameRoom id={room._id} name={room.name} isStarted={room.isStarted}></CoopGameRoom>
      </div>
    );
  });

  const messagesEl = messagesArr.map((message, index) => {
    return (
      <div key={`${index}_${message}`}>
        <h1>{message}</h1>
      </div>
    );
  });

  useEffect(() => {
    dispatch(getAllRoomsList());
  }, []);

  useEffect(() => {
    socket?.on("send-message", (message) => {
      dispatch(CoopGamesActions.addMessageInArr(message));
    });

    socket?.on("roomGTSGameMessage", (message: string) => {
      console.log(message);
    });
  }, [socket]);

  //   useEffect(() => {
  //     socket.on("chatroom_users", (data: any) => {
  //       console.log(data);
  //     });
  //     // return () => socket.off('chatroom_users');
  //   }, [socket]);

  return (
    <>
      <div>
        <h1 className=" text-2xl text-center px-3 py-3">Список игровых серверов</h1>
      </div>

      <div>
        <button className="delete-buttonStandart" onClick={disconnectedFromSocketHandler}>
          {socket?.connect ? "Отключиться" : "Подключиться"}
        </button>
      </div>

      <div>{messagesEl}</div>

      <div className=" flex justify-center items-center gap-4 flex-col py-5">
        <div className=" px-3 py-3 border-2 border-spacing-1 border-slate-500 border-solid flex justify-center items-center gap-4">
          <input
            className=" border-2 border-spacing-1 border-slate-300 border-solid"
            type="text"
            placeholder="Text here"
            value={message}
            onChange={changeMessageHandler}
          />
          <button className="buttonStudent" onClick={sendMessageHandler.bind("asdasdasd")}>
            Send Message
          </button>
        </div>
        <button className="buttonStudent" onClick={sendGTSGameRoomMessage}>
          Send to GTSGame room Message
        </button>
      </div>

      <div>
        {fetchAllGamesRoomsList === CoopGamesFetchStatus.Loading && <div>Loading</div>}
        {fetchAllGamesRoomsList === CoopGamesFetchStatus.Resolve &&
          allGamesRoomsList.length > 0 && <div>{roomsEl}</div>}
      </div>
    </>
  );
};

export default RoomsListMain;
