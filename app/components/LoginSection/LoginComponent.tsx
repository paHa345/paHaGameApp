"use client";
import React, { useContext, useState } from "react";
import Login from "./Login";
import Registration from "./Registration";
import ForgetPassword from "./ForgetPassword";
import { IAppSlice } from "../../store/appStateSlice";
import { useSelector } from "react-redux";

const LoginComponent = () => {
  const showSignin = useSelector((state: IAppSlice) => state.appState.showSigninStatus);
  console.log(showSignin);
  return (
    <>
      <div className="  mx-auto py-8">
        {showSignin && <Login></Login>}
        {!showSignin && <Registration></Registration>}
        <ForgetPassword></ForgetPassword>
      </div>
    </>
  );
};

export default LoginComponent;
