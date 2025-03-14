import { AppDispatch } from "@/app/store";
import { IAppSlice } from "@/app/store/appStateSlice";
import { attemptsActions, getAllGamesList, IAttemptsSlice } from "@/app/store/attemptsSlice";
import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface ISelectedGameButtonProps {
  name: string;
  color: string;
  nameEn: string;
}
const SelectGameButton = ({ name, color, nameEn }: ISelectedGameButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const telegramUser = useSelector((state: IAppSlice) => state.appState.telegranUserData);

  const selectedGamesNames = useSelector(
    (state: IAttemptsSlice) => state.attemptsState.selectedGamesName
  );

  const selectGameButtonHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(attemptsActions.setSelectedGamesName(nameEn));
    dispatch(getAllGamesList({ telegramID: telegramUser?.id, page: 1, gamesName: nameEn }));
  };

  return (
    <div>
      <div
        onClick={selectGameButtonHandler}
        // ${loadCrosswordGameStatus === crosswordGameFetchStatus.Ready ? "cursor-pointer" : ""}
        className={` cursor-pointer 
     w-11/12 px-4 mx-4 ${selectedGamesNames === nameEn ? " scale-110 shadow-crosswordGameCellMenuButtonActive" : "shadow-smallShadow"} sm:hover:scale-105 transition-all  rounded-lg ease-in-out duration-300 hover:bg-gradient-to-tl bg-gradient-to-tr from-secoundaryColor to-${color} sm:hover:shadow-crosswordGameCellMenuButtonActive`}
      >
        <div className=" flex flex-col">
          <div className=" flex flex-col gap-2">
            <div className=" flex flex-col justify-center items-center">
              <h1 className=" text-center grow text-base text font-bold pl-1 py-1 my-1 sm:py-2 sm:my-2">
                {name}
              </h1>
            </div>
            <div className=" flex flex-row justify-around"></div>
          </div>
          <div className=" flex flex-row justify-center"></div>
          <div className=" flex flex-col"></div>
        </div>
      </div>
    </div>
  );
};

export default SelectGameButton;
