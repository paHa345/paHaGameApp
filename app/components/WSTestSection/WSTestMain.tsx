"use client";

import React, { useEffect, useState } from "react";

const WSTestMain = () => {
  const [status, setStatus] = useState<string>("");
  const [eventIsWorking, setEventIsWorking] = useState(false);

  const [eventSource, setEventSource] = useState<any>(null);

  let newEventSource: EventSource;
  const clickSSEHandler = function (this: string, e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();

    console.log("click");

    console.log(newEventSource?.readyState);

    if (newEventSource?.readyState !== 1) {
      newEventSource = new EventSource(
        `/api/guessThatSong/test?type=${"type"}&amount=${10}&status=${"start"}`
      );
    }

    newEventSource.onopen = async (e) => {
      console.log("SSE started");
      console.log(Date.now());
    };

    newEventSource.onerror = (e) => {
      console.error("SSE error", e);
      newEventSource.close();
      setEventIsWorking(false);
    };

    newEventSource.addEventListener("bye", function () {
      console.log("Bye");
      newEventSource.close();
    });
    newEventSource.addEventListener("increment", function (e) {
      const data = JSON.parse(e.data);
      console.log(JSON.parse(data.timeRemained));
    });

    newEventSource.onmessage = async (e) => {
      console.log("Get data");
      const data = JSON.parse(e.data);
      console.log(data);
      const { status } = data;
    };
    // if (this === "stop") {
    //   eventSource.close();
    //   console.log("SSE stopped");
    //   return;
    // }
  };
  const stopSSEHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("STOP");
    console.log(newEventSource);
    newEventSource.close();
  };
  return (
    <div>
      {" "}
      <h1>WSTestMain</h1>
      <div className=" flex justify-center items-center ">
        <div
          className={` cursor-pointer font-bold text-2xl  bg-lime-300 mx-2 my-2 py-4 px-4 rounded-lg hover:scale-105 hover:text-slate-500`}
          onClick={clickSSEHandler.bind("start")}
        >
          <h1>Start</h1>
        </div>

        <div
          className={` cursor-pointer  font-bold text-2xl bg-red-300 mx-2 my-2 py-4 px-4 rounded-lg hover:scale-105 hover:text-slate-500`}
          onClick={stopSSEHandler.bind("stop")}
        >
          <h1>Stop</h1>
        </div>
      </div>
    </div>
  );
};

export default WSTestMain;
