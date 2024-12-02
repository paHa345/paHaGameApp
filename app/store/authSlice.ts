import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { authOptions } from "../utils/authOptions";
import { userActions } from "./userSlice";
import jwt, { JsonWebTokenError, decode } from "jsonwebtoken";

export const loginUser = createAsyncThunk(
  "authState/loginUser",
  async function (loginUser: any, { rejectWithValue, dispatch }) {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: loginUser.login,
        password: loginUser.password,
      });
      console.log(result);

      if (result?.error) {
        dispatch(authActions.setLoginUserErrorMessage(result));
        throw new Error(`${result.error}`);
      }

      console.log("Login user");

      const currentUser = await fetch(`/api/users/getUserByEmail`);
      if (currentUser.status !== 200) {
        console.log(currentUser);
        throw new Error("Не удалось войти в систему, повторите попытку позднее");
      }
      const data = await currentUser.json();
      dispatch(userActions.setCurrentUserId(data.result._id));

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendConfirmationEmail = createAsyncThunk(
  "authState/sendConfirmationEmail",
  async function (registerUserData: any, { rejectWithValue, dispatch }) {
    try {
      const validationUserReq = await fetch("../api/auth/createUserValidation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(registerUserData),
      });
      const data = await validationUserReq.json();

      if (validationUserReq.status === 400) {
        console.log(validationUserReq);
        throw new Error("Такой пользователь уже существует");
      }
      if (validationUserReq.status === 422) {
        console.log(validationUserReq);
        throw new Error("Длинна логина/пароля должна быть более 6 символов");
      }

      const confirmationUserReq = await fetch("../api/auth/sendConfirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(registerUserData),
      });

      if (confirmationUserReq.status !== 200) {
        throw new Error(
          "Не удалось отправить письмо с подтверждением на электронную почту. Повторите попытку позднее"
        );
      }

      const confirmationUser = await confirmationUserReq.json();

      return confirmationUserReq;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerNewUser = createAsyncThunk(
  "authState/registerNewUser",
  async function (registerUser: any, { rejectWithValue, dispatch }) {
    const registerUserData: any = decode(registerUser);

    try {
      if (registerUserData.exp * 1000 < Date.now()) {
        throw new Error("Срок действия ссылки истёк");
      }
      const req = await fetch("/api/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          name: registerUserData.email,
          email: registerUserData?.email,
          password: registerUserData?.password,
        }),
      });
      const data = await req.json();
      if (req.status === 400) {
        throw new Error("Такой пользователь уже существует");
      }
      if (req.status === 422) {
        throw new Error("Длинна логина/пароля должна быть более 6 символов");
      }
      // dispatch(authActions.resetRegisteredUser());
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export enum registerUserStatus {
  Ready = "ready",
  Loading = "loading",
  Resolve = "resolve",
  Error = "error",
}

export enum loginUserStatus {
  Ready = "ready",
  Loading = "loading",
  Resolve = "resolve",
  Error = "error",
}

export interface IAuthSlice {
  authState: {
    registeredUser: {
      name: string;
      email: string;
      password: string;
    };
    loginUser: {
      login: string;
      password: string;
    };
    registerUserStatus: registerUserStatus;
    registerUserErrorMessage: string | unknown;
    loginUserstatus: loginUserStatus;
    loginUserErrorMessage: string | unknown;
    sendConfirmationEmailStatus: loginUserStatus;
    sendConfirmationEmailErrorMessage: string | unknown;
  };
}

interface IAuthState {
  registeredUser: {
    name: string;
    email: string;
    password: string;
  };
  loginUser: {
    login: string;
    password: string;
  };
  registerUserStatus: registerUserStatus;
  registerUserErrorMessage: string | unknown;
  loginUserstatus: loginUserStatus;
  loginUserErrorMessage: string | unknown;
  sendConfirmationEmailStatus: loginUserStatus;
  sendConfirmationEmailErrorMessage: string | unknown;
}

export const initAuthState: IAuthState = {
  registeredUser: {
    name: "",
    password: "",
    email: "",
  },
  loginUser: {
    login: "",
    password: "",
  },
  registerUserStatus: registerUserStatus.Ready,
  registerUserErrorMessage: "",
  loginUserstatus: loginUserStatus.Ready,
  loginUserErrorMessage: "",
  sendConfirmationEmailStatus: loginUserStatus.Ready,
  sendConfirmationEmailErrorMessage: "",
};

export const authSlice = createSlice({
  name: "authState",
  initialState: initAuthState,
  reducers: {
    setRegisterUserStatusToReady(state) {
      state.registerUserStatus = registerUserStatus.Ready;
    },
    setRegisteredName(state, action) {
      state.registeredUser.name = action.payload;
    },
    setRegisteredEmail(state, action) {
      state.registeredUser.email = action.payload;
    },
    setRegisteredPassword(state, action) {
      state.registeredUser.password = action.payload;
    },
    setLoginUserLogin(state, action) {
      state.loginUser.login = action.payload;
    },
    setLoginUserPassword(state, action) {
      state.loginUser.password = action.payload;
    },
    resetRegisteredUser(state) {
      state.registeredUser.name = "";
      state.registeredUser.email = "";
      state.registeredUser.password = "";
    },
    setLoginUserErrorMessage(state, action) {
      state.loginUserErrorMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerNewUser.pending, (state) => {
      state.registerUserStatus = registerUserStatus.Loading;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.loginUserstatus = loginUserStatus.Loading;
    });
    builder.addCase(sendConfirmationEmail.pending, (state) => {
      state.sendConfirmationEmailStatus = loginUserStatus.Loading;
    });
    builder.addCase(registerNewUser.fulfilled, (state) => {
      state.registerUserStatus = registerUserStatus.Resolve;
    });
    builder.addCase(loginUser.fulfilled, (state) => {
      state.loginUserstatus = loginUserStatus.Resolve;
    });
    builder.addCase(sendConfirmationEmail.fulfilled, (state) => {
      state.sendConfirmationEmailStatus = loginUserStatus.Resolve;
    });
    builder.addCase(registerNewUser.rejected, (state, action) => {
      state.registerUserErrorMessage = action.payload;
      state.registerUserStatus = registerUserStatus.Error;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loginUserErrorMessage = action.payload;
      state.loginUserstatus = loginUserStatus.Error;
    });
    builder.addCase(sendConfirmationEmail.rejected, (state, action) => {
      state.sendConfirmationEmailErrorMessage = action.payload;
      state.sendConfirmationEmailStatus = loginUserStatus.Error;
    });
  },
});

export const authActions = authSlice.actions;
