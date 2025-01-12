import { PutBlobResult } from "@vercel/blob";
import React, { useRef, useState } from "react";

const UploadSongMain = () => {
  const [addedSongURL, setAddedSongURL] = useState<string | undefined>(
    undefined
  );

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
    if (inputFileRef.current?.files[0].size > 1000000) {
      //   setAddImageNotification("Слишком большой объём выбранного изображения");
      console.log("Too big");
      return;
    }

    const objectURL = URL.createObjectURL(e.target.files[0]);
    // console.log(objectURL);
    setAddedSongURL(objectURL);
    // setAddImageNotification("Изображение добавлено");
    console.log("Песня добавлена");
    // console.log(addedExerciseImage);
  };

  const uploadSong = async () => {
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    // /api/upload?filename=${file.name}

    const response = await fetch(
      `/api/guessThatSong/uploadSong?filename=${file.name}`,
      {
        method: "POST",
        body: file,
      }
    );

    const newBlob = (await response.json()) as PutBlobResult;

    console.log(newBlob.url);
    setBlob(() => {
      return newBlob;
    });
    setSongURL(() => {
      return newBlob.url;
    });
  };

  return (
    <div>
      <h1 className=" text-center text-3xl py-8">Угадай мелодию</h1>
      <input
        name="file"
        onChange={changeImageHandler}
        ref={inputFileRef}
        type="file"
        required
      />
      {addedSongURL && (
        <div className=" sm:w-2/5 w-4/5 justify-self-center pt-5 pb-5">
          <audio
            // onEnded={endSongHandler}
            // onLoadedMetadata={onLoadedMetadata}
            // ref={audioRef}
            controls
            src={addedSongURL}
          ></audio>
        </div>
      )}
      <button onClick={uploadSong}>Load Song</button>
      <br />
      <br />
      <div></div>
    </div>
  );
};

export default UploadSongMain;