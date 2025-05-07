"use client";
import React, { useEffect, useRef, useState } from "react";
import Peaks from "peaks.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPauseCircle, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faA,
  faB,
  faCut,
  faDownload,
  faEdit,
  faLinkSlash,
  faMinusCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Link } from "next-view-transitions";
// import Konva from "konva";

import { postEvent } from "@telegram-apps/sdk";
import { isTelegramWebApp } from "@/app/components/Layout/MainLayout";

const EditSongAppMain = () => {
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLAudioElement | null>(null);
  const peaksAudioRef = useRef<HTMLMediaElement>(null);

  const [peaksInstance, setPeaksInstance] = useState(null) as any;
  const [editedSongIsPlaying, setEditedSongIsPlaying] = useState(false);
  const [pointsStatus, setPointsStatus] = useState({ start: false, finish: false });
  const [editedSegmantIsCreated, setEditedSegmantIsCreated] = useState(false);
  const [editedSongURL, setEditedSongURL] = useState<string>();
  const [editedSongName, setEditedSongName] = useState<string>();
  const [blobString, setBlobString] = useState<string>();

  const onPlay = () => {
    if (!peaksInstance) return;
    setEditedSongIsPlaying(true);

    peaksInstance.player?.play();
  };
  const onPause = () => {
    if (!peaksInstance) return;
    setEditedSongIsPlaying(false);

    peaksInstance.player.pause();
  };

  const endPeakSongHandler = () => {
    setEditedSongIsPlaying(false);
  };

  const zoomOutHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    peaksInstance.zoom?.zoomOut();
  };
  const zoomInHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    peaksInstance.zoom?.zoomIn();
  };

  const setAPointHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (peaksInstance.points.getPoint("APoint")) {
      return;
    }

    setPointsStatus((prev) => {
      return {
        start: true,
        finish: prev.finish,
      };
    });

    peaksInstance.points.add({
      time: peaksInstance?.player.getCurrentTime(),
      labelText: "Начало",
      color: "#e0491b",
      id: "APoint",
      editable: true,
    });
  };

  const setBPointHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (peaksInstance.points.getPoint("BPoint")) {
      return;
    }

    setPointsStatus((prev) => {
      return {
        start: prev.start,
        finish: true,
      };
    });

    peaksInstance.points.add({
      time: peaksInstance?.player.getCurrentTime(),
      labelText: "Конец",
      color: "#259c08",
      id: "BPoint",
      editable: true,
    });
  };

  const editAudioFileHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();

    if (!peaksInstance?.points.getPoint("APoint") && !peaksInstance?.points.getPoint("BPoint")) {
      return;
    }

    if (peaksInstance?.segments.getSegment("mainEditedSegment")) {
      return;
    }

    const segment = peaksInstance?.segments.add({
      startTime: peaksInstance?.points.getPoint("APoint").time,
      endTime: peaksInstance?.points.getPoint("BPoint").time,
      editable: true,
      color: "#5019a8",
      id: "mainEditedSegment",
      labelText: "Оставляемый фрагмент",
    });
    peaksInstance?.points.removeAll();
    setPointsStatus((prev) => {
      return {
        start: false,
        finish: false,
      };
    });
    setEditedSegmantIsCreated(true);
  };

  const deleteEditedSegmantHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    peaksInstance?.segments.removeAll();
    setEditedSegmantIsCreated(false);
  };

  const changePeaksFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    setEditedSongURL(undefined);
    setEditedSegmantIsCreated(false);

    const audioElement = peaksAudioRef.current;
    if (audioElement) {
      // audioElement.crossOrigin = "anonymous";

      var files = e.target.files;
      audioElement.src = URL.createObjectURL(files[0]);

      setEditedSongName(files[0].name);

      const options = {
        mediaUrl: URL.createObjectURL(files[0]),
        webAudio: {
          audioContext: new AudioContext(),
          multiChannel: true,
        },
      };
      setPointsStatus((prev) => {
        console.log(prev);
        return {
          start: false,
          finish: false,
        };
      });

      if (peaksInstance?.player?.play()) {
        peaksInstance.player?.pause();
        setEditedSongIsPlaying(false);
      }
      if (peaksInstance.segments) {
        peaksInstance.segments?.removeAll();
      }

      if (peaksInstance.points) {
        peaksInstance.points?.removeAll();
      }

      peaksInstance.setSource(options, function (error: Error) {
        if (error) [console.log(error.message)];

        // Waveform updated
      });
    }
  };

  const cutSongHandler = async () => {
    const segment = peaksInstance?.segments?.getSegment("mainEditedSegment");
    console.log(segment.endTime);
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
    console.log("cutSong");
    // const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(
      "input.mp3",
      await fetchFile(
        peaksAudioRef?.current?.src
        // "https://rhjm8idplsgk4vxo.public.blob.vercel-storage.com/ACDC_-_Back_In_Black_47830042%20%28mp3cut.net%29-Or96zvlcb9iq1w7OlpvMVloOV8Zmag.mp3"
      )
    );
    console.log(ffmpeg);
    console.log(segment.startTime);
    console.log(segment.endTime - segment.startTime);

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

    const options = {
      mediaUrl: URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" })),
      webAudio: {
        audioContext: new AudioContext(),
        multiChannel: true,
      },
    };
    setPointsStatus((prev) => {
      console.log(prev);
      return {
        start: false,
        finish: false,
      };
    });

    if (peaksInstance?.player?.play()) {
      peaksInstance.player?.pause();
      setEditedSongIsPlaying(false);
    }
    if (peaksInstance.segments) {
      peaksInstance.segments?.removeAll();
    }

    if (peaksInstance.points) {
      peaksInstance.points?.removeAll();
    }

    setEditedSegmantIsCreated(false);

    peaksInstance.setSource(options, function (error: Error) {
      if (error) [console.log(error.message)];

      // Waveform updated
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    setEditedSongURL(url);
    setBlobString(url);
  };

  const downloadEditedSongHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (editedSongURL && editedSongName) {
      if (videoRef.current) {
        videoRef.current.src = editedSongURL;
      }
      const nameString = `${editedSongName.split(".")[0]}_(paHaCutSongApp)${Date.now()}.mp3`;
      // if (isTelegramWebApp()) {
      //   postEvent("web_app_request_file_download", {
      //     url: `${editedSongURL?.split(":")[1]}:${editedSongURL?.split(":")[2]}:${editedSongURL?.split(":")[3]}`,
      //     file_name: nameString,
      //   });
      // } else {
      const a = document.createElement("a");
      a.href = editedSongURL;
      a.download = nameString;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // }
    }
  };

  useEffect(() => {
    if (document) {
      console.log(document.getElementById("zoomview-container"));
    }

    console.log(navigator);

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

        setPeaksInstance(peaks);

        // peaks.on("player.timeupdate", function (time) {
        //   setPlaybackTime(Math.round(time * 1000) / 1000);
        //   console.log(playbackTime);
        // });
      });
    }
  }, []);

  return (
    <div className=" py-4">
      <div className=" text-center text-3xl py-4">
        <h1>Приложение редактирования аудио</h1>
      </div>
      <div className=" w-full">
        <input onChange={changePeaksFileHandler} type="file" id="thefilePeaks" accept="audio/*" />

        <div id="zoomview-container" className=" h-28 w-full"></div>
        <div id="overview-container" className=" h-28 w-full"></div>
        <audio ref={peaksAudioRef} id="peaksAudio" onEnded={endPeakSongHandler}></audio>
        {peaksInstance && (
          <div className=" flex justify-around items-stretch gap-6 py-5">
            <div className=" flex justify-center items-center gap-6 py-5">
              {editedSongIsPlaying ? (
                <div onClick={onPause}>
                  <FontAwesomeIcon
                    icon={faPauseCircle}
                    className="fa-fw fa-3x cursor-pointer rounded-full hover:shadow-exerciseCardHowerShadow"
                  ></FontAwesomeIcon>
                </div>
              ) : (
                <div className=" rounded-3xl" onClick={onPlay}>
                  <FontAwesomeIcon
                    icon={faPlayCircle}
                    className="fa-fw fa-3x cursor-pointer rounded-full hover:shadow-exerciseCardHowerShadow"
                  ></FontAwesomeIcon>
                </div>
              )}
            </div>

            <div className=" flex justify-center items-center gap-6 py-5">
              <div onClick={zoomInHandler}>
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  className=" cursor-pointer fa-fw fa-3x rounded-full hover:shadow-exerciseCardHowerShadow"
                ></FontAwesomeIcon>
              </div>
              <div onClick={zoomOutHandler}>
                <FontAwesomeIcon
                  icon={faMinusCircle}
                  className=" cursor-pointer fa-fw fa-3x rounded-full hover:shadow-exerciseCardHowerShadow"
                ></FontAwesomeIcon>
              </div>
            </div>
            <div>
              <div className=" flex justify-center items-center gap-6 py-5">
                <div>
                  <FontAwesomeIcon
                    onClick={setAPointHandler}
                    icon={faA}
                    className=" cursor-pointer fa-fw fa-2x hover:shadow-exerciseCardHowerShadow"
                  ></FontAwesomeIcon>
                </div>
                <div>
                  <FontAwesomeIcon
                    onClick={setBPointHandler}
                    icon={faB}
                    className=" cursor-pointer fa-fw fa-2x hover:shadow-exerciseCardHowerShadow"
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
          <h1>{blobString}</h1>
        </div>

        <audio ref={videoRef} controls></audio>
      </div>
    </div>
  );
};

export default EditSongAppMain;
