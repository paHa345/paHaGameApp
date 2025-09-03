"use client";

import { AppDispatch } from "@/app/store";
import { IAppSlice } from "@/app/store/appStateSlice";
import { CoopGamesActions, ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { redirect, useParams, usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as io from "socket.io-client";

const RoomPageMain = () => {
  const pathname = usePathname();
  const pathsArr = pathname.split("/");
  const roomID = pathsArr[pathsArr.length - 1];
  const router = useRouter();
  const params = useParams();

  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);
  const dispatch = useDispatch<AppDispatch>();

  const [message, setMessage] = useState("");

  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  const changeMessageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const messagesArr = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.messagesArr);

  const sendRoomMessageHandler = () => {
    if (socket) {
      socket.emit("GTSGameRoomMessage", { message, roomID });
    }
  };

  const messagesEl = messagesArr.map((message, index) => {
    return (
      <div key={`${index}_${message}`}>
        <h1>{message}</h1>
      </div>
    );
  });

  //   useEffect(() => {
  //     return () => {
  //       //   socket?.emit("disconnectServer");
  //       console.log("Params changed");
  //       socket?.disconnect();
  //     };
  //   }, [pathname, params]);

  useEffect(() => {
    // dispatch(
    //   CoopGamesActions.setSocket(
    //     io.connect(process.env.NEXT_PUBLIC_WEB_SOCKET_SERVER_URL, {
    //       transports: ["websocket"],
    //     })
    //   )
    // );

    if (socket) {
      socket.emit("join_room", roomID);
    } else {
      redirect("/wsGamesRoomList");
    }

    // return function () {
    //   socket?.emit("disconnectServer");
    // };
  }, []);

  useEffect(() => {
    socket?.on("send-message", (message) => {
      dispatch(CoopGamesActions.addMessageInArr(message));
    });

    socket?.on("roomGTSGameMessage", (message: string) => {
      console.log(message);
      dispatch(CoopGamesActions.addMessageInArr(message));
    });
  }, [socket]);

  return (
    <>
      <div className="py-5">
        <Link className=" buttonCoopRoom" href={"/wsGamesRoomList"}>
          {" "}
          <FontAwesomeIcon className=" fa-fw" icon={faArrowLeft} />К списку cерверов
        </Link>
      </div>

      <h1 className=" px-3 py-3 text-2xl text-center"> Вы зашли на сервер с ID {roomID} </h1>
      {/* <div>{roomID}</div> */}
      <div>{/* <button onClick={sendMessageHandler}>Send Message</button> */}</div>
      <div>
        <h1>ID: {telegramUser?.id}</h1>
        <h1>Имя: {telegramUser?.username}</h1>
      </div>

      <div className=" py-5">{messagesEl}</div>

      <div className=" flex justify-center items-center gap-4 flex-col py-5">
        <div className=" px-3 py-3 border-2 border-spacing-1 border-slate-500 border-solid flex justify-center items-center gap-4">
          <input
            className=" border-2 border-spacing-1 border-slate-300 border-solid"
            type="text"
            placeholder="Text here"
            value={message}
            onChange={changeMessageHandler}
          />
          <button className="buttonStudent" onClick={sendRoomMessageHandler}>
            Send Message
          </button>
        </div>
      </div>
    </>
  );
};

export default RoomPageMain;
