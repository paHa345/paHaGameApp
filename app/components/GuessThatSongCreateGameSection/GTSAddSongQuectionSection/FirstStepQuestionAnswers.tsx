import React from "react";
import UploadSongMain from "../UploadSongSection/UploadSongMain";
import AddMainQuestion from "./AddMainQuestion";

const FirstStepQuestionAnswers = () => {
  return (
    <div>
      <div>
        <UploadSongMain></UploadSongMain>
      </div>
      <AddMainQuestion></AddMainQuestion>
    </div>
  );
};

export default FirstStepQuestionAnswers;
