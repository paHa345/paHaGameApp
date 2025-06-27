import React from "react";
import SelectGameButton from "./SelectGameButton";

const SelectGameButtonsMain = () => {
  const gamesNamesArr = [
    {
      name: "Кроссворд",
      color: "lime-200",
      nameEn: "Crossword",
    },
    {
      name: "Угадай мелодию",
      color: "cyan-200",
      nameEn: "GuessThatSong",
    },
    {
      name: "Авто викторина",
      color: "indigo-200",
      nameEn: "CarAudioFinancial",
    },
  ];

  const gamesEls = gamesNamesArr.map((game) => {
    return (
      <div key={game.name}>
        <SelectGameButton
          nameEn={game.nameEn}
          name={game.name}
          color={game.color}
        ></SelectGameButton>
      </div>
    );
  });

  return (
    <div className="">
      <h1 className=" text-2xl text-center px-3 py-3">Игры</h1>
      <div className=" flex justify-center items-center gap-4 flex-col sm:flex-row">{gamesEls}</div>
    </div>
  );
};

export default SelectGameButtonsMain;
