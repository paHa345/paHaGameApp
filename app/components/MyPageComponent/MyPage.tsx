"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { IWorkout } from "@/app/types";
import { AppDispatch } from "@/app/store";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faXmark, faChessBoard } from "@fortawesome/free-solid-svg-icons";

import MyPageNotification from "./MyPageNotification";

const MyPage = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   dispatch(setCurrentUserWorkouts());
  //   dispatch(setCurrentUserInState());
  // }, []);

  const greeting =
    session?.user.userType === "coach" ? (
      <h1 className=" text-right text-4xl font-bold py-10">
        {" "}
        {`Привет, тренер ${session?.user?.name}`}{" "}
      </h1>
    ) : (
      <h1 className=" text-right text-4xl font-bold py-10"> {`Привет, ${session?.user?.name}`} </h1>
    );

  return (
    <>
      {/* <MyPageNotification></MyPageNotification> */}

      <section className=" h-[70vh] container mx-auto">
        <div>
          {session?.user?.name ? (
            greeting
          ) : (
            <h1 className=" animate-pulse h-20 bg-slate-200 rounded mt-4 text-center text-2xl font-bold pb-6"></h1>
          )}
        </div>
        <div>
          {" "}
          <button className=" my-5" onClick={() => signOut({ callbackUrl: "/login" })}>
            Выйти
          </button>
        </div>

        <div className=" py-5">
          <Link className=" buttonStandart" rel="stylesheet" href="/createCrossword">
            <span>
              <FontAwesomeIcon className=" pr-3 fa-fw" icon={faChessBoard} />
            </span>
            Создание кроссворда
          </Link>
        </div>
      </section>
    </>
  );
};

export default MyPage;
