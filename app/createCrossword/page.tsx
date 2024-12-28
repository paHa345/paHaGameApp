import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { redirect } from "next/navigation";
import CreateCrosswordMain from "../components/CreateCrosswordTableSection/CreateCrosswordMain";
import TransitionTemplate from "../components/TransitionTemplate";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }
  return (
    <TransitionTemplate>
      <CreateCrosswordMain></CreateCrosswordMain>
    </TransitionTemplate>
  );
};

export default page;
