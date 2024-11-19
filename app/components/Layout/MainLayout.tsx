"use client";
import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import SessionProviderComponent from "../SessionProviderSection/SessionProvider";
import ReduxProvider from "@/app/ReduxProvider";

const MainLayout = (props: any) => {
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
