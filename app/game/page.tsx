import React from "react";
import GamesSectionMain from "../components/GamesSection/GamesSectionMain";
import TransitionTemplate from "../components/TransitionTemplate";

const page = () => {
  return (
    <TransitionTemplate>
      <GamesSectionMain></GamesSectionMain>
    </TransitionTemplate>
  );
};

export default page;
