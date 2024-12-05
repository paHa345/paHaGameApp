import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import MyPage from "./../components/MyPageComponent/MyPage";
import { authOptions } from "../utils/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const My = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <Suspense
        fallback={
          <>
            <div className=" min-h-[70vh] py-6">
              <div className="flex justify-center items-center">
                <div className=" pt-10 flex flex-col justify-center items-center">
                  <h1 className=" py-5 text-2xl text-center font-bold">Страница загружается ...</h1>
                  <FontAwesomeIcon className=" animate-spin fa-fw fa-2x" icon={faSpinner} />
                </div>
              </div>
            </div>
          </>
        }
      >
        <MyPage></MyPage>
      </Suspense>
    </>
  );
};

export default My;
