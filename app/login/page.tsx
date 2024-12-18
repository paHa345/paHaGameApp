import React from "react";
import LoginComponent from "../components/LoginSection/LoginComponent";
import { getServerSession } from "next-auth";
import { authOptions } from "../utils/authOptions";
import { redirect } from "next/navigation";
import TransitionTemplate from "@/app/components/TransitionTemplate";

const login = async () => {
  const session = await getServerSession(authOptions);
  console.log(session?.user?.name);

  if (session) {
    redirect("/my");
  }
  return (
    <TransitionTemplate>
      <div>
        <LoginComponent></LoginComponent>
      </div>
    </TransitionTemplate>
  );
};

export default login;
