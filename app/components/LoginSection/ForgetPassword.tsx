"use client";

import React from "react";
import { useState } from "react";

const ForgetPassword = () => {
  const [onFocusStatus, setInFocusStatus] = useState({
    email: false,
  });

  const [emailValue, setEmailValue] = useState("");

  const changeLoginHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setEmailValue(e.currentTarget.value);
  };

  const focusElHandler = (e: React.FocusEvent<HTMLElement>) => {
    setInFocusStatus({ email: true });
  };

  const focusOutElHandler = (e: React.FocusEvent<HTMLElement>) => {
    setInFocusStatus({ email: false });
  };
  return (
    <div>
      <div className="pb-6">
        <h1 className=" text-center text-2xl font-bold">Восстановление пароля</h1>
      </div>

      <div className=" shadow-exerciseCardHowerShadow p-3 max-w-xl mx-auto border-headerButtonHoverColor rounded-md border-solid border-2">
        <form className="  w-11/12 mx-auto" action="">
          <div className=" relative py-4">
            <input
              onChange={changeLoginHandler}
              onFocus={focusElHandler}
              onBlur={focusOutElHandler}
              className="w-full  py-3 z-0 hover:border-slate-400 focus:border-slate-400 border-solid rounded border-2  border-slate-200"
              id="forgetEmail"
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
          <div>
            <button className=" text-slate-50 font-bold shadow-exerciseCardHowerShadow min-w-max py-2 px-6 rounded bg-buttonColor hover:bg-buttonHoverColor">
              {" "}
              Восстановить пароль
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
