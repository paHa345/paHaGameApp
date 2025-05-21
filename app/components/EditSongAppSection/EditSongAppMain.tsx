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
import AddOptionalSongMain from "./AddOptionalSongMain";
import { useDispatch, useSelector } from "react-redux";
import { guessThatSongActions, IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { AppDispatch } from "@/app/store";
import { EditSongAppStateActions, IEditSongAppSlice } from "@/app/store/EditSongAppSlice";

const EditSongAppMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const ffmpegRef = useRef(new FFmpeg());
  // const videoRef = useRef<HTMLAudioElement | null>(null);
  const peaksAudioRef = useRef<HTMLMediaElement>(null);

  // const [peaksInstance, setPeaksInstance] = useState(null) as any;
  const mainSongPeaksInstance = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.peaksInstance
  );

  // const [editedSongIsPlaying, setEditedSongIsPlaying] = useState(false);

  const mainEditedSongIsPlaying = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.editedSongIsPlaying
  );

  const pointsStatus = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.pointsStatus
  );

  const editedSegmantIsCreated = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.editedSegmantIsCreated
  );

  const editedSongURL = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.editedSongURL
  );

  // const [editedSongName, setEditedSongName] = useState<string>();

  const editedSongName = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.editedSongName
  );
  const [blobString, setBlobString] = useState<string>();
  const [editedSongData, setEditedSongData] = useState<any>();
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const [isSongMuted, setIsSongMuted] = useState(false);

  const [addedptionalAudioValue, setAddedOptionalAudioValue] = useState<{ value: number }[]>([]);

  const songVolume = useSelector(
    (state: IGuessThatSongSlice) => state.guessThatSongState.songVolume
  );

  const testData = useSelector((state: IEditSongAppSlice) => state.EditSongAppState.test);

  const onPlay = () => {
    if (!mainSongPeaksInstance) return;
    dispatch(EditSongAppStateActions.setMainSongIsPlayingStatus(true));

    mainSongPeaksInstance.player?.play();
  };
  const onPause = () => {
    if (!mainSongPeaksInstance) return;
    dispatch(EditSongAppStateActions.setMainSongIsPlayingStatus(false));

    mainSongPeaksInstance.player.pause();
  };

  const endPeakSongHandler = () => {
    dispatch(EditSongAppStateActions.setMainSongIsPlayingStatus(false));
  };

  const zoomOutHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    mainSongPeaksInstance.zoom?.zoomOut();
  };
  const zoomInHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    mainSongPeaksInstance.zoom?.zoomIn();
  };

  const muteSongValueHandler = () => {
    console.log("first");
  };

  const changeVolumeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (peaksAudioRef?.current?.volume === undefined) {
      return;
    }
    dispatch(guessThatSongActions.setSongVolume(e.target.value));
  };

  const setAPointHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (mainSongPeaksInstance.points.getPoint("APoint")) {
      return;
    }

    dispatch(
      EditSongAppStateActions.setMainSongPointsStatus({
        start: true,
        finish: pointsStatus.finish,
      })
    );

    mainSongPeaksInstance.points.add({
      time: mainSongPeaksInstance?.player.getCurrentTime(),
      labelText: "Начало",
      color: "#e0491b",
      id: "APoint",
      editable: true,
    });
  };

  const setBPointHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (mainSongPeaksInstance.points.getPoint("BPoint")) {
      return;
    }

    dispatch(
      EditSongAppStateActions.setMainSongPointsStatus({
        start: pointsStatus.start,
        finish: true,
      })
    );

    mainSongPeaksInstance.points.add({
      time: mainSongPeaksInstance?.player.getCurrentTime(),
      labelText: "Конец",
      color: "#259c08",
      id: "BPoint",
      editable: true,
    });
  };

  const editAudioFileHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();

    if (
      !mainSongPeaksInstance?.points.getPoint("APoint") &&
      !mainSongPeaksInstance?.points.getPoint("BPoint")
    ) {
      return;
    }

    if (mainSongPeaksInstance?.segments.getSegment("mainEditedSegment")) {
      return;
    }

    const segment = mainSongPeaksInstance?.segments.add({
      startTime: mainSongPeaksInstance?.points.getPoint("APoint").time,
      endTime: mainSongPeaksInstance?.points.getPoint("BPoint").time,
      editable: true,
      color: "#5019a8",
      id: "mainEditedSegment",
      labelText: "Оставляемый фрагмент",
    });
    mainSongPeaksInstance?.points.removeAll();

    dispatch(
      EditSongAppStateActions.setMainSongPointsStatus({
        start: false,
        finish: false,
      })
    );

    dispatch(EditSongAppStateActions.setMainSongEditedSegmantIsCreatedStatus(true));
  };

  const deleteEditedSegmantHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    mainSongPeaksInstance?.segments.removeAll();

    dispatch(EditSongAppStateActions.setMainSongEditedSegmantIsCreatedStatus(false));
  };

  const changePeaksFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    setShowNotificationModal(true);
    dispatch(EditSongAppStateActions.setMainSongEditedSongURL(undefined));
    dispatch(EditSongAppStateActions.setMainSongEditedSegmantIsCreatedStatus(false));

    const audioElement = peaksAudioRef.current;

    if (audioElement) {
      // audioElement.crossOrigin = "anonymous";

      var files = e.target.files;
      audioElement.src = URL.createObjectURL(files[0]);

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
          setShowNotificationModal(false);
          if (error) [console.log(error.message)];

          // Waveform updated
          console.log("Finish Peaks Process");
          console.log(mainSongPeaksInstance);
        });
      } else {
        setTimeout(() => {
          setShowNotificationModal(false);
          console.log(mainSongPeaksInstance);
        }, 5000);
      }
    }
  };

  const cutSongHandler = async () => {
    const segment = mainSongPeaksInstance?.segments?.getSegment("mainEditedSegment");
    if (!segment || segment?.startTime === undefined || segment?.endTime === undefined) {
      return;
    }
    setShowNotificationModal(true);
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      // if (messageRef.current) messageRef.current.innerHTML = message;
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    // const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(
      "input.mp3",
      await fetchFile(
        peaksAudioRef?.current?.src
        // "https://rhjm8idplsgk4vxo.public.blob.vercel-storage.com/ACDC_-_Back_In_Black_47830042%20%28mp3cut.net%29-Or96zvlcb9iq1w7OlpvMVloOV8Zmag.mp3"
      )
    );

    const output = await ffmpeg.exec([
      "-i",
      // "input.avi",
      // "-vf",
      // "scale=144:-1",
      // "-c:a",
      // "aac",
      // "-strict",
      // "-2",
      // "output.mp4",

      "input.mp3",
      "-ss",
      // "5",
      `${segment.startTime}`, // Start at 5 second
      "-t",
      `${segment.endTime - segment.startTime}`,

      "output.mp3",
    ]);

    const data = (await ffmpeg.readFile("output.mp3")) as any;
    // console.log(output);
    // if (videoRef.current)
    //   videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" }));

    // videoRef?.current?.play();
    // console.log(URL.createObjectURL(new Blob([data.buffer], { type: "audio" })));
    setEditedSongData(data);

    const options = {
      mediaUrl: URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" })),
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
    if (mainSongPeaksInstance.segments) {
      mainSongPeaksInstance.segments?.removeAll();
    }

    if (mainSongPeaksInstance.points) {
      mainSongPeaksInstance.points?.removeAll();
    }

    dispatch(EditSongAppStateActions.setMainSongEditedSegmantIsCreatedStatus(false));

    mainSongPeaksInstance?.setSource(options, function (error: Error) {
      if (error) [console.log(error.message)];

      // Waveform updated
      setShowNotificationModal(false);
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    dispatch(EditSongAppStateActions.setMainSongEditedSongURL(url));
    setBlobString(url);
  };

  const afadeFromLowToHighHandler = async (e: React.MouseEvent<SVGSVGElement>) => {
    const segment = mainSongPeaksInstance?.segments?.getSegment("mainEditedSegment");

    if (!segment || segment?.startTime === undefined || segment?.endTime === undefined) {
      return;
    }

    console.log("FadeIn");
    setShowNotificationModal(true);

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      // if (messageRef.current) messageRef.current.innerHTML = message;
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    await ffmpeg.writeFile("input.mp3", await fetchFile(peaksAudioRef?.current?.src));

    const output = await ffmpeg.exec([
      "-i",
      "input.mp3",
      "-af",
      `afade=t=in:st=${segment.startTime}:d=${segment.endTime}`,
      "output.mp3",
    ]);

    const data = (await ffmpeg.readFile("output.mp3")) as any;
    setEditedSongData(data);

    const options = {
      mediaUrl: URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" })),
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
    if (mainSongPeaksInstance.segments) {
      mainSongPeaksInstance.segments?.removeAll();
    }

    if (mainSongPeaksInstance.points) {
      mainSongPeaksInstance.points?.removeAll();
    }

    dispatch(EditSongAppStateActions.setMainSongEditedSegmantIsCreatedStatus(false));

    mainSongPeaksInstance.setSource(options, function (error: Error) {
      if (error) [console.log(error.message)];
      setShowNotificationModal(false);

      // Waveform updated
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    dispatch(EditSongAppStateActions.setMainSongEditedSongURL(url));
    setBlobString(url);
  };

  const afadeFromHighToLowHandler = async (e: React.MouseEvent<SVGSVGElement>) => {
    const segment = mainSongPeaksInstance?.segments?.getSegment("mainEditedSegment");
    if (!segment || segment?.startTime === undefined || segment?.endTime === undefined) {
      return;
    }
    setShowNotificationModal(true);

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      // if (messageRef.current) messageRef.current.innerHTML = message;
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    await ffmpeg.writeFile("input.mp3", await fetchFile(peaksAudioRef?.current?.src));

    const output = await ffmpeg.exec([
      "-i",
      "input.mp3",
      "-af",
      `afade=t=out:st=${segment.startTime}:d=${segment.endTime - segment.startTime}`,
      "output.mp3",
    ]);

    const data = (await ffmpeg.readFile("output.mp3")) as any;
    setEditedSongData(data);

    const options = {
      mediaUrl: URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" })),
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
    if (mainSongPeaksInstance.segments) {
      mainSongPeaksInstance.segments?.removeAll();
    }

    if (mainSongPeaksInstance.points) {
      mainSongPeaksInstance.points?.removeAll();
    }

    dispatch(EditSongAppStateActions.setMainSongEditedSegmantIsCreatedStatus(false));

    mainSongPeaksInstance.setSource(options, function (error: Error) {
      if (error) [console.log(error.message)];
      setShowNotificationModal(false);

      // Waveform updated
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    dispatch(EditSongAppStateActions.setMainSongEditedSongURL(url));
    setBlobString(url);
  };

  const volumeHighHandler = async (e: React.MouseEvent<SVGSVGElement>) => {
    if (!peaksAudioRef?.current?.src) {
      return;
    }
    setShowNotificationModal(true);

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      // if (messageRef.current) messageRef.current.innerHTML = message;
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    await ffmpeg.writeFile("input.mp3", await fetchFile(peaksAudioRef?.current?.src));

    const output = await ffmpeg.exec(["-i", "input.mp3", "-af", "volume=1.2", "output.mp3"]);

    const data = (await ffmpeg.readFile("output.mp3")) as any;
    setEditedSongData(data);

    const options = {
      mediaUrl: URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" })),
      webAudio: {
        audioContext: new AudioContext(),
        multiChannel: true,
      },
    };

    if (mainSongPeaksInstance?.player?.play()) {
      mainSongPeaksInstance.player?.pause();
      dispatch(EditSongAppStateActions.setMainSongIsPlayingStatus(false));
    }

    mainSongPeaksInstance.setSource(options, function (error: Error) {
      if (error) [console.log(error.message)];
      setShowNotificationModal(false);

      // Waveform updated
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    dispatch(EditSongAppStateActions.setMainSongEditedSongURL(url));
    setBlobString(url);
  };

  const volumeLowHandler = async (e: React.MouseEvent<SVGSVGElement>) => {
    if (!peaksAudioRef?.current?.src) {
      return;
    }
    setShowNotificationModal(true);
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      // if (messageRef.current) messageRef.current.innerHTML = message;
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    await ffmpeg.writeFile("input.mp3", await fetchFile(peaksAudioRef?.current?.src));

    const output = await ffmpeg.exec(["-i", "input.mp3", "-af", "volume=0.8", "output.mp3"]);

    const data = (await ffmpeg.readFile("output.mp3")) as any;
    setEditedSongData(data);

    const options = {
      mediaUrl: URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" })),
      webAudio: {
        audioContext: new AudioContext(),
        multiChannel: true,
      },
    };

    if (mainSongPeaksInstance?.player?.play()) {
      mainSongPeaksInstance.player?.pause();
      dispatch(EditSongAppStateActions.setMainSongIsPlayingStatus(false));
    }

    mainSongPeaksInstance.setSource(options, function (error: Error) {
      if (error) [console.log(error.message)];
      setShowNotificationModal(false);

      // Waveform updated
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    dispatch(EditSongAppStateActions.setMainSongEditedSongURL(url));
    setBlobString(url);
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
    setAddedOptionalAudioValue((prev) => {
      // console.log(prev[prev.length - 1]);
      if (prev.length) {
        return [...prev, { value: prev[prev.length - 1].value + 1 }];
      } else {
        return [{ value: 1 }];
      }
    });
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
              <AddOptionalSongMain value={el.value}></AddOptionalSongMain>{" "}
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
          <div className=" flex items-center justify-center flex-col">
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
                    {isSongMuted && (
                      <FontAwesomeIcon className="fa-fw fa-2x" icon={faVolumeXmark} />
                    )}
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
                {mainEditedSongIsPlaying ? (
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
          </div>
        )}

        <div>{addedOptionalAudioEl}</div>

        {/* <Add2SongMain></Add2SongMain> */}

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
      </div>
    </div>
  );
};

export default EditSongAppMain;
