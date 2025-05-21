import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import {
  faA,
  faArrowTrendDown,
  faB,
  faCirclePlus,
  faCut,
  faEdit,
  faLinkSlash,
  faMinusCircle,
  faMusic,
  faPauseCircle,
  faPlayCircle,
  faPlusCircle,
  faVolumeHigh,
  faVolumeLow,
  faVolumeOff,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector } from "react-redux";

interface IAddedSongControlsProps {
  peaksAudioRef: React.RefObject<HTMLMediaElement>;
}

const AddedSongControlButtons = ({ peaksAudioRef }: IAddedSongControlsProps) => {
  //   const songVolume = useSelector(
  //     (state: IGuessThatSongSlice) => state.guessThatSongState.songVolume
  //   )
  return (
    <div>
      {/* <div className=" flex items-center justify-center flex-col">
        <div className=" flex justify-around items-stretch gap-6 pt-5">
          {peaksAudioRef?.current?.volume !== undefined && (
            <div className=" flex justify-end items-center flex-row gap-5">
              <div
                style={{
                  background: `linear-gradient(to top right, rgba(132, 204, 22, ${songVolume < 20 ? 0.2 : songVolume / 100} ),#E7F9FF )`,
                }}
                className=" py-1 px-1 flex-none cursor-pointer w-fit border-1 border-solid border-stone-200 rounded-xl bg-gradient-to-tr from-secoundaryColor to-cyan-100"
                // onClick={muteSongValueHandler}
              >
                {isSongMuted && <FontAwesomeIcon className="fa-fw fa-2x" icon={faVolumeXmark} />}
                {songVolume > 80 && !isSongMuted && (
                  <FontAwesomeIcon className="fa-fw fa-2x" icon={faVolumeHigh} />
                )}
                {songVolume < 20 && !isSongMuted && (
                  <FontAwesomeIcon className="fa-fw fa-2x" icon={faVolumeOff} />
                )}
                {songVolume >= 20 && songVolume <= 80 && !isSongMuted && (
                  <FontAwesomeIcon className="fa-fw fa-2x" icon={faVolumeLow} />
                )}
              </div>
              <div className=" grow">
                <input
                  style={{
                    background: `linear-gradient(to right, rgba(132, 204, 22, ${songVolume < 20 ? 0.2 : songVolume / 100} ) ${songVolume}%, #ccc ${songVolume}%)`,
                  }}
                  className=" volume-slider cursor-pointer h-1 rounded-md w-full border-1 border-solid border-stone-600"
                  type="range"
                  min={0}
                  max={100}
                  value={songVolume}
                  onChange={changeVolumeHandler}
                />
              </div>{" "}
            </div>
          )}
        </div>

        <div className=" flex justify-around items-stretch gap-6 pt-5">
          <div className=" flex justify-center items-center gap-6 py-5">
            {editedSongIsPlaying ? (
              <div onClick={onPause}>
                <FontAwesomeIcon
                  icon={faPauseCircle}
                  className="fa-fw fa-2x cursor-pointer rounded-full hover:shadow-exerciseCardHowerShadow"
                ></FontAwesomeIcon>
              </div>
            ) : (
              <div className=" rounded-3xl" onClick={onPlay}>
                <FontAwesomeIcon
                  icon={faPlayCircle}
                  className="fa-fw fa-2x cursor-pointer rounded-full hover:shadow-exerciseCardHowerShadow"
                ></FontAwesomeIcon>
              </div>
            )}
          </div>

          <div className=" flex justify-center items-center gap-6 py-5">
            <div onClick={zoomInHandler}>
              <FontAwesomeIcon
                icon={faPlusCircle}
                className=" cursor-pointer fa-fw fa-2x rounded-full hover:shadow-exerciseCardHowerShadow"
              ></FontAwesomeIcon>
            </div>
            <div onClick={zoomOutHandler}>
              <FontAwesomeIcon
                icon={faMinusCircle}
                className=" cursor-pointer fa-fw fa-2x rounded-full hover:shadow-exerciseCardHowerShadow"
              ></FontAwesomeIcon>
            </div>
          </div>
          <div>
            <div className=" flex justify-center items-center gap-6 py-5">
              <div>
                <FontAwesomeIcon
                  onClick={setAPointHandler}
                  icon={faA}
                  className=" cursor-pointer fa-fw hover:shadow-exerciseCardHowerShadow"
                ></FontAwesomeIcon>
              </div>
              <div>
                <FontAwesomeIcon
                  onClick={setBPointHandler}
                  icon={faB}
                  className=" cursor-pointer fa-fw hover:shadow-exerciseCardHowerShadow"
                ></FontAwesomeIcon>
              </div>
              {!editedSegmantIsCreated && (
                <div>
                  <FontAwesomeIcon
                    onClick={editAudioFileHandler}
                    icon={faEdit}
                    className={` ${pointsStatus.finish && pointsStatus.start && "cursor-pointer text-zinc-900 hover:shadow-exerciseCardHowerShadow"}  text-zinc-200 fa-fw fa-2x `}
                  ></FontAwesomeIcon>
                </div>
              )}
              {editedSegmantIsCreated && (
                <div>
                  <FontAwesomeIcon
                    onClick={deleteEditedSegmantHandler}
                    icon={faLinkSlash}
                    className={` cursor-pointer text-zinc-900 hover:shadow-exerciseCardHowerShadow fa-fw fa-2x `}
                  ></FontAwesomeIcon>
                </div>
              )}
              <div>
                <FontAwesomeIcon
                  onClick={cutSongHandler}
                  icon={faCut}
                  className=" cursor-pointer fa-fw fa-2x hover:shadow-exerciseCardHowerShadow"
                ></FontAwesomeIcon>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex justify-around items-stretch gap-6 pt-5">
          <div>
            <FontAwesomeIcon
              onClick={volumeLowHandler}
              icon={faVolumeLow}
              className=" cursor-pointer fa-fw fa-2x hover:shadow-exerciseCardHowerShadow"
            ></FontAwesomeIcon>
          </div>
          <div>
            <FontAwesomeIcon
              onClick={volumeHighHandler}
              icon={faVolumeHigh}
              className=" cursor-pointer fa-fw fa-2x hover:shadow-exerciseCardHowerShadow"
            ></FontAwesomeIcon>
          </div>

          <div>
            <FontAwesomeIcon
              onClick={afadeFromLowToHighHandler}
              icon={faArrowTrendUp}
              className=" cursor-pointer fa-fw fa-2x hover:shadow-exerciseCardHowerShadow"
            ></FontAwesomeIcon>
          </div>
          <div>
            <FontAwesomeIcon
              onClick={afadeFromHighToLowHandler}
              icon={faArrowTrendDown}
              className=" cursor-pointer fa-fw fa-2x hover:shadow-exerciseCardHowerShadow"
            ></FontAwesomeIcon>
          </div>
          <div
            onClick={addOptionalAudioComponentHandler}
            className=" buttonStandart fa-fw cursor-pointer rounded-full hover:shadow-exerciseCardHowerShadow"
          >
            <FontAwesomeIcon
              // onClick={afadeFromHighToLowHandler}
              icon={faCirclePlus}
              // className=" cursor-pointer hover:shadow-exerciseCardHowerShadow"
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              // onClick={afadeFromHighToLowHandler}
              icon={faMusic}
              className=" fa-fw"
            ></FontAwesomeIcon>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AddedSongControlButtons;
