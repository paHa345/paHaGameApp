"use client";
import React, { useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";
import SessionProviderComponent from "../SessionProviderSection/SessionProvider";
import ReduxProvider from "@/app/ReduxProvider";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import Transition from "../Transition";
import { usePathname, useRouter } from "next/navigation";
import { ViewTransitions } from "next-view-transitions";
import TransitionTemplate from "../TransitionTemplate";

export function isTelegramWebApp() {
  // @ts-ignore
  return typeof TelegramWebviewProxy !== "undefined";
}
const MainLayout = (props: any) => {
  useEffect(() => {
    if (isTelegramWebApp()) {
      console.log("User is using Telegram Web App or in-app browser.");
      const { initDataRaw, initData } = retrieveLaunchParams();
      console.log(initData?.user?.firstName);
    } else {
      console.log("User is using a regular browser.");
    }
  });
  return (
    <>
      <SessionProviderComponent>
        <ReduxProvider>
          <Header></Header>
        </ReduxProvider>
        <main
          className=" w-11/12
          mx-auto"
        >
          {props.children}
        </main>
        <ReduxProvider>
          <Footer></Footer>
        </ReduxProvider>
      </SessionProviderComponent>
    </>
  );
};

export default MainLayout;
