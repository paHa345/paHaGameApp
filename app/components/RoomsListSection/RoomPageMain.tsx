"use client";

import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import * as io from "socket.io-client";

const RoomPageMain = () => {
  const pathname = usePathname();
  const pathsArr = pathname.split("/");
  const roomID = pathsArr[pathsArr.length - 1];

  //   const socket = io.connect("http://localhost:3111");

  //   const sendMessageHandler = () => {
  //     socket.emit("send-message", "Message from client");
  //   };

  useEffect(() => {}, []);

  return (
    <>
      <h1 className=" px-3 py-3 text-2xl text-center"> Вы зашли на сервер с ID {roomID} </h1>
      {/* <div>{roomID}</div> */}
      <div>{/* <button onClick={sendMessageHandler}>Send Message</button> */}</div>
    </>
  );
};

export default RoomPageMain;
