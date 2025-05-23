"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { useS3Upload } from "next-s3-upload";

import { IWorkout } from "@/app/types";
import { AppDispatch } from "@/app/store";

import { S3Client, PutObjectCommand, S3 } from "@aws-sdk/client-s3";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencil,
  faXmark,
  faChessBoard,
  faHeadphonesAlt,
  faSliders,
  faSlidersH,
} from "@fortawesome/free-solid-svg-icons";

import MyPageNotification from "./MyPageNotification";
import { crosswordActions } from "@/app/store/crosswordSlice";
import AudioVisualiserMain from "../GuessThatSong/GTSGameSection/AudioVisualiserSection/AudioVisualiserMain";
import CutSongSectionMain from "../GuessThatSongCreateGameSection/CutSongSection/CutSongSectionMain";
import { isTelegramWebApp } from "../Layout/MainLayout";
import { postEvent } from "@telegram-apps/sdk-react";
import { openLink } from "@telegram-apps/sdk";
import { init } from "@telegram-apps/sdk";
import { div } from "framer-motion/client";

const MyPage = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   dispatch(setCurrentUserWorkouts());
  //   dispatch(setCurrentUserInState());
  // }, []);

  // const [file, setFile] = useState<File | null>(null);
  // const [message, setMessage] = useState("");

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   const res = await fetch("/api/uploadTimeweb", {
  //     method: "POST",
  //     body: formData,
  //   });

  //   if (res.ok) {
  //     setMessage("File uploaded successfully!");
  //   } else {
  //     setMessage("Failed to upload file.");
  //   }
  // };

  const greeting =
    session?.user.userType === "coach" ? (
      <h1 className=" text-right text-4xl font-bold py-10">
        {" "}
        {`Приветствуем, ${session?.user?.name}`}{" "}
      </h1>
    ) : (
      <h1 className=" text-right text-4xl font-bold py-10">
        {" "}
        {`Приветствуем, ${session?.user?.name}`}{" "}
      </h1>
    );

  const tgBrowserRedirectHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (openLink.isAvailable()) {
      openLink("https://paha-game-app.vercel.app/editSongApp", {
        tryBrowser: "chrome",
        tryInstantView: false,
      });
    }
  };

  useEffect(() => {
    const createdCrossword = localStorage.getItem("createdCrossword");
    const crosswordName = localStorage.getItem("crosswordName");
    const crosswordValue = localStorage.getItem("crosswordValue");
    const crosswordId = localStorage.getItem("crosswordId");
    if (
      createdCrossword !== null &&
      crosswordName !== null &&
      crosswordValue !== null &&
      crosswordId !== null
    ) {
      dispatch(crosswordActions.setCreatedCrossword(JSON.parse(createdCrossword)));
      dispatch(crosswordActions.setCrosswordName(JSON.parse(crosswordName)));
      dispatch(crosswordActions.setCrosswordValue(JSON.parse(crosswordValue)));
      dispatch(crosswordActions.setCrosswordId(JSON.parse(crosswordId)));
      dispatch(crosswordActions.crosswordIsLoading(true));
    }
    if (isTelegramWebApp()) {
      init();
    }
  });

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
        <div className=" py-5">
          <Link className=" buttonStandart" rel="stylesheet" href="/createGuessThatSong">
            <span>
              <FontAwesomeIcon className=" pr-3 fa-fw" icon={faHeadphonesAlt} />
            </span>
            Создание игры 'Угадай мелодию'
          </Link>
        </div>
        {isTelegramWebApp() ? (
          <div>
            <div
              // onClick={goToAudioEditAppHandler}
              className=" py-5"
            >
              <div className=" buttonStandart">
                <div onClick={tgBrowserRedirectHandler}>
                  <span>
                    <FontAwesomeIcon className=" pr-3 fa-fw" icon={faSliders} />
                  </span>
                  Приложение редактирования аудио
                </div>
              </div>
            </div>
          </div>
        ) : (
          // <AudioVisualiserMain></AudioVisualiserMain>
          <div className=" py-5">
            <Link className=" buttonStandart" rel="stylesheet" href={"/editSongApp"}>
              <span>
                <FontAwesomeIcon className=" pr-3 fa-fw" icon={faSlidersH} />
              </span>{" "}
              Приложение редактирования аудио
            </Link>
          </div>
        )}

        {/* <CutSongSectionMain></CutSongSectionMain> */}
        {/* <form onSubmit={handleSubmit}>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button type="submit">Upload</button>
          {message && <p>{message}</p>}
        </form> */}
      </section>
    </>
  );
};

export default MyPage;
