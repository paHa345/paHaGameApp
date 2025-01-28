"use client";

import React, { useEffect, useState } from "react";

import io from "./../../api/guessThatSong/webSocketServer/route";

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
    const socket = new WebSocket(`ws://localhost:3000/api/guessThatSong/webSocketServer`);

    socket.addEventListener("open", (event) => {
      console.log("WebSocket connection opened", event);
    });

    // socket.send("Hello, server!");

    socket.addEventListener("message", (event) => {
      const message = event.data;
      console.log("Received message:", message);
    });

    socket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed", event);
    });

    return () => {
      socket.close();
    };
  }, []);

  return <div>WSTestMain</div>;
};

export default WSTestMain;
