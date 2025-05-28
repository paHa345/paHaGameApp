import { AppDispatch } from "@/app/store";
import {
  EditSongAppSlice,
  EditSongAppStateActions,
  IEditSongAppSlice,
} from "@/app/store/EditSongAppSlice";
import {
  faCircleXmark,
  faCross,
  faDownload,
  faFileCirclePlus,
  faPauseCircle,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Peaks from "peaks.js";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddedSongControlButtons from "./AddedSongControlButtons";
import NotificationEditSongMain from "./NotificationEditSongMain";
import FileSaver from "file-saver";
import NotificationDeleteOptionalSongModal from "./NotificationDeleteOptionalSongModal";

interface IAddOptionalAudioProps {
  value: number;
}

const AddedOptionalSongMain = ({ value }: IAddOptionalAudioProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const peaksAudioRef2 = useRef<HTMLMediaElement>(null);

  const peaksInstance = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.addeOptionalAudioValue[value].peaksInstance
  );

  const songVolume = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.addeOptionalAudioValue[value].songVolume
  );

  const isSongMuted = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.addeOptionalAudioValue[value].isSongMuted
  );

  const showNotificationModal = useSelector(
    (state: IEditSongAppSlice) =>
      state.EditSongAppState.addeOptionalAudioValue[value].showNotificationModal
  );

  const editedSongURL = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.addeOptionalAudioValue[value].editedSongURL
  );
  const editedSongName = useSelector(
    (state: IEditSongAppSlice) =>
      state.EditSongAppState.addeOptionalAudioValue[value].editedSongName
  );
  const editedSongData = useSelector(
    (state: IEditSongAppSlice) =>
      state.EditSongAppState.addeOptionalAudioValue[value].editedSongData
  );

  const endPeakSongHandler = () => {
    dispatch(
      EditSongAppStateActions.setOptionalAudioSongIsPlayingStatus({
        value: value,
        editedSongIsPlaying: false,
      })
    );
  };

  const changePeaks2FileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    try {
      dispatch(
        EditSongAppStateActions.setOptionalSongshowNotificationModalStatus({
          value: value,
          status: true,
        })
      );

      const audioElement = peaksAudioRef2.current;

      if (audioElement) {
        // audioElement.crossOrigin = "anonymous";

        var files = e.target.files;
        audioElement.src = URL.createObjectURL(files[0]);

        dispatch(
          EditSongAppStateActions.setOptionalSongEditedSongBlobString({
            value: value,
            blobString: URL.createObjectURL(files[0]),
          })
        );

        dispatch(
          EditSongAppStateActions.setOptionalSongEditedSongName({
            value: value,
            editedSongName: files[0].name,
          })
        );

        const options2 = {
          mediaUrl: URL.createObjectURL(files[0]),
          webAudio: {
            audioContext: new AudioContext(),
            multiChannel: true,
          },
        };

        if (peaksInstance?.player?.play()) {
          peaksInstance.player?.pause();
          dispatch(
            EditSongAppStateActions.setOptionalAudioSongIsPlayingStatus({
              value: value,
              editedSongIsPlaying: false,
            })
          );
        }
        if (peaksInstance?.segments) {
          peaksInstance?.segments?.removeAll();
        }

        if (peaksInstance?.points) {
          peaksInstance?.points?.removeAll();
        }

        if (peaksInstance) {
          peaksInstance?.setSource(options2, function (error: Error) {
            dispatch(
              EditSongAppStateActions.setOptionalSongshowNotificationModalStatus({
                value: value,
                status: false,
              })
            );
            if (error) [console.log(error.message)];

            // Waveform updated
          });
        } else {
          setTimeout(() => {
            dispatch(
              EditSongAppStateActions.setOptionalSongshowNotificationModalStatus({
                value: value,
                status: false,
              })
            );
          }, 5000);
        }
        dispatch(
          EditSongAppStateActions.setOptionalSongEditedSongName({
            value: value,
            editedSongName: files[0].name,
          })
        );
      }
    } catch (error) {
      dispatch(
        EditSongAppStateActions.setOptionalSongshowNotificationModalStatus({
          value: value,
          status: false,
        })
      );
      alert("Ошибка. Повторите попытку позднее");
    }
  };

  const downloadEditedSongHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    console.log(editedSongName);

    if (editedSongName) {
      const nameString = `${editedSongName.split(".")[0]}_(paHaCutSongApp)${Date.now()}.mp3`;

      FileSaver.saveAs(new Blob([editedSongData.buffer], { type: "audio/mp3" }), nameString);
    }
  };

  const deleteOptionalSongHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(EditSongAppStateActions.setShowDeleteOptionalSongNotificationModal(true));
  };

  useEffect(() => {
    console.log(value);
    const options2 = {
      zoomview: {
        container: document.getElementById(`zoomview-container${value}`),
      },
      overview: {
        container: document.getElementById(`overview-container${value}`),
      },
      mediaElement: document.getElementById(`peaksAudio${value}`),
      webAudio: {
        audioContext: new AudioContext(),
      },

      waveformBuilderOptions: {
        scale: 4,
      },
    } as any;

    if (navigator) {
      Peaks.init(options2, function (err, optionalPeaks) {
        if (err) {
          console.error("Failed to initialize Peaks instance: " + err.message);
          return;
        }
        if (!err) {
        }

        // setPeaksInstance2(optionalPeaks);
        dispatch(
          EditSongAppStateActions.setOptionalSongPeaksInstance({
            value: value,
            peaksInstance: optionalPeaks,
          })
        );

        // peaks?.on("player.timeupdate", function (time) {
        //   // setPlaybackTime(Math.round(time * 1000) / 1000);
        //   console.log("playbackTime");
        // });
      });
    }
  }, []);

  useEffect(() => {
    if (peaksAudioRef2.current !== null) {
      if (peaksAudioRef2) {
        peaksAudioRef2.current.volume = songVolume / 100;
        peaksAudioRef2.current.muted = isSongMuted;
      }
    }
  }, [songVolume, peaksAudioRef2, isSongMuted]);
  return (
    <div className="px-2 py-5 shadow-optionalAudioElementShadow">
      <div>
        <NotificationDeleteOptionalSongModal value={value}></NotificationDeleteOptionalSongModal>
      </div>
      <div className=" w-full flex justify-end px-2">
        <div
          onClick={deleteOptionalSongHandler}
          className=" h-8 w-8 flex items-center justify-center rounded-full"
        >
          <FontAwesomeIcon
            className="fa-fw fa-2x cursor-pointer hover:text-sky-700  hover:shadow-timeBarShadow rounded-full"
            icon={faCircleXmark}
          ></FontAwesomeIcon>
        </div>
      </div>
      <div className="py-5">
        <div className=" w-full flex items-center justify-center">
          <input
            className=" w-full hidden text-lg bg-slate-50 border-2 border-solid rounded-md border-cyan-900"
            onChange={changePeaks2FileHandler}
            type="file"
            id={`thefilePeaks${value}`}
            accept="audio/*"
          />
          <label
            htmlFor={`thefilePeaks${value}`}
            className=" buttonStandart fa-fw cursor-pointer rounded-full hover:shadow-exerciseCardHowerShadow"
          >
            <span className=" py-2 px-3">
              <FontAwesomeIcon icon={faFileCirclePlus}></FontAwesomeIcon>
            </span>
            Выберете аудио
          </label>
        </div>
      </div>
      <div>
        <NotificationEditSongMain
          showNotificationModal={showNotificationModal}
        ></NotificationEditSongMain>
      </div>
      <div className=" py-3">
        <h1 className=" text-center">{editedSongName}</h1>
      </div>
      <div>
        <audio ref={peaksAudioRef2} id={`peaksAudio${value}`} onEnded={endPeakSongHandler}></audio>

        <div id={`zoomview-container${value}`} className=" h-14 w-full"></div>
        <div id={`overview-container${value}`} className=" h-14 w-full"></div>

        {peaksAudioRef2?.current && (
          <AddedSongControlButtons
            value={value}
            peaksAudioRef={peaksAudioRef2}
          ></AddedSongControlButtons>
        )}
      </div>

      {editedSongURL && (
        <div className=" py-5">
          <div onClick={downloadEditedSongHandler} className=" buttonStandart w-1/5 cursor-pointer">
            <span>
              <FontAwesomeIcon className=" pr-3 fa-fw" icon={faDownload} />
            </span>
            Скачать песню
          </div>
        </div>
      )}
    </div>
  );
};

export default AddedOptionalSongMain;
