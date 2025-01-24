"use client";

import React, { useEffect, useState } from "react";

const WSTestMain = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  //   const socket = new WebSocket("ws://localhost:3000/api/guessThatSong/webSocketServer");

  //   socket.onopen = function (event) {
  // WebSocket is connected, send message
  //     socket.send("Hello Server!");
  //   };

  //   socket.onmessage = function (event) {
  //     console.log("Message from server ", event.data);
  //   };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000/api/guessThatSong/webSocketServer");

    socket.onmessage = (event: any) => {
      //   setMessages([...messages, event.data]);
    };

    return () => {
      socket.close();
    };
  }, [messages]);

  return <div>WSTestMain</div>;
};

export default WSTestMain;
