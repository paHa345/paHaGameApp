import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import MyPage from "./../components/MyPageComponent/MyPage";
import { authOptions } from "../utils/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";

const My = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <Suspense fallback={"Загрузка..."}>
        <MyPage></MyPage>
      </Suspense>
    </>
  );
};

export default My;
