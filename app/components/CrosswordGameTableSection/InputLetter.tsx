import React, { useState } from "react";

const InputLetter = () => {
  const [letter, setLetter] = useState("");

  const changeCurrentLetterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLetter(e.currentTarget.value);
  };
  return (
    <div>
      <input
        style={{ right: "-5px", bottom: "0px" }}
        className=" inputBase bg-orange-500 h-6 w-6 text-slate-50 text-3xl font-extrabold"
        type="text"
        maxLength={1}
        value={letter}
        onChange={changeCurrentLetterHandler}
      />
    </div>
  );
};

export default InputLetter;
