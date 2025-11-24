"use client";
import React from "react";

const PaHaParseXMLMain = () => {
  const parseXMLStartHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Start");
    const dataReq = await fetch("api/parseXML", {
      method: "POST",
      body: JSON.stringify({
        name: "paHa",
      }),
    });
    const req = await dataReq.json();
    console.log(req);
  };
  return (
    <div className=" h-[60vh] flex justify-center items-center">
      <div onClick={parseXMLStartHandler} className=" cursor-pointer buttonStandart">
        <h1>Обработать XML</h1>
      </div>
    </div>
  );
};

export default PaHaParseXMLMain;
