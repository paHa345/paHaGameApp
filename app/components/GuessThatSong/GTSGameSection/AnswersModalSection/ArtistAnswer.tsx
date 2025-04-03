import React from "react";

interface IArtistAnswerProps {
  text: string;
  artistAnswerID: string;
  isCorrect?: boolean;
}
const ArtistAnswer = ({ text, artistAnswerID, isCorrect }: IArtistAnswerProps) => {
  return (
    <div
      key={artistAnswerID}
      // ${isCorrect ? "to-green-200" : "to-red-200"}
      className={` cursor-pointer py-2 w-full bg-gradient-to-tr rounded-lg from-secoundaryColor
       
      shadow-audioControlsButtonShadow hover:shadow-audioControlsButtonHoverShadow `}
    >
      <h1 className=" text-2xl text-center">{text}</h1>
    </div>
  );
};

export default ArtistAnswer;
