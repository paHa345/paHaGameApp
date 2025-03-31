import { AppDispatch } from "@/app/store";
import { GTSCreateGameActions, IGTSCreateGameSlice } from "@/app/store/GTSCreateGameSlice";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UploadImageMain = () => {
  const [addedImageURL, setAddedImageURL] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const updatedQuestionNumber = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.updatedQuestionNumber
  );

  const updateQuestionStatus = useSelector(
    (state: IGTSCreateGameSlice) => state.GTSCreateGameState.gameIsBeingUpdated
  );

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
    setAddedImageURL(objectURL);
    console.log(objectURL);
    console.log("Image checked");
  };

  const uploadImage = async () => {
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

      // setSongURL(() => {
      //   return uploadedFile.uploadedFileURL;
      // });

      console.log(uploadedFile);

      if (updateQuestionStatus) {
        console.log("updated");
        dispatch(
          GTSCreateGameActions.updateQuestionImageURL({
            updatedQuestion: updatedQuestionNumber,
            imageURL: uploadedFile.uploadedFileURL,
          })
        );
      } else {
        dispatch(GTSCreateGameActions.setImageURL(uploadedFile.uploadedFileURL));
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className=" my-3 px-1 py-2 shadow-exerciseCardShadow">
      <h1 className=" py-3 text-center text-xl">Изображение</h1>

      <input name="file" onChange={changeImageHandler} ref={inputFileRef} type="file" required />

      {addedImageURL && (
        <div className=" sm:w-2/5 w-4/5 justify-self-center pt-5 pb-5">
          <img src={`${addedImageURL}`} alt="" />
        </div>
      )}
      <div className=" flex justify-center items-center">
        <div
          // className=" flex justify-center items-center"
          className={` cursor-pointer py-3 my-3 px-3 mx-6 transition-all rounded-lg ease-in-out delay-50  bg-gradient-to-tr from-secoundaryColor to-lime-300 shadow-exerciseCardShadow hover:scale-110 hover:bg-gradient-to-tl hover:shadow-exerciseCardHowerShadow  `}
        >
          <div onClick={uploadImage}>Загрузить изображение</div>
        </div>
      </div>
    </div>
  );
};

export default UploadImageMain;
