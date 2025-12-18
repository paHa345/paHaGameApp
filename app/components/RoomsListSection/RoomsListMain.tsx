"use client";
import { AppDispatch } from "@/app/store";
import {
  CoopGamesActions,
  CoopGamesFetchStatus,
  getAllRoomsList,
  ICoopGamesSlice,
} from "@/app/store/CoopGamesSlice";
import { div } from "framer-motion/client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as io from "socket.io-client";
import { appStateActions, IAppSlice } from "@/app/store/appStateSlice";
import { isTelegramWebApp } from "../Layout/MainLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import CoopGameRoomButton from "./CoopGameRoomButton";
import RoomComponentMain from "./RoomComponentMain";
import { useParams } from "next/navigation";
import { redirect } from "next/navigation";
import { init, viewport, isTMA } from "@telegram-apps/sdk";

const RoomsListMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchAllGamesRoomsList = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.fetchAllGameRoomsStatus
  );
  const allGamesRoomsList = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.allGamesRoomsList
  );

  const currentJoinedRoomID = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.currentJoinedRoomID
  );

  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);

  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  const showRoomStatus = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.showRoomStatus
  );

  const [isTelegramWebAppStatus, setIsTelegramWebAppStatus] = useState(false);

  //   const [socket, setSocket] = useState<io.Socket>();
  const [message, setMessage] = useState("");

  //   const [messagesArr, setMessagesArr] = useState([]);

  //   const socket = io.connect("http://localhost:3111");
  //   let socket: io.Socket<DefaultEventsMap, DefaultEventsMap>;

  async function initApp() {
    if (await isTMA()) {
      init();

      // Подключаем и расширяем viewport
      if (viewport.mount.isAvailable()) {
        await viewport.mount();
        viewport.expand();
      }

      // Запрашиваем полноэкранный режим
      if (viewport.requestFullscreen.isAvailable()) {
        await viewport.requestFullscreen();
      }
    }
  }

  initApp();

  const setCoopGameHandler = () => {
    console.log("SetCoopName");
  };

  if (isTelegramWebApp()) {
    const tg = window.Telegram.WebApp;

    // Отключаем вертикальные свайпы (сворачивание)
    tg.expand(); // Сначала расширим окно, если нужно
    tg.ready(); // Говорим, что приложение готово

    // Отключаем свайп вниз для закрытия
    tg.disableVerticalSwipes(); // ✅ Самый простой способ    }
  }

  useEffect(() => {
    if (isTelegramWebApp()) {
      setIsTelegramWebAppStatus(true);
    }
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const initData = params.get("tgWebAppData");
    if (initData !== null) {
      const initDataParams = new URLSearchParams(initData);
      const userParams = initDataParams.get("user") as any;
      const user = JSON.parse(userParams);
      dispatch(appStateActions.setTelegranUserData(user));
      console.log(user);
    } else {
      dispatch(
        appStateActions.setTelegranUserData({
          allows_write_to_pm: false,
          first_name: "paHa345",
          id: 777777,
          language_code: "ru",
          last_name: "Paha",
          username: "Paha",
        })
      );
    }
  }, []);

  // const setNameEl = isTelegramWebApp() ? (
  //   <div></div>
  // ) : (
  //   <div className=" sm:w-1/2 px-3 py-3 border-2 border-spacing-1 border-slate-500 border-solid flex flex-col justify-center items-center gap-4">
  //     <input
  //       className=" border-2 border-spacing-1 border-slate-300 border-solid"
  //       type="text"
  //       placeholder="Укажите ваше имя"
  //     />
  //     <button className="buttonStudent" onClick={setCoopGameHandler}>
  //       Подтвердить
  //     </button>
  //   </div>
  // );

  useEffect(() => {
    console.log(`Socket ${socket}`);
    if (!socket) {
      console.log("Create socket");
      dispatch(
        CoopGamesActions.setSocket(
          io.connect(process.env.NEXT_PUBLIC_WEB_SOCKET_SERVER_URL, {
            transports: ["websocket"],
          })
        )
      );
    }
  }, []);

  const roomsEl = allGamesRoomsList.map((room) => {
    return (
      <div
        key={room._id}
        //   onClick={roomChooseHandler.bind(room._id)}
      >
        <CoopGameRoomButton
          id={room._id}
          name={room.name}
          isStarted={room.isStarted}
        ></CoopGameRoomButton>
      </div>
    );
  });

  useEffect(() => {
    dispatch(getAllRoomsList());
  }, []);

  const backToGamePageHandler = () => {
    redirect("/game");
  };

  console.log(showRoomStatus);
  console.log(telegramUser?.id);

  return (
    <>
      <div>
        <div
          className={`${isTelegramWebAppStatus ? " flex flex-col justify-center items-center rotate-90 absolute top-14 origin-bottom -right-16 w-[100vh] h-[100vw]" : ""}`}
        >
          <div className={`${isTelegramWebAppStatus ? "absolute z-50 top-2 right-0" : ""}`}>
            <div
              onClick={backToGamePageHandler}
              className=" cursor-pointer my-3 mx-3 text-center buttonCoopRoom"
            >
              X
            </div>
          </div>
          {telegramUser?.id && !showRoomStatus && (
            <div>
              <div>
                <h1 className=" text-2xl text-center px-3 py-3">Список игровых серверов</h1>
              </div>
              {fetchAllGamesRoomsList === CoopGamesFetchStatus.Loading && (
                <div className=" py-6 text-center">
                  <FontAwesomeIcon className=" animate-spin fa-fw fa-2x" icon={faSpinner} />
                </div>
              )}
              {fetchAllGamesRoomsList === CoopGamesFetchStatus.Resolve &&
                allGamesRoomsList.length > 0 && <div>{roomsEl}</div>}
              {fetchAllGamesRoomsList === CoopGamesFetchStatus.Error && (
                <div className=" text-center bg-red-200 rounded-xl shadow-smallShadow">
                  {" "}
                  <h1 className=" text-2xl py-2 px-2">
                    {" "}
                    Не удалось получить список серверов. Повторите попытку позже
                  </h1>{" "}
                </div>
              )}
            </div>
          )}

          {showRoomStatus && <RoomComponentMain></RoomComponentMain>}
        </div>
      </div>
    </>
  );
};

export default RoomsListMain;
