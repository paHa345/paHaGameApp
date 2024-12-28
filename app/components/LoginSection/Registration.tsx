"use client";
import { AppDispatch } from "../../store/index";
import { appStateActions } from "../../store/appStateSlice";

import {
  authActions,
  registerNewUser,
  IAuthSlice,
  sendConfirmationEmail,
} from "../../store/authSlice";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Registration = () => {
  const [onFocusStatus, setInFocusStatus] = useState({
    email: false,
    name: false,
    password: false,
  });

  const emailValue = useSelector((state: IAuthSlice) => state.authState.registeredUser.email);
  const nameValue = useSelector((state: IAuthSlice) => state.authState.registeredUser.name);
  const passValue = useSelector((state: IAuthSlice) => state.authState.registeredUser.password);

  const registrationStatus = useSelector((state: IAuthSlice) => state.authState.registerUserStatus);
  const sendConfirmationEmailStatus = useSelector(
    (state: IAuthSlice) => state.authState.sendConfirmationEmailStatus
  );

  const errorRegistrationMessage = useSelector(
    (state: IAuthSlice) => state.authState.registerUserErrorMessage
  );

  const errorSendConfirmationEmail = useSelector(
    (state: IAuthSlice) => state.authState.sendConfirmationEmailErrorMessage
  );

  const dispatch = useDispatch<AppDispatch>();

  const changeLoginHandler = (e: React.FormEvent<HTMLInputElement>) => {
    dispatch(authActions.setRegisteredEmail(e.currentTarget.value));
  };

  const changeNameHandler = (e: React.FormEvent<HTMLInputElement>) => {
    dispatch(authActions.setRegisteredName(e.currentTarget.value));
  };

  const changePassHandler = (e: React.FormEvent<HTMLInputElement>) => {
    dispatch(authActions.setRegisteredPassword(e.currentTarget.value));
  };

  const focusElHandler = (e: React.FocusEvent<HTMLElement>) => {
    setInFocusStatus({ ...onFocusStatus, [e.target.id]: true });
  };

  const focusOutElHandler = (e: React.FocusEvent<HTMLElement>) => {
    setInFocusStatus({ ...onFocusStatus, [e.target.id]: false });
  };

  const registrationUserHandler = (e: any) => {
    e.preventDefault();
    // dispatch(registerNewUser({ name: nameValue, email: emailValue, password: passValue }));
    dispatch(sendConfirmationEmail({ name: nameValue, email: emailValue, password: passValue }));
  };

  useEffect(() => {
    if (registrationStatus === "resolve") {
      setTimeout(() => {
        dispatch(authActions.setRegisterUserStatusToReady());
      }, 3000);
    }
  }, [registrationStatus]);

  const signInnHandler = () => {
    dispatch(appStateActions.showSignin());
  };

  return (
    <div>
      <div className="pb-6">
        <h1 className=" text-center text-2xl font-bold">Регистрация в личном кабинете</h1>
      </div>

      <div className=" shadow-exerciseCardHowerShadow p-3 max-w-xl mx-auto border-headerButtonHoverColor rounded-md border-solid border-2">
        <form className="  w-11/12 mx-auto" action="">
          <div className=" relative py-4">
            <input
              onChange={changeLoginHandler}
              onFocus={focusElHandler}
              onBlur={focusOutElHandler}
              className="w-full  py-3 z-0 hover:border-slate-400 focus:border-slate-400 border-solid rounded border-2  border-slate-200"
              id="email"
              type="email"
              value={emailValue}
            />
            <span>
              <label
                htmlFor="email"
                className={` absolute transition-all ease-in-out ${
                  onFocusStatus.email || emailValue.length > 0
                    ? "z-10 top-1 left-0  bg-white   scale-75"
                    : " top-1/3 left-2"
                }`}
              >
                Email
              </label>
            </span>
          </div>

          <div className=" relative py-4">
            <input
              onChange={changeNameHandler}
              onFocus={focusElHandler}
              onBlur={focusOutElHandler}
              className="w-full  py-3 z-0 hover:border-slate-400 focus:border-slate-400 border-solid rounded border-2  border-slate-200"
              id="name"
              type="email"
              value={nameValue}
            />
            <span>
              <label
                htmlFor="login"
                className={` absolute transition-all ease-in-out ${
                  onFocusStatus.name || nameValue.length > 0
                    ? "z-10 top-1 left-0  bg-white   scale-75"
                    : " top-1/3 left-2"
                }`}
              >
                Имя
              </label>
            </span>
          </div>

          <div className="py-4 relative">
            <input
              onChange={changePassHandler}
              onFocus={focusElHandler}
              onBlur={focusOutElHandler}
              value={passValue}
              className=" w-full py-3 z-0 hover:border-slate-400 focus:border-slate-400 border-solid rounded border-2  border-slate-200"
              id="password"
              type="password"
            />
            <span>
              <label
                className={` absolute transition-all ease-in-out ${
                  onFocusStatus.password || passValue.length > 0
                    ? "z-10 top-1 left-0  bg-white   scale-75"
                    : " top-1/3 left-2"
                }`}
                htmlFor="password"
              >
                Пароль
              </label>
            </span>
          </div>

          <div className=" py-4">
            {sendConfirmationEmailStatus === "loading" && (
              <h1 className=" text-center px-3 rounded-md py-3 bg-cyan-200">
                Формирование письма с подтверждением регистрации
              </h1>
            )}
            {sendConfirmationEmailStatus === "resolve" && (
              <h1 className=" text-center rounded-md   px-3 py-3 bg-green-200">
                Письмо с подтверждением успешно отправлено на почту {emailValue}
              </h1>
            )}
            {sendConfirmationEmailStatus === "error" && (
              <h1 className=" text-center rounded-md   px-3 py-3 bg-rose-500">
                {`Ошибка регистрации ${errorSendConfirmationEmail}`}
              </h1>
            )}
          </div>
          <div className=" flex justify-end mb-3">
            <button
              type="button"
              onClick={signInnHandler}
              className=" text-cyan-700 hover:bg-slate-100 px-4 py-2"
            >
              <span>На страницу входа</span>
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={registrationUserHandler}
              className=" text-slate-50 font-bold shadow-exerciseCardHowerShadow min-w-max py-2 px-6 rounded bg-buttonColor hover:bg-buttonHoverColor"
            >
              {" "}
              Отправить заявку на регистрацию
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
