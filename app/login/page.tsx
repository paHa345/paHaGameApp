import React from "react";
import LoginComponent from "../components/LoginSection/LoginComponent";
import { getServerSession } from "next-auth";
import { authOptions } from "../utils/authOptions";
import { redirect } from "next/navigation";

const login = async () => {
  const session = await getServerSession(authOptions);
  console.log(session?.user?.name);

  if (session) {
    redirect("/my");
  }
  return (
    <div>
      <LoginComponent></LoginComponent>
    </div>
  );
};

export default login;
