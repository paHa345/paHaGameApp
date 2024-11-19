import { IAuthSlice } from "@/app/store/authSlice";
import React from "react";
import { useSelector } from "react-redux";

const ConfirmEmailNotifications = () => {
  const registerUserStatus = useSelector((state: IAuthSlice) => state.authState.registerUserStatus);
  const registerUserErrorMessage = useSelector(
    (state: IAuthSlice) => state.authState.registerUserErrorMessage
  );

  return (
    <>
      <div className=" my-6">
        {registerUserStatus === "loading" && (
          <div className=" flex flex-col items-center">
            <div
              className=" my-6 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Загрузка...
              </span>
            </div>
            <h1 className=" text-center px-3 rounded-md py-3 bg-cyan-200">
              Сохранение пользователя
            </h1>
          </div>
        )}
        {registerUserStatus === "resolve" && (
          <h1 className=" text-center rounded-md   px-3 py-3 bg-green-200">
            Новый пользователь успешно зарегистрирован
          </h1>
        )}
        {registerUserStatus === "error" && (
          <div className=" flex flex-col items-center">
            <h1 className=" text-center rounded-md   px-3 py-3 bg-rose-500">
              {`Ошибка регистрации ${registerUserErrorMessage}`}
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

export default ConfirmEmailNotifications;
