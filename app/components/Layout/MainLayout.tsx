"use client";
import React, { useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";
import SessionProviderComponent from "../SessionProviderSection/SessionProvider";
import ReduxProvider from "@/app/ReduxProvider";
import Transition from "../Transition";
import { usePathname, useRouter } from "next/navigation";
import { ViewTransitions } from "next-view-transitions";
import TransitionTemplate from "../TransitionTemplate";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { crossworGamedActions } from "@/app/store/crosswordGameSlice";

export function isTelegramWebApp() {
  // @ts-ignore
  return typeof TelegramWebviewProxy !== "undefined";
}
const MainLayout = (props: any) => {
  const pathname = usePathname();
  return (
    <>
      <SessionProviderComponent>
        <ReduxProvider>{pathname !== "/wsGamesRoomList" && <Header></Header>}</ReduxProvider>
        <main
          className=" text-headerButtonColor min-h-[80vh] w-11/12
          mx-auto"
        >
          {props.children}
        </main>
        <ReduxProvider>{pathname !== "/wsGamesRoomList" && <Footer></Footer>}</ReduxProvider>
      </SessionProviderComponent>
    </>
  );
};

export default MainLayout;
