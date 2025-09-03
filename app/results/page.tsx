import React, { Suspense } from "react";
import ResultsSectionMain from "../components/ResultsSection/ResultsSectionMain";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import TransitionTemplate from "@/app/components/TransitionTemplate";
import Link from "next/link";

const page = () => {
  return (
    <>
      {" "}
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
        <TransitionTemplate>
          <div className=" text-xl py-3 font-semibold">
            <Link href={"/wsGamesRoomList"}>Список игровых серверов</Link>
          </div>
          <ResultsSectionMain></ResultsSectionMain>
        </TransitionTemplate>
      </Suspense>{" "}
    </>
  );
};

export default page;
