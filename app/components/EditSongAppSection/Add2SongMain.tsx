import { faFileCirclePlus, faPauseCircle, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Peaks from "peaks.js";
import React, { useEffect, useRef, useState } from "react";

const Add2SongMain = () => {
  const [peaksInstance2, setPeaksInstance2] = useState(null) as any;
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const [song2IsPlaying, setSong2IsPlaying] = useState(false);
  const peaksAudioRef2 = useRef<HTMLMediaElement>(null);

  const endPeakSongHandler = () => {
    setSong2IsPlaying(false);
  };

  const onPlay = () => {
    if (!peaksInstance2) return;
    setSong2IsPlaying(true);

    peaksInstance2.player?.play();
  };
  const onPause = () => {
    if (!peaksInstance2) return;
    setSong2IsPlaying(false);

    peaksInstance2.player.pause();
  };

  const changePeaks2FileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    console.log("2");

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

      if (peaksInstance2?.player?.play()) {
        peaksInstance2.player?.pause();
        setSong2IsPlaying(false);
      }
      if (peaksInstance2?.segments) {
        peaksInstance2?.segments?.removeAll();
      }

      if (peaksInstance2?.points) {
        peaksInstance2?.points?.removeAll();
      }

      if (peaksInstance2) {
        peaksInstance2?.setSource(options2, function (error: Error) {
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
    const options2 = {
      zoomview: {
        container: document.getElementById("zoomview-container2"),
      },
      overview: {
        container: document.getElementById("overview-container2"),
      },
      mediaElement: document.getElementById("peaksAudio2"),
      webAudio: {
        audioContext: new AudioContext(),
      },

      waveformBuilderOptions: {
        scale: 4,
      },
    } as any;

    if (navigator) {
      Peaks.init(options2, function (err, peaks2) {
        if (err) {
          console.error("Failed to initialize Peaks instance: " + err.message);
          return;
        }
        if (!err) {
        }

        setPeaksInstance2(peaks2);

        // peaks?.on("player.timeupdate", function (time) {
        //   // setPlaybackTime(Math.round(time * 1000) / 1000);
        //   console.log("playbackTime");
        // });
      });
    }
  }, []);
  return (
    <div>
      <audio ref={peaksAudioRef2} id="peaksAudio2" onEnded={endPeakSongHandler}></audio>

      <div id="zoomview-container2" className=" h-14 w-full"></div>
      <div id="overview-container2" className=" h-14 w-full"></div>

      <div className=" flex justify-center items-center gap-6 py-5">
        {song2IsPlaying ? (
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

      <div className="pt-5">
        <div className=" w-full flex items-center justify-center">
          <input
            className=" w-full hidden text-lg bg-slate-50 border-2 border-solid rounded-md border-cyan-900"
            onChange={changePeaks2FileHandler}
            type="file"
            id="thefilePeaks2"
            accept="audio/*"
          />
          <label
            htmlFor="thefilePeaks2"
            className=" buttonStandart fa-fw cursor-pointer rounded-full hover:shadow-exerciseCardHowerShadow"
          >
            <span className=" py-2 px-3">
              <FontAwesomeIcon icon={faFileCirclePlus}></FontAwesomeIcon>
            </span>
            Добавить второй аудио файл
          </label>
        </div>
      </div>
    </div>
  );
};

export default Add2SongMain;
