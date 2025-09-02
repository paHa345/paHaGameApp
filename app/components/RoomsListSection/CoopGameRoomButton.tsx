import { ICoopGamesSlice } from "@/app/store/CoopGamesSlice";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

interface ICoopGameRoomProps {
  id: string;
  name: string;
  isStarted: boolean;
}

const CoopGameRoomButton = ({ id, name, isStarted }: ICoopGameRoomProps) => {
  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);

  // const joinRoomHandler = () => {
  //   socket?.emit("join_room", id);
  // };
  return (
    <>
      <Link href={`/wsGamesRoomList/${id}`}>
        <div className=" cursor-pointer my-3 mx-3 text-center buttonCoopRoom">
          <div>{name}</div>
          <div>{id}</div>
        </div>
      </Link>
    </>
  );
};

export default CoopGameRoomButton;
