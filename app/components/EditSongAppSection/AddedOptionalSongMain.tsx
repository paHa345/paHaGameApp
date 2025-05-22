import { AppDispatch } from "@/app/store";
import {
  EditSongAppSlice,
  EditSongAppStateActions,
  IEditSongAppSlice,
} from "@/app/store/EditSongAppSlice";
import { faFileCirclePlus, faPauseCircle, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Peaks from "peaks.js";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddedSongControlButtons from "./AddedSongControlButtons";

interface IAddOptionalAudioProps {
  value: number;
}

const AddedOptionalSongMain = ({ value }: IAddOptionalAudioProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const peaksAudioRef2 = useRef<HTMLMediaElement>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const optionalSongIsPlaying = useSelector(
    (state: IEditSongAppSlice) =>
      state.EditSongAppState.addeOptionalAudioValue[value].editedSongIsPlaying
  );

  const peaksInstance = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.addeOptionalAudioValue[value].peaksInstance
  );

  const songVolume = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.addeOptionalAudioValue[value].songVolume
  );

  const isSongMuted = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.addeOptionalAudioValue[value].isSongMuted
  );

  const endPeakSongHandler = () => {
    // setSong2IsPlaying(false);
    dispatch(
      EditSongAppStateActions.setOptionalAudioSongIsPlayingStatus({
        value: value,
        status: false,
      })
    );
  };

  const changePeaks2FileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    console.log(value);

    setShowNotificationModal(true);
    // setEditedSongURL(undefined);
    // setEditedSegmantIsCreated(false);

    const audioElement = peaksAudioRef2.current;

    if (audioElement) {
      // audioElement.crossOrigin = "anonymous";

      var files = e.target.files;
      audioElement.src = URL.createObjectURL(files[0]);

      // setEditedSongName(files[0].name);

      const options2 = {
        mediaUrl: URL.createObjectURL(files[0]),
        webAudio: {
          audioContext: new AudioContext(),
          multiChannel: true,
        },
      };
      //   setPointsStatus((prev) => {
      //     return {
      //       start: false,
      //       finish: false,
      //     };
      //   });

      if (peaksInstance?.player?.play()) {
        peaksInstance.player?.pause();
        // setSong2IsPlaying(false);
        dispatch(
          EditSongAppStateActions.setOptionalAudioSongIsPlayingStatus({
            value: value,
            status: false,
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
          setShowNotificationModal(false);
          if (error) [console.log(error.message)];

          // Waveform updated
        });
      } else {
        setTimeout(() => {
          setShowNotificationModal(false);
        }, 5000);
      }
    }
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
    <div>
      <div>
        <audio ref={peaksAudioRef2} id={`peaksAudio${value}`} onEnded={endPeakSongHandler}></audio>

        <div id={`zoomview-container${value}`} className=" h-14 w-full"></div>
        <div id={`overview-container${value}`} className=" h-14 w-full"></div>

        {peaksAudioRef2?.current && (
          <AddedSongControlButtons
            value={value}
            peaksAudioRef={peaksAudioRef2}
          ></AddedSongControlButtons>
          // <div className=" flex justify-center items-center gap-6 py-5">
          //   {optionalSongIsPlaying ? (
          //     <div onClick={onPause}>
          //       <FontAwesomeIcon
          //         icon={faPauseCircle}
          //         className="fa-fw fa-2x cursor-pointer rounded-full hover:shadow-exerciseCardHowerShadow"
          //       ></FontAwesomeIcon>
          //     </div>
          //   ) : (
          //     <div className=" rounded-3xl" onClick={onPlay}>
          //       <FontAwesomeIcon
          //         icon={faPlayCircle}
          //         className="fa-fw fa-2x cursor-pointer rounded-full hover:shadow-exerciseCardHowerShadow"
          //       ></FontAwesomeIcon>
          //     </div>
          //   )}
          // </div>
        )}
      </div>

      <div className="pt-5">
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
            Добавить аудио
          </label>
        </div>
      </div>
    </div>
  );
};

export default AddedOptionalSongMain;
