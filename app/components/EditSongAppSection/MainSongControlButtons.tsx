import { AppDispatch } from "@/app/store";
import { EditSongAppStateActions, IEditSongAppSlice } from "@/app/store/EditSongAppSlice";
import { guessThatSongActions, IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import {
  faA,
  faArrowTrendDown,
  faArrowTrendUp,
  faB,
  faCirclePlus,
  faCut,
  faEdit,
  faLayerGroup,
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
import FileSaver from "file-saver";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

interface IMainSongControlsProps {
  peaksAudioRef: React.RefObject<HTMLMediaElement>;
}

const MainSongControlButtons = ({ peaksAudioRef }: IMainSongControlsProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const ffmpegRef = useRef(new FFmpeg());

  const mainSongPeaksInstance = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.peaksInstance
  );

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

  const editedSongName = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.editedSongName
  );

  const mainAudiobBlobString = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.mainSong.blobString
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

  const optionalAudioData = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.addeOptionalAudioValue
  );

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

  const zoomOutHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    mainSongPeaksInstance.zoom?.zoomOut();
  };
  const zoomInHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    mainSongPeaksInstance.zoom?.zoomIn();
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
    dispatch(EditSongAppStateActions.setMainSongshowNotificationModalStatus(true));
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

  const cutSongHandler = async () => {
    const segment = mainSongPeaksInstance?.segments?.getSegment("mainEditedSegment");
    if (!segment || segment?.startTime === undefined || segment?.endTime === undefined) {
      return;
    }
    dispatch(EditSongAppStateActions.setMainSongshowNotificationModalStatus(true));
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
    dispatch(EditSongAppStateActions.setMainSongEditedSongData(data));

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
      dispatch(EditSongAppStateActions.setMainSongshowNotificationModalStatus(false));
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    dispatch(EditSongAppStateActions.setMainSongEditedSongURL(url));
    dispatch(EditSongAppStateActions.setMainSongEditedSongBlobString(url));
  };

  const afadeFromLowToHighHandler = async (e: React.MouseEvent<SVGSVGElement>) => {
    const segment = mainSongPeaksInstance?.segments?.getSegment("mainEditedSegment");

    if (!segment || segment?.startTime === undefined || segment?.endTime === undefined) {
      return;
    }

    console.log("FadeIn");
    dispatch(EditSongAppStateActions.setMainSongshowNotificationModalStatus(true));

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
    dispatch(EditSongAppStateActions.setMainSongEditedSongData(data));

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
      dispatch(EditSongAppStateActions.setMainSongshowNotificationModalStatus(false));

      // Waveform updated
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    dispatch(EditSongAppStateActions.setMainSongEditedSongURL(url));
    dispatch(EditSongAppStateActions.setMainSongEditedSongBlobString(url));
  };

  const afadeFromHighToLowHandler = async (e: React.MouseEvent<SVGSVGElement>) => {
    const segment = mainSongPeaksInstance?.segments?.getSegment("mainEditedSegment");
    if (!segment || segment?.startTime === undefined || segment?.endTime === undefined) {
      return;
    }
    dispatch(EditSongAppStateActions.setMainSongshowNotificationModalStatus(true));

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
    dispatch(EditSongAppStateActions.setMainSongEditedSongData(data));

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
      dispatch(EditSongAppStateActions.setMainSongshowNotificationModalStatus(false));

      // Waveform updated
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    dispatch(EditSongAppStateActions.setMainSongEditedSongURL(url));
    dispatch(EditSongAppStateActions.setMainSongEditedSongBlobString(url));
  };

  const volumeHighHandler = async (e: React.MouseEvent<SVGSVGElement>) => {
    if (!peaksAudioRef?.current?.src) {
      return;
    }
    dispatch(EditSongAppStateActions.setMainSongshowNotificationModalStatus(true));

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
    dispatch(EditSongAppStateActions.setMainSongEditedSongData(data));

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
      dispatch(EditSongAppStateActions.setMainSongshowNotificationModalStatus(false));

      // Waveform updated
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    dispatch(EditSongAppStateActions.setMainSongEditedSongURL(url));
    dispatch(EditSongAppStateActions.setMainSongEditedSongBlobString(url));
  };

  const volumeLowHandler = async (e: React.MouseEvent<SVGSVGElement>) => {
    if (!peaksAudioRef?.current?.src) {
      return;
    }
    dispatch(EditSongAppStateActions.setMainSongshowNotificationModalStatus(true));
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
    dispatch(EditSongAppStateActions.setMainSongEditedSongData(data));

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
      dispatch(EditSongAppStateActions.setMainSongshowNotificationModalStatus(false));

      // Waveform updated
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    dispatch(EditSongAppStateActions.setMainSongEditedSongURL(url));
    dispatch(EditSongAppStateActions.setMainSongEditedSongBlobString(url));
  };

  const addOptionalAudioComponentHandler = () => {
    dispatch(EditSongAppStateActions.setAddedOptionalAudioValue());
  };

  const joinAudioHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

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

    // await ffmpeg.writeFile("input.mp3", await fetchFile(peaksAudioRef?.current?.src));

    // try {
    //   await ffmpeg.writeFile("concatInput.mp3", await fetchFile(optionalAudioData[0].blobString));
    // } catch (error) {
    //   console.log(error);
    // }

    // console.log(ffmpeg);

    let resultURL = "";

    for await (const optionalAudioEl of optionalAudioData) {
      console.log(optionalAudioEl.value);
      if (optionalAudioEl.value === 0) {
        console.log("first");
        await ffmpeg.writeFile("input.mp3", await fetchFile(peaksAudioRef?.current?.src));
        await ffmpeg.writeFile(
          "concatInput.mp3",
          await fetchFile(optionalAudioData[optionalAudioEl.value].blobString)
        );
        await ffmpeg.exec([
          "-i",
          `input.mp3`,
          "-i",
          `concatInput.mp3`,
          "-filter_complex",
          "[0:a][1:a]concat=n=2:v=0:a=1",
          "output.mp3",
        ]);

        const data = (await ffmpeg.readFile("output.mp3")) as any;
        resultURL = URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" }));
        // blob url
        console.log(resultURL);
      } else {
        console.log("secound");
        await ffmpeg.writeFile("input.mp3", await fetchFile(resultURL));
        await ffmpeg.writeFile(
          "concatInput.mp3",
          await fetchFile(optionalAudioData[optionalAudioEl.value].blobString)
        );
        await ffmpeg.exec([
          "-i",
          `input.mp3`,
          "-i",
          `concatInput.mp3`,
          "-filter_complex",
          "[0:a][1:a]concat=n=2:v=0:a=1",
          "output.mp3",
        ]);
      }
    }

    // const output = await ffmpeg.exec([
    //   "-i",
    //   `input.mp3`,
    //   "-i",
    //   `concatInput.mp3`,
    //   "-filter_complex",
    //   "[0:a][1:a]concat=n=2:v=0:a=1",
    //   "output.mp3",
    // ]);

    const data = (await ffmpeg.readFile("output.mp3")) as any;
    if (editedSongName) {
      const nameString = `${editedSongName.split(".")[0]}_(paHaCutSongApp)${Date.now()}.mp3`;

      FileSaver.saveAs(new Blob([data.buffer], { type: "audio/mp3" }), nameString);
    }
  };

  return (
    <div>
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
            <FontAwesomeIcon icon={faCirclePlus}></FontAwesomeIcon>
            <FontAwesomeIcon icon={faMusic} className=" fa-fw"></FontAwesomeIcon>
          </div>
        </div>
        <div className=" flex justify-around items-stretch gap-6 pt-5">
          {optionalAudioData.length > 0 &&
            optionalAudioData.length < 3 &&
            optionalAudioData[0].blobString && (
              <div
                onClick={joinAudioHandler}
                className="  flex items-center justify-center buttonStandart fa-fw cursor-pointer rounded-full hover:shadow-exerciseCardHowerShadow"
              >
                <FontAwesomeIcon icon={faLayerGroup} className=" fa-fw"></FontAwesomeIcon>
                <h1>Склеить</h1>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MainSongControlButtons;
