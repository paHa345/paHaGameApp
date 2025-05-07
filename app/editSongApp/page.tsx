import React from "react";
import EditSongAppMain from "../components/EditSongAppSection/EditSongAppMain";
import { getServerSession } from "next-auth";
import { authOptions } from "../utils/authOptions";

const page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <EditSongAppMain></EditSongAppMain>
    </div>
  );
};

export default page;
