"use client";
import { div } from "framer-motion/client";
import React, { useEffect, useRef, useState } from "react";
import Peaks from "peaks.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPauseCircle, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faA,
  faB,
  faChessBoard,
  faCut,
  faDownload,
  faDropletSlash,
  faEdit,
  faLinkSlash,
  faMinusCircle,
  faPlaneSlash,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Link } from "next-view-transitions";
// import Konva from "konva";

const AudioVisualiserMain = () => {
  const canvasRef = useRef(null) as any;
  const audioRef = useRef<HTMLMediaElement>(null);
  const source = useRef(null) as any;
  const analyserRef = useRef(null) as any;
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLAudioElement | null>(null);

  const [peaksInstance, setPeaksInstance] = useState(null) as any;
  const [editedSongIsPlaying, setEditedSongIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [pointsStatus, setPointsStatus] = useState({ start: false, finish: false });
  const [editedSegmantIsCreated, setEditedSegmantIsCreated] = useState(false);
  const [editedSongURL, setEditedSongURL] = useState<string>();
  const [editedSongName, setEditedSongName] = useState<string>();

  const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const audioElement = audioRef.current;
    if (audioElement) {
      // audioElement.crossOrigin = "anonymous";

      var files = e.target.files;
      audioElement.src = URL.createObjectURL(files[0]);
      // audioElement.src =
      //   "https://rus.hitmotop.com/get/cuts/bd/58/bd58c8fb52bfc79ec0cc55fb281b9822/50680499/Pantera_-_Floods_b128f0d419.mp3";

      audioElement.load();
      audioElement.play();
      const audioContext = new AudioContext();

      if (!source.current && canvasRef.current !== null) {
        source.current = audioContext.createMediaElementSource(audioElement);
        const analyser = audioContext.createAnalyser();
        analyserRef.current = analyser;
        source.current.connect(analyser);
        source.current.connect(audioContext.destination);
        analyser.connect(audioContext.destination);

        console.log(source);

        canvasRef.current.width = window.innerWidth - 80;
        // canvasRef.current.height = window.innerHeight;
        var ctx = canvasRef.current.getContext("2d");

        analyser.fftSize = 1024;

        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        var dataArray = new Uint8Array(bufferLength);

        var WIDTH = canvasRef.current.width;
        var HEIGHT = canvasRef.current.height;

        var barWidth = (WIDTH / bufferLength) * 1.3;
        var barHeight;
        var x = 0;

        function renderFrame() {
          requestAnimationFrame(renderFrame);

          x = 0;

          analyser.getByteFrequencyData(dataArray);

          ctx.fillStyle = "rgb(242, 242, 242)";
          ctx.fillRect(0, 0, WIDTH, HEIGHT);

          for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] * 0.65;

            // console.log(barHeight);

            var r = barHeight + 15 * (i / bufferLength + 3);
            var g = 5 * (i / bufferLength) + 120;
            var b = 10;

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 1;
          }
        }

        renderFrame();
      }
    }
  };

  const onPlay = () => {
    if (!peaksInstance) return;
    // console.log(peaksInstance);
    // console.log(peaksInstance?.player.getCurrentTime());
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

  const peaksAudioRef = useRef<HTMLMediaElement>(null);

  const changePeaksFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    console.log(peaksInstance);
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
  };

  const downloadEditedSongHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    // console.log("download");
    if (editedSongURL && editedSongName) {
      const a = document.createElement("a");
      a.href = editedSongURL;
      const nameString = `${editedSongName.split(".")[0]}_(paHaCutSongApp)${Date.now()}.mp3`;
      a.download = nameString;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const testDownloadHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (editedSongURL && editedSongName) {
      window.location.href = editedSongURL;
    }

    // console.log("Test download");
    // e.currentTarget.href =
    //   "https://s3.twcstorage.ru/f1525e96-2c5a759f-3888-4bd2-a52f-dbb62685b4bb/uploads/1742878015640-Iron_Maiden_-_The_Trooper_47955104 (mp3cut.net).mp3";
    // e.currentTarget.download = "test.mp3";
    // e.currentTarget.click();
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

        // Do something when the waveform is displayed and ready
      });
    }
  }, []);

  return (
    <div>
      <div id="content" className=" flex w-full justify-center items-center flex-col gap-4">
        <div className=" relative group w-full h-full mx-auto">
          <canvas className=" rounded-2xl w-full" id="canvas" ref={canvasRef} height={175}></canvas>

          <div
            className=" absolute inset-0"
            style={{
              background: "radial-gradient(circle,transparent 40%, rgba(244, 244, 245, 0.9) 80%)",
            }}
          ></div>
        </div>
        <input onChange={changeFileHandler} type="file" id="thefile" accept="audio/*" />
        <audio ref={audioRef} id="audio" controls></audio>
      </div>

      <div className=" w-full">
        <input onChange={changePeaksFileHandler} type="file" id="thefilePeaks" accept="audio/*" />

        <div id="zoomview-container" className=" h-28 w-full"></div>
        <div id="overview-container" className=" h-28 w-full"></div>
        <audio ref={peaksAudioRef} id="peaksAudio" onEnded={endPeakSongHandler}>
          {/* <source
            src="https://s3.timeweb.cloud/f1525e96-2c5a759f-3888-4bd2-a52f-dbb62685b4bb/GTSGameSong/Dio_-_Rainbow_In_The_Dark_47874705 (mp3cut.net).mp3"
            type="audio/mpeg"
          />
          <source
            src="https://s3.timeweb.cloud/f1525e96-2c5a759f-3888-4bd2-a52f-dbb62685b4bb/GTSGameSong/Dio_-_Rainbow_In_The_Dark_47874705 (mp3cut.net).mp3"
            type='audio/ogg codecs="vorbis"'
          /> */}
        </audio>
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
        {/* <audio ref={videoRef} controls></audio> */}
        <div className=" py-5">
          <div onClick={downloadEditedSongHandler} className=" buttonStandart w-1/5 cursor-pointer">
            <span>
              <FontAwesomeIcon className=" pr-3 fa-fw" icon={faDownload} />
            </span>
            Скачать песню
          </div>
        </div>
        <div className=" py-5">
          <div className=" buttonStandart w-1/5 cursor-pointer">
            <a
              onClick={testDownloadHandler}
              download="proposed_file_name.mp3"
              href="https://s3.twcstorage.ru/f1525e96-2c5a759f-3888-4bd2-a52f-dbb62685b4bb/uploads/1742878015640-Iron_Maiden_-_The_Trooper_47955104 (mp3cut.net).mp3"
            >
              <span>
                <FontAwesomeIcon className=" pr-3 fa-fw" icon={faDownload} />
              </span>
              Test download{" "}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioVisualiserMain;
