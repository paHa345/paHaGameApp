"use client";
import React from "react";

const PaHaMailerAppMain = () => {
  const massMailingStartHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Start");
    const dataReq = await fetch("api/massMailing", {
      method: "POST",
      body: "test",
    });
    const req = await dataReq.json();
    console.log(req);
  };
  return (
    <div className=" h-[60vh] flex justify-center items-center">
      <div onClick={massMailingStartHandler} className=" cursor-pointer buttonStandart">
        <h1>Отправить письма</h1>
      </div>
    </div>
  );
};

export default PaHaMailerAppMain;
