import { AppDispatch } from "@/app/store";
import { IAppSlice } from "@/app/store/appStateSlice";
import { CoopGameMessageType, CoopGamesActions, ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface ICoopGameRoomProps {
  id: string;
  name: string;
  isStarted: boolean;
}

const CoopGameRoomButton = ({ id, name, isStarted }: ICoopGameRoomProps) => {
  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);
  const dispatch = useDispatch<AppDispatch>();

  const joinRoomHandler = () => {
    socket?.emit("join_room", { roomID: id, telegramUser, type: CoopGameMessageType.notification });
    dispatch(CoopGamesActions.setShowRoomStatus(true));
    dispatch(CoopGamesActions.setCurrentJoinedRoomID(id));
  };
  return (
    <>
      <div>
        <div
          onClick={joinRoomHandler}
          className=" cursor-pointer my-3 mx-3 text-center buttonCoopRoom"
        >
          <div>{name}</div>
          <div>{id}</div>
        </div>
      </div>
    </>
  );
};

export default CoopGameRoomButton;
