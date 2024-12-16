"use server";

import React from "react";
import CrosswordGameSectionMain from "../components/CrosswordGameSection/CrosswordGameSectionMain";
import { useSelector } from "react-redux";
import { ICrosswordGameSlice } from "../store/crosswordGameSlice";

const page = () => {
  return <CrosswordGameSectionMain></CrosswordGameSectionMain>;
};

export default page;
