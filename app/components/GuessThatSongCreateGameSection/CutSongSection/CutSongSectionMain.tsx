"use client";

import { PutBlobResult } from "@vercel/blob";
import React, { useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import Ffmpeg from "fluent-ffmpeg";

const CutSongSectionMain = () => {
  const [addedExerciseImage, setAddedExerciseImage] = useState<string | undefined>(undefined);

  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [songURL, setSongURL] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const changeImageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (!inputFileRef.current?.files) {
      return;
    }
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    console.log(inputFileRef.current?.files[0].size);
    if (inputFileRef.current?.files[0].size > 10000000) {
      //   setAddImageNotification("Слишком большой объём выбранного изображения");
      console.log("Too big");
      return;
    }

    const objectURL = URL.createObjectURL(e.target.files[0]);
    // console.log(objectURL);
    setAddedExerciseImage(objectURL);
    // setAddImageNotification("Изображение добавлено");
    console.log("Изображение добавлено");
    console.log(addedExerciseImage);
  };

  const uploadSong = async () => {
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    // /api/upload?filename=${file.name}

    const response = await fetch(`/api/guessThatSong/uploadSong?filename=${file.name}`, {
      method: "POST",
      body: file,
    });

    const newBlob = (await response.json()) as PutBlobResult;

    console.log(newBlob.url);
    setBlob(() => {
      return newBlob;
    });
    setSongURL(() => {
      return newBlob.url;
    });
    // dispatch(addExerciseActions.changeUploadedImage(newBlob.url));

    //это простой пример загрузки изображения на локальный сервер
    //
    // if (!file) return;

    // try {
    //   const data = new FormData();
    //   data.append("file", file, `${image}`);
    //   const res = await fetch("/api/upload", {
    //     method: "POST",
    //     body: data,
    //   });

    //   if (!res.ok) throw new Error(await res.text());
    // } catch (error: any) {
    //   console.log(error.message);
    // }
    //
    //
  };

  const inputSongFileRef = useRef<HTMLInputElement>(null);
  const [currentSongFile, setCurrentSongFile] = useState<string | undefined>(undefined);

  const changeSongFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);

    if (!inputSongFileRef.current?.files) {
      return;
    }
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    console.log(inputSongFileRef.current?.files[0].size);
    if (inputSongFileRef.current?.files[0].size > 10000000) {
      //   setAddImageNotification("Слишком большой объём выбранного изображения");
      console.log("Too big");
      return;
    }

    const objectURL = URL.createObjectURL(e.target.files[0]);
    console.log(objectURL);
    setCurrentSongFile(objectURL);
    // setAddImageNotification("Изображение добавлено");
    console.log("Изображение добавлено");
    setTimeout(() => {
      console.log(currentSongFile);
    }, 2000);
  };

  const cutSongFileHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!inputSongFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputSongFileRef.current.files[0];
    const formData = new FormData();
    formData.append("video", file);

    const response = await fetch(`/api/guessThatSong/cutSongFile?filename=${file.name}`, {
      method: "POST",
      body: formData,
    });
  };

  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLAudioElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const load = async () => {
    setIsLoading(true);
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    setLoaded(true);
    setIsLoading(false);
  };

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;
    // u can use 'https://ffmpegwasm.netlify.app/video/video-15s.avi' to download the video to public folder for testing
    await ffmpeg.writeFile(
      "input.mp3",
      await fetchFile(
        "https://rhjm8idplsgk4vxo.public.blob.vercel-storage.com/Black_Sabbath_-_Neon_Knights_47956657%20(mp3cut.net)%20(1)-nhJQzS1b82iivf0MP7Nnw1fNnPfe0l.mp3"
      )
    );
    await ffmpeg.exec([
      "-i",
      // "input.avi",
      // "-vf",
      // "scale=144:-1",
      // "-c:a",
      // "aac",
      // "-strict",
      // "-2",
      // "output.mp4",

      "input.mp3",
      "-ss",
      "1", // Start at 1 second

      "output.mp3",
    ]);
    const data = (await ffmpeg.readFile("output.mp3")) as any;
    if (videoRef.current)
      videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: "audio" }));
  };

  return (
    <div>
      <h1 className=" text-center text-3xl py-8">Угадай мелодию</h1>
      <input name="file" onChange={changeImageHandler} ref={inputFileRef} type="file" required />
      {addedExerciseImage && (
        <div className=" sm:w-2/5 w-4/5 justify-self-center pt-5 pb-5">
          <img
            className=" w-full"
            src={addedExerciseImage}
            alt={addedExerciseImage}
            width={200}
            height={200}
          />
        </div>
      )}
      <button onClick={uploadSong}>Load Song</button>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div>
        <div onClick={cutSongFileHandler} className=" my-5 w-fit cursor-pointer buttonStandart ">
          <h1 className=" text-2xl py-2 ">Обрезать песню</h1>
        </div>
        <input
          name="file"
          accept="video/*"
          // onChange={changeSongFileHandler}
          ref={inputSongFileRef}
          type="file"
          required
        />
      </div>
      <br />
      <br />
      <br />
      <br />
      {loaded ? (
        <div className="">
          <audio ref={videoRef} controls></audio>
          <br />
          <button
            onClick={transcode}
            className="bg-green-500 hover:bg-green-700 text-white py-3 px-6 rounded"
          >
            Transcode avi to mp4
          </button>
          <p ref={messageRef}></p>
        </div>
      ) : (
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          onClick={load}
        >
          Load ffmpeg-core
          {isLoading && <span className="animate-spin ml-3"></span>}
        </button>
      )}
    </div>
  );
};

export default CutSongSectionMain;
