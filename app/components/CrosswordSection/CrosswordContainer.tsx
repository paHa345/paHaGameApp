import { Container } from "postcss";
import React from "react";

const CrosswordContainer = () => {
  const rowsCount = 10;
  const CrosswordTableEl = [];
  for (let i = 0; i < rowsCount; i++) {
    for (let j = 0; j < rowsCount; j++) {
      CrosswordTableEl.push(
        <div
          key={`${i}:${j}`}
          data-indexi={i}
          data-indexj={j}
          className=" flex items-center justify-center h-10 w-10 border-solid border-2 border-indigo-600"
        >
          {/* {`${i}:${j}`} */}
        </div>
      );
    }
  }

  return (
    <div className=" container w-[395px] pt-5 pb-5">
      <div className="grid grid-cols-10 gap-1">{CrosswordTableEl}</div>
    </div>
  );
};

export default CrosswordContainer;
