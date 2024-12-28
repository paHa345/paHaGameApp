"use server";

import React from "react";
import CrosswordGameSectionMain from "../components/CrosswordGameSection/CrosswordGameSectionMain";
import { useSelector } from "react-redux";
import { ICrosswordGameSlice } from "../store/crosswordGameSlice";
import TransitionTemplate from "../components/TransitionTemplate";

const page = () => {
  return (
    // <TransitionTemplate>
    <CrosswordGameSectionMain></CrosswordGameSectionMain>
    // </TransitionTemplate>
  );
};

export default page;
