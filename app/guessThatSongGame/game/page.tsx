import GTSGameSectionMain from "@/app/components/GuessThatSong/GTSGameSection/GTSGameSectionMain";
import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Suspense } from "react";
import { useSelector } from "react-redux";

const page = () => {
  return (
    <>
      <Suspense
        fallback={
          <>
            <div className=" min-h-[70vh] py-6">
              <div className="flex justify-center items-center">
                <div className=" pt-10 flex flex-col justify-center items-center">
                  <h1 className=" py-5 text-2xl text-center font-bold">Страница загружается ...</h1>
                  <FontAwesomeIcon className=" animate-spin fa-fw fa-2x" icon={faSpinner} />
                </div>
              </div>
            </div>
          </>
        }
      >
        {/* <TransitionTemplate> */}
        {/* <CrosswordGameTableMain></CrosswordGameTableMain> */}
        <GTSGameSectionMain></GTSGameSectionMain>
        {/* </TransitionTemplate> */}
      </Suspense>
    </>
  );
};
export default page;
