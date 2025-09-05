import { AppDispatch } from "@/app/store";
import { IAppSlice } from "@/app/store/appStateSlice";
import { CoopGamesActions, ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RoomComponentMain = () => {
  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);
  const currentJoinedRoomID = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.currentJoinedRoomID
  );
  const messagesArr = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.messagesArr);
  const [message, setMessage] = useState("");

  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  const dispatch = useDispatch<AppDispatch>();

  const leaveRoomHandler = () => {
    socket?.emit("leave_room", currentJoinedRoomID);
    dispatch(CoopGamesActions.setShowRoomStatus(false));
    dispatch(CoopGamesActions.setCurrentJoinedRoomID(undefined));
    socket?.emit("disconnectServer");
    dispatch(CoopGamesActions.setSocket(undefined));
  };

  const messagesEl = messagesArr.map((message, index) => {
    return (
      <div key={`${index}_${message}`}>
        <h1>{message}</h1>
      </div>
    );
  });

  const changeMessageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendRoomMessageHandler = () => {
    console.log(socket);
    if (socket) {
      socket.emit("GTSGameRoomMessage", { message, currentJoinedRoomID });
    }
  };

  useEffect(() => {
    socket?.on("send-message", (message) => {
      dispatch(CoopGamesActions.addMessageInArr(message));
    });

    socket?.on("roomGTSGameMessage", (message: string) => {
      console.log(message);
      dispatch(CoopGamesActions.addMessageInArr(message));
    });
  }, [socket]);

  return (
    <>
      <div>
        {" "}
        <div onClick={leaveRoomHandler}>
          <h1>Покинуть сервер</h1>
        </div>
      </div>
      <div>
        <h1 className=" px-3 py-3 text-2xl text-center">
          {" "}
          Вы зашли на сервер с ID {currentJoinedRoomID}{" "}
        </h1>

        <div>
          <h1>ID: {telegramUser?.id}</h1>
          <h1>Имя: {telegramUser?.username}</h1>
        </div>

        <div className=" py-5">{messagesEl}</div>

        <div className=" flex justify-center items-center gap-4 flex-col py-5">
          <div className=" px-3 py-3 border-2 border-spacing-1 border-slate-500 border-solid flex justify-center items-center gap-4">
            <input
              className=" border-2 border-spacing-1 border-slate-300 border-solid"
              type="text"
              placeholder="Text here"
              value={message}
              onChange={changeMessageHandler}
            />
            <button className="buttonStudent" onClick={sendRoomMessageHandler}>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomComponentMain;
