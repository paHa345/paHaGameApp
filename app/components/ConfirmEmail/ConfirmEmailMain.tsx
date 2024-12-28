"use client";

import { AppDispatch } from "../../store/index";
import { IAuthSlice, loginUser, registerNewUser } from "../../store/authSlice";
import jwt, { JsonWebTokenError, decode } from "jsonwebtoken";
import { redirect, useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmEmailNotifications from "./ConfirmEmailNotifications";
import { setCurrentUserWorkouts } from "../../store/appStateSlice";

const ConfirmEmailMain = () => {
  const loginUserStatus = useSelector((state: IAuthSlice) => state.authState.loginUserstatus);
  const registerUserStatus = useSelector((state: IAuthSlice) => state.authState.registerUserStatus);

  const params: any = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const token: any = decode(params?.confirmToken);
  console.log(token.password);
  useEffect(() => {
    dispatch(registerNewUser(params?.confirmToken));
  }, []);

  useEffect(() => {
    if (registerUserStatus === "resolve") {
      dispatch(loginUser({ login: token.email, password: token.password }));
      dispatch(setCurrentUserWorkouts());
    }
  }, [registerUserStatus]);

  useEffect(() => {
    if (loginUserStatus === "resolve") {
      redirect("/my");
    }
  }, [loginUserStatus]);
  return (
    <>
      <div className=" my-10 h-screen">
        <h1 className=" text-lg text-center">Подтверждение регистрации</h1>
        <ConfirmEmailNotifications></ConfirmEmailNotifications>
      </div>
    </>
  );
};

export default ConfirmEmailMain;
