"use client";
import { AppDispatch } from "@/app/store";
import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChooseGTSGameButton from "./ChooseGTSGameButton";
import AvailableGTSGamelistModalMain from "../AvailableGTSGameListModal/AvailableGTSGamelistModalMain";
import { IUserSlice } from "@/app/store/userSlice";

const GTSGameSectionMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const showGTSGameChooseModal = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.showChooseGTSModal
  );

  useEffect(() => {
    console.log(window.location.pathname);
  });

  return (
    <div className=" flex justify-center items-center h-[80vh] py-10 px-8">
      <AvailableGTSGamelistModalMain></AvailableGTSGamelistModalMain>

      {!showGTSGameChooseModal && <ChooseGTSGameButton></ChooseGTSGameButton>}
    </div>
  );
};

export default GTSGameSectionMain;
