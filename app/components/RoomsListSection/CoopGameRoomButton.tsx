import Link from "next/link";
import React from "react";

interface ICoopGameRoomProps {
  id: string;
  name: string;
  isStarted: boolean;
}

const CoopGameRoomButton = ({ id, name, isStarted }: ICoopGameRoomProps) => {
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
