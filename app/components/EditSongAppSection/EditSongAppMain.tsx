"use client";
import React, { useEffect, useRef, useState } from "react";
import Peaks from "peaks.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPauseCircle, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faA,
  faArrowDownWideShort,
  faArrowTrendDown,
  faArrowTrendUp,
  faArrowUpRightDots,
  faArrowUpShortWide,
  faArrowUpWideShort,
  faB,
  faCirclePlus,
  faCut,
  faDownload,
  faEdit,
  faFileCirclePlus,
  faFileExport,
  faLinkSlash,
  faMinusCircle,
  faMusic,
  faPlusCircle,
  faVolumeHigh,
  faVolumeLow,
  faVolumeOff,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Link } from "next-view-transitions";
// import Konva from "konva";

import { postEvent } from "@telegram-apps/sdk";
import { isTelegramWebApp } from "@/app/components/Layout/MainLayout";
import FileSaver, { saveAs } from "file-saver";
import { div } from "framer-motion/client";
import NotificationEditSongMain from "./NotificationEditSongMain";
import AddedOptionalSongMain from "./AddedOptionalSongMain";
import { useDispatch, useSelector } from "react-redux";
import { guessThatSongActions, IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { AppDispatch } from "@/app/store";
import { EditSongAppStateActions, IEditSongAppSlice } from "@/app/store/EditSongAppSlice";
import MainSongControlButtons from "./MainSongControlButtons";

const EditSongAppMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const ffmpegRef = useRef(new FFmpeg());

  const peaksAudioRef = useRef<HTMLMediaElement>(null);

  const mainSongPeaksInstance = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.peaksInstance
  );

  const editedSongURL = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.editedSongURL
  );

  const editedSongName = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.editedSongName
  );

  const editedSongData = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.editedSongData
  );

  const showNotificationModal = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.showNotificationModal
  );

  const isSongMuted = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.isSongMuted
  );

  const addedptionalAudioValue = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.addeOptionalAudioValue
  );

  const songVolume = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.songVolume
  );

  const endPeakSongHandler = () => {
    dispatch(EditSongAppStateActions.setMainSongIsPlayingStatus(false));
  };

  const changePeaksFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    dispatch(EditSongAppStateActions.setMainSongshowNotificationModalStatus(true));
    dispatch(EditSongAppStateActions.setMainSongEditedSongURL(undefined));
    dispatch(EditSongAppStateActions.setMainSongEditedSegmantIsCreatedStatus(false));

    const audioElement = peaksAudioRef.current;

    if (audioElement) {
      // audioElement.crossOrigin = "anonymous";

      var files = e.target.files;
      audioElement.src = URL.createObjectURL(files[0]);

      console.log(URL.createObjectURL(files[0]));

      dispatch(EditSongAppStateActions.setMainSongEditedSongName(files[0].name));

      const options = {
        mediaUrl: URL.createObjectURL(files[0]),
        webAudio: {
          audioContext: new AudioContext(),
          multiChannel: true,
        },
      };

      dispatch(
        EditSongAppStateActions.setMainSongPointsStatus({
          start: false,
          finish: false,
        })
      );

      if (mainSongPeaksInstance?.player?.play()) {
        mainSongPeaksInstance.player?.pause();
        dispatch(EditSongAppStateActions.setMainSongIsPlayingStatus(false));
      }
      if (mainSongPeaksInstance?.segments) {
        mainSongPeaksInstance?.segments?.removeAll();
      }

      if (mainSongPeaksInstance?.points) {
        mainSongPeaksInstance?.points?.removeAll();
      }

      if (mainSongPeaksInstance) {
        mainSongPeaksInstance?.setSource(options, function (error: Error) {
          dispatch(EditSongAppStateActions.setMainSongshowNotificationModalStatus(false));
          if (error) [console.log(error.message)];

          // Waveform updated
          console.log("Finish Peaks Process");
          console.log(mainSongPeaksInstance);
        });
      } else {
        setTimeout(() => {
          dispatch(EditSongAppStateActions.setMainSongshowNotificationModalStatus(false));
          console.log(mainSongPeaksInstance);
        }, 5000);
      }
    }
  };

  const downloadEditedSongHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (editedSongName) {
      const nameString = `${editedSongName.split(".")[0]}_(paHaCutSongApp)${Date.now()}.mp3`;

      FileSaver.saveAs(new Blob([editedSongData.buffer], { type: "audio/mp3" }), nameString);
    }

    // if (editedSongURL && editedSongName) {
    //   if (videoRef.current) {
    //     videoRef.current.src = editedSongURL;
    //   }
    //   const nameString = `${editedSongName.split(".")[0]}_(paHaCutSongApp)${Date.now()}.mp3`;
    //   // if (isTelegramWebApp()) {
    //   //   postEvent("web_app_request_file_download", {
    //   //     url: `${editedSongURL?.split(":")[1]}:${editedSongURL?.split(":")[2]}:${editedSongURL?.split(":")[3]}`,
    //   //     file_name: nameString,
    //   //   });
    //   // } else {
    //   const a = document.createElement("a");
    //   a.href = editedSongURL;
    //   a.download = nameString;
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    //   // }
    // }
  };

  const addOptionalAudioComponentHandler = () => {
    dispatch(EditSongAppStateActions.setAddedOptionalAudioValue());
  };

  const addedOptionalAudioEl =
    addedptionalAudioValue === undefined ? (
      <div></div>
    ) : (
      addedptionalAudioValue.map((el) => {
        return (
          <div key={el.value}>
            {" "}
            <div className=" py-5 ">
              <AddedOptionalSongMain value={el.value}></AddedOptionalSongMain>{" "}
            </div>
          </div>
        );
      })
    );

  useEffect(() => {
    const options = {
      zoomview: {
        container: document.getElementById("zoomview-container"),
      },
      overview: {
        container: document.getElementById("overview-container"),
      },
      mediaElement: document.getElementById("peaksAudio"),
      webAudio: {
        audioContext: new AudioContext(),
      },

      waveformBuilderOptions: {
        scale: 4,
      },
      // createSegmentLabel: createSegmentLabel,
      // createSegmentMarker: createSegmentMarker,
    } as any;

    // function createSegmentLabel(options: any) {
    //   if (options.view === "overview") {
    //     return null;
    //   }

    //   return new Konva.Text({
    //     text: options.segment.labelText,
    //     fontSize: 24,
    //     fontFamily: "Calibri",
    //     fill: "black",
    //   });
    // }

    // class CustomPointMarker {
    //   constructor(options: any) {
    //     this._options = options;
    //   }

    //   init(group: any) {
    //     const layer = this._options.layer;
    //     const height = layer.getHeight();

    //     this._handle = new Konva.Rect({
    //       x: 0,
    //       y: 0,
    //       width: 40,
    //       height: 20,
    //       fill: this._options.color,
    //     });

    //     this._line = new Konva.Line({
    //       points: [0.5, 0, 0.5, height], // x1, y1, x2, y2
    //       stroke: options.color,
    //       strokeWidth: 1,
    //     });

    //     group.add(this._handle);
    //     group.add(this._line);
    //   }
    // }

    // function createSegmentMarker(options: any) {
    //   return new CustomPointMarker(options);
    // }

    if (navigator) {
      Peaks.init(options, function (err, peaks) {
        if (err) {
          console.error("Failed to initialize Peaks instance: " + err.message);
          return;
        }
        if (!err) {
          // peaks?.points.add({
          //   time: 10,
          //   labelText: "Start Point",
          // });
          // console.log("Podcast editor is ready");
          // console.log(peaks?.player.getCurrentTime());
          // console.log(peaks?.player.getDuration());
          // const segment = peaks?.segments.add({
          //   startTime: 0,
          //   endTime: peaks?.player.getDuration(),
          //   editable: true,
          // });
          // if (segment) {
          //   setEditedSongIsPlaying(true);
          //   peaks?.player.playSegment(segment, true);
          // }
        }

        // setPeaksInstance(peaks);
        dispatch(EditSongAppStateActions.setMainSongPeaksInstance(peaks));

        // peaks?.on("player.timeupdate", function (time) {
        //   // setPlaybackTime(Math.round(time * 1000) / 1000);
        //   console.log("playbackTime");
        // });
      });
    }
  }, []);

  useEffect(() => {
    if (peaksAudioRef.current !== null) {
      if (peaksAudioRef) {
        peaksAudioRef.current.volume = songVolume / 100;
        peaksAudioRef.current.muted = isSongMuted;
      }
    }
  }, [songVolume, peaksAudioRef, isSongMuted]);

  return (
    <div className=" py-4">
      <div className=" text-center text-3xl py-4">
        <h1>Приложение редактирования аудио</h1>
      </div>

      <div>
        <NotificationEditSongMain
          showNotificationModal={showNotificationModal}
        ></NotificationEditSongMain>
      </div>
      <div className=" w-full">
        <div className=" w-full flex items-center justify-center">
          <input
            className=" w-full hidden text-lg bg-slate-50 border-2 border-solid rounded-md border-cyan-900"
            onChange={changePeaksFileHandler}
            type="file"
            id="thefilePeaks"
            accept="audio/*"
          />
          <label
            htmlFor="thefilePeaks"
            className=" buttonStandart fa-fw cursor-pointer rounded-full hover:shadow-exerciseCardHowerShadow"
          >
            <span className=" py-2 px-3">
              <FontAwesomeIcon icon={faFileExport}></FontAwesomeIcon>
            </span>
            Выберете аудио
          </label>
        </div>

        <div className=" py-3">
          <h1 className=" text-center">{editedSongName}</h1>
        </div>

        <div id="zoomview-container" className=" h-28 w-full"></div>
        <div id="overview-container" className=" h-28 w-full"></div>
        <audio ref={peaksAudioRef} id="peaksAudio" onEnded={endPeakSongHandler}></audio>
        {mainSongPeaksInstance && (
          <MainSongControlButtons peaksAudioRef={peaksAudioRef}></MainSongControlButtons>
        )}

        {editedSongURL && (
          <div className=" py-5">
            <div
              onClick={downloadEditedSongHandler}
              className=" buttonStandart w-1/5 cursor-pointer"
            >
              <span>
                <FontAwesomeIcon className=" pr-3 fa-fw" icon={faDownload} />
              </span>
              Скачать песню
            </div>
          </div>
        )}

        <div>
          {addedptionalAudioValue.length > 0 && (
            <div className=" py-4 my-6 border-t-4 border-t-stone-400 ">
              <h1 className=" text-3xl text-center">Дополнительные аудио</h1>
            </div>
          )}
          {addedOptionalAudioEl}
        </div>
      </div>
    </div>
  );
};

export default EditSongAppMain;
