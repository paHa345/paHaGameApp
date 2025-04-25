"use client";
import { div } from "framer-motion/client";
import React, { useEffect, useRef, useState } from "react";
import Peaks from "peaks.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPauseCircle, faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import { faCut, faEdit, faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const AudioVisualiserMain = () => {
  const canvasRef = useRef(null) as any;
  const audioRef = useRef<HTMLMediaElement>(null);
  const source = useRef(null) as any;
  const analyserRef = useRef(null) as any;
  const [peaksInstance, setPeaksInstance] = useState(null) as any;

  const [editedSongIsPlaying, setEditedSongIsPlaying] = useState(false);

  const [playbackTime, setPlaybackTime] = useState(0);

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
    } as any;

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

          console.log("Podcast editor is ready");
          console.log(peaks?.player.getCurrentTime());
          console.log(peaks?.player.getDuration());

          const segment = peaks?.segments.add({
            startTime: 0,
            endTime: peaks?.player.getDuration(),
            editable: true,
          });

          if (segment) {
            setEditedSongIsPlaying(true);

            peaks?.player.playSegment(segment, true);
          }
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

  const peaksAudioRef = useRef<HTMLMediaElement>(null);

  const changePeaksFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    console.log(peaksInstance);
    const audioElement = peaksAudioRef.current;
    if (audioElement) {
      // audioElement.crossOrigin = "anonymous";

      var files = e.target.files;
      audioElement.src = URL.createObjectURL(files[0]);

      const options = {
        mediaUrl: URL.createObjectURL(files[0]),
        webAudio: {
          audioContext: new AudioContext(),
          multiChannel: true,
        },
      };

      peaksInstance.setSource(options, function (error: Error) {
        if (error) [console.log(error.message)];

        // Waveform updated
      });
    }
  };

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

      <div>
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
                  <FontAwesomeIcon icon={faPauseCircle} className="fa-fw fa-3x"></FontAwesomeIcon>
                </div>
              ) : (
                <div onClick={onPlay}>
                  <FontAwesomeIcon icon={faPlayCircle} className="fa-fw fa-3x"></FontAwesomeIcon>
                </div>
              )}
            </div>

            <div className=" flex justify-center items-center gap-6 py-5">
              <div onClick={zoomInHandler}>
                <FontAwesomeIcon icon={faPlusCircle} className="fa-fw fa-3x"></FontAwesomeIcon>
              </div>
              <div onClick={zoomOutHandler}>
                <FontAwesomeIcon icon={faMinusCircle} className="fa-fw fa-3x"></FontAwesomeIcon>
              </div>
            </div>
            <div>
              <div className=" flex justify-center items-center gap-6 py-5">
                <div>
                  <FontAwesomeIcon icon={faEdit} className="fa-fw fa-2x"></FontAwesomeIcon>
                </div>
                <div>
                  <FontAwesomeIcon icon={faCut} className="fa-fw fa-2x"></FontAwesomeIcon>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioVisualiserMain;
