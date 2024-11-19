"use client";
import { Container } from "postcss";
import React from "react";
import GameSectionCard from "./GameSectionCard";

const GamesSectionMain = () => {
  return (
    <section className=" container mx-auto">
      <div className=" py-5">
        <h1 className=" text-center text-3xl font-bold">Список Игр</h1>
      </div>
      <div className=" px-4  grid lg:grid-cols-3 sm:grid-cols-2 gap-6 justify-center items-center py-5">
        <GameSectionCard></GameSectionCard>
        <GameSectionCard></GameSectionCard>
        <GameSectionCard></GameSectionCard>
        <GameSectionCard></GameSectionCard>
        <GameSectionCard></GameSectionCard>
      </div>
    </section>
  );
};

export default GamesSectionMain;
