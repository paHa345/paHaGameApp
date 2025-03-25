import { AppDispatch } from "@/app/store";
import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import { PutBlobResult } from "@vercel/blob";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UploadSongMain = () => {
  const [addedSongURL, setAddedSongURL] = useState<string | undefined>(undefined);

  const updateQuestionStatus = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.gameIsBeingUpdated
  );
  const updatedQuestionNumber = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.updatedQuestionNumber
  );
  const currentAddedGame = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.createdGTSGame
  );

  const dispatch = useDispatch<AppDispatch>();

  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [songURL, setSongURL] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  const changeImageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (!inputFileRef.current?.files) {
      return;
    }
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    console.log(inputFileRef.current?.files[0].size);
    if (inputFileRef.current?.files[0].size > 3000000) {
      //   setAddImageNotification("Слишком большой объём выбранного изображения");
      console.log("Too big");
      return;
    }

    const objectURL = URL.createObjectURL(e.target.files[0]);
    setAddedSongURL(objectURL);
    console.log("Песня добавлена");
  };

  const uploadSong = async () => {
    try {
      if (inputFileRef.current?.files?.length === 0) {
        throw new Error("No file selected");
      }
      if (!inputFileRef.current?.files) {
        throw new Error("No file selected");
      }

      const file = inputFileRef.current.files[0];

      console.log(file);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploadTimeweb", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("File uploaded successfully!");
      } else {
        setMessage("Failed to upload file.");
      }

      const uploadedFile = await res.json();

      setSongURL(() => {
        return uploadedFile.uploadedFileURL;
      });

      console.log(uploadedFile);

      if (updateQuestionStatus) {
        console.log("updated");
        dispatch(
          GTSCreateGameActions.updateQuestionSongURL({
            updatedQuestion: updatedQuestionNumber,
            songURL: uploadedFile.uploadedFileURL,
          })
        );
      } else {
        dispatch(GTSCreateGameActions.setSongURL(uploadedFile.uploadedFileURL));
      }
    } catch (error: any) {
      console.log(error.message);
    }

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
  };

  const uploadSongForVercelBlob = async () => {
    try {
      if (inputFileRef.current?.files?.length === 0) {
        throw new Error("No file selected");
      }
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

      console.log(updateQuestionStatus);

      if (updateQuestionStatus) {
        console.log("updated");
        dispatch(
          GTSCreateGameActions.updateQuestionSongURL({
            updatedQuestion: updatedQuestionNumber,
            songURL: newBlob.url,
          })
        );
      } else {
        dispatch(GTSCreateGameActions.setSongURL(newBlob.url));
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div>
      {/* <h1 className=" text-center text-3xl py-8">Угадай мелодию</h1> */}

      <input name="file" onChange={changeImageHandler} ref={inputFileRef} type="file" required />
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
      <div className=" flex justify-center items-center">
        <div
          // className=" flex justify-center items-center"
          className={` cursor-pointer py-3 my-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
        >
          <div onClick={uploadSong}>Загрузить песню</div>
        </div>
      </div>
      <br />
      <br />
      <div></div>
    </div>
  );
};

export default UploadSongMain;
