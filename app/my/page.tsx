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
    // return (
    //   <div className="flex flex-col items-center my-32">
    //     <h1 className=" text-2xl my-5">Вы не зарегистрированы</h1>
    //     <Link
    //       className=" text-2xl my-5 hover:text-sky-700 hover:underline hover:underline-offset-4"
    //       href={`./login`}
    //     >
    //       Войти на сайт
    //     </Link>
    //   </div>
    // );
  }

  return (
    <>
      <Suspense fallback={"Загрузка..."}>
        {!session && (
          <div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        )}
        {session && <MyPage></MyPage>}
      </Suspense>
    </>
  );
};

export default My;
