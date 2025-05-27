import { AppDispatch } from "@/app/store";
import { EditSongAppStateActions, IEditSongAppSlice } from "@/app/store/EditSongAppSlice";
import { IGuessThatSongSlice } from "@/app/store/guessThatSongSlice";
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
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

interface IAddedSongControlsProps {
  peaksAudioRef: React.RefObject<HTMLMediaElement>;
  value: number;
}

const AddedSongControlButtons = ({ peaksAudioRef, value }: IAddedSongControlsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const ffmpegRef = useRef(new FFmpeg());

  const optionalSongIsPlaying = useSelector(
    (state: IEditSongAppSlice) =>
      state.EditSongAppState.addeOptionalAudioValue[value].editedSongIsPlaying
  );

  const optionalSongVolume = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.addeOptionalAudioValue[value].songVolume
  );

  const isSongMuted = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.addeOptionalAudioValue[value].isSongMuted
  );

  const peaksInstanse = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.addeOptionalAudioValue[value].peaksInstance
  );

  const pointsStatus = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.addeOptionalAudioValue[value].pointsStatus
  );

  const editedSegmentIsCreated = useSelector(
    (state: IEditSongAppSlice) =>
      state.EditSongAppState.addeOptionalAudioValue[value].editedSegmentIsCreated
  );

  const onPlay = () => {
    if (!peaksInstanse) return;
    dispatch(
      EditSongAppStateActions.setOptionalAudioSongIsPlayingStatus({
        value: value,
        editedSongIsPlaying: true,
      })
    );

    peaksInstanse.player?.play();
  };

  const onPause = () => {
    if (!peaksInstanse) return;
    dispatch(
      EditSongAppStateActions.setOptionalAudioSongIsPlayingStatus({
        value: value,
        editedSongIsPlaying: false,
      })
    );
    peaksInstanse.player.pause();
  };

  const changeVolumeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (peaksAudioRef?.current?.volume === undefined) {
      return;
    }
    dispatch(
      EditSongAppStateActions.setOptionalSongVolume({
        value: value,
        songVolume: Number(e.target.value),
      })
    );
  };

  const zoomOutHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    peaksInstanse.zoom?.zoomOut();
  };
  const zoomInHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    peaksInstanse.zoom?.zoomIn();
  };

  const setAPointHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (peaksInstanse.points.getPoint("APoint")) {
      return;
    }

    dispatch(
      EditSongAppStateActions.setOptionalSongPointsStatus({
        value: value,
        pointsStatus: {
          start: true,
          finish: pointsStatus.finish,
        },
      })
    );

    peaksInstanse.points.add({
      time: peaksInstanse?.player.getCurrentTime(),
      labelText: "Начало",
      color: "#e0491b",
      id: "APoint",
      editable: true,
    });
  };

  const setBPointHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (peaksInstanse.points.getPoint("BPoint")) {
      return;
    }

    dispatch(
      EditSongAppStateActions.setOptionalSongPointsStatus({
        value: value,
        pointsStatus: {
          start: pointsStatus.start,
          finish: true,
        },
      })
    );

    peaksInstanse.points.add({
      time: peaksInstanse?.player.getCurrentTime(),
      labelText: "Конец",
      color: "#259c08",
      id: "BPoint",
      editable: true,
    });
  };

  const editAudioFileHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();

    if (!peaksInstanse?.points.getPoint("APoint") && !peaksInstanse?.points.getPoint("BPoint")) {
      return;
    }

    if (peaksInstanse?.segments.getSegment("mainEditedSegment")) {
      return;
    }

    const segment = peaksInstanse?.segments.add({
      startTime: peaksInstanse?.points.getPoint("APoint").time,
      endTime: peaksInstanse?.points.getPoint("BPoint").time,
      editable: true,
      color: "#5019a8",
      id: "mainEditedSegment",
      labelText: "Оставляемый фрагмент",
    });
    peaksInstanse?.points.removeAll();

    dispatch(
      EditSongAppStateActions.setOptionalSongPointsStatus({
        value: value,
        pointsStatus: {
          start: false,
          finish: false,
        },
      })
    );

    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSegmentIsCreatedStatus({
        value: value,
        status: true,
      })
    );
  };

  const deleteEditedSegmentHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    peaksInstanse?.segments.removeAll();

    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSegmentIsCreatedStatus({
        value: value,
        status: false,
      })
    );
  };

  const cutSongHandler = async () => {
    const segment = peaksInstanse?.segments?.getSegment("mainEditedSegment");
    if (!segment || segment?.startTime === undefined || segment?.endTime === undefined) {
      return;
    }

    dispatch(
      EditSongAppStateActions.setOptionalSongshowNotificationModalStatus({
        value: value,
        status: true,
      })
    );
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

    dispatch(EditSongAppStateActions.setOptionalFfmpeg({ value: value, ffmpeg: ffmpeg }));

    // dispatch(EditSongAppStateActions.setMainSongEditedSongData(data));
    dispatch(
      EditSongAppStateActions.setOptionalSongData({
        value: value,
        songData: data,
      })
    );

    const options = {
      mediaUrl: URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" })),
      webAudio: {
        audioContext: new AudioContext(),
        multiChannel: true,
      },
    };

    dispatch(
      EditSongAppStateActions.setOptionalSongPointsStatus({
        value: value,
        pointsStatus: {
          start: false,
          finish: false,
        },
      })
    );

    if (peaksInstanse?.player?.play()) {
      peaksInstanse.player?.pause();
      dispatch(
        EditSongAppStateActions.setOptionalAudioSongIsPlayingStatus({
          value: value,
          editedSongIsPlaying: false,
        })
      );
    }
    if (peaksInstanse.segments) {
      peaksInstanse.segments?.removeAll();
    }

    if (peaksInstanse.points) {
      peaksInstanse.points?.removeAll();
    }

    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSegmentIsCreatedStatus({
        value: value,
        status: false,
      })
    );
    peaksInstanse?.setSource(options, function (error: Error) {
      if (error) [console.log(error.message)];

      // Waveform updated

      dispatch(
        EditSongAppStateActions.setOptionalSongshowNotificationModalStatus({
          value: value,
          status: false,
        })
      );
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);

    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSongURL({
        value: value,
        editedSongURL: url,
      })
    );
    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSongBlobString({
        value: value,
        blobString: url,
      })
    );
  };

  const volumeHighHandler = async (e: React.MouseEvent<SVGSVGElement>) => {
    if (!peaksAudioRef?.current?.src) {
      return;
    }
    dispatch(
      EditSongAppStateActions.setOptionalSongshowNotificationModalStatus({
        value: value,
        status: true,
      })
    );
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
    dispatch(
      EditSongAppStateActions.setOptionalSongData({
        value: value,
        songData: data,
      })
    );

    const options = {
      mediaUrl: URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" })),
      webAudio: {
        audioContext: new AudioContext(),
        multiChannel: true,
      },
    };

    if (peaksInstanse?.player?.play()) {
      peaksInstanse.player?.pause();
      //   dispatch(EditSongAppStateActions.setMainSongIsPlayingStatus(false));
      dispatch(
        EditSongAppStateActions.setOptionalAudioSongIsPlayingStatus({
          value: value,
          editedSongIsPlaying: false,
        })
      );
    }

    peaksInstanse.setSource(options, function (error: Error) {
      if (error) [console.log(error.message)];
      dispatch(
        EditSongAppStateActions.setOptionalSongshowNotificationModalStatus({
          value: value,
          status: false,
        })
      );
      // Waveform updated
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSongURL({
        value: value,
        editedSongURL: url,
      })
    );
    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSongBlobString({
        value: value,
        blobString: url,
      })
    );
  };

  const volumeLowHandler = async (e: React.MouseEvent<SVGSVGElement>) => {
    if (!peaksAudioRef?.current?.src) {
      return;
    }
    dispatch(
      EditSongAppStateActions.setOptionalSongshowNotificationModalStatus({
        value: value,
        status: true,
      })
    );
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
    dispatch(
      EditSongAppStateActions.setOptionalSongData({
        value: value,
        songData: data,
      })
    );

    const options = {
      mediaUrl: URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" })),
      webAudio: {
        audioContext: new AudioContext(),
        multiChannel: true,
      },
    };

    if (peaksInstanse?.player?.play()) {
      peaksInstanse.player?.pause();
      dispatch(
        EditSongAppStateActions.setOptionalAudioSongIsPlayingStatus({
          value: value,
          editedSongIsPlaying: false,
        })
      );
    }

    peaksInstanse.setSource(options, function (error: Error) {
      if (error) [console.log(error.message)];
      dispatch(
        EditSongAppStateActions.setOptionalSongshowNotificationModalStatus({
          value: value,
          status: false,
        })
      );
      // Waveform updated
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSongURL({
        value: value,
        editedSongURL: url,
      })
    );
    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSongBlobString({
        value: value,
        blobString: url,
      })
    );
  };

  const afadeFromLowToHighHandler = async (e: React.MouseEvent<SVGSVGElement>) => {
    const segment = peaksInstanse?.segments?.getSegment("mainEditedSegment");

    if (!segment || segment?.startTime === undefined || segment?.endTime === undefined) {
      return;
    }

    dispatch(
      EditSongAppStateActions.setOptionalSongshowNotificationModalStatus({
        value: value,
        status: true,
      })
    );

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
    dispatch(
      EditSongAppStateActions.setOptionalSongData({
        value: value,
        songData: data,
      })
    );

    const options = {
      mediaUrl: URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" })),
      webAudio: {
        audioContext: new AudioContext(),
        multiChannel: true,
      },
    };

    dispatch(
      EditSongAppStateActions.setOptionalSongPointsStatus({
        value: value,
        pointsStatus: {
          start: false,
          finish: false,
        },
      })
    );

    if (peaksInstanse?.player?.play()) {
      peaksInstanse.player?.pause();
      dispatch(
        EditSongAppStateActions.setOptionalAudioSongIsPlayingStatus({
          value: value,
          editedSongIsPlaying: false,
        })
      );
    }
    if (peaksInstanse.segments) {
      peaksInstanse.segments?.removeAll();
    }

    if (peaksInstanse.points) {
      peaksInstanse.points?.removeAll();
    }

    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSegmentIsCreatedStatus({
        value: value,
        status: false,
      })
    );
    peaksInstanse.setSource(options, function (error: Error) {
      if (error) [console.log(error.message)];
      dispatch(
        EditSongAppStateActions.setOptionalSongshowNotificationModalStatus({
          value: value,
          status: false,
        })
      );

      // Waveform updated
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSongURL({
        value: value,
        editedSongURL: url,
      })
    );
    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSongBlobString({
        value: value,
        blobString: url,
      })
    );
  };

  const afadeFromHighToLowHandler = async (e: React.MouseEvent<SVGSVGElement>) => {
    const segment = peaksInstanse?.segments?.getSegment("mainEditedSegment");
    if (!segment || segment?.startTime === undefined || segment?.endTime === undefined) {
      return;
    }
    dispatch(
      EditSongAppStateActions.setOptionalSongshowNotificationModalStatus({
        value: value,
        status: true,
      })
    );

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
    dispatch(
      EditSongAppStateActions.setOptionalSongData({
        value: value,
        songData: data,
      })
    );

    const options = {
      mediaUrl: URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" })),
      webAudio: {
        audioContext: new AudioContext(),
        multiChannel: true,
      },
    };

    dispatch(
      EditSongAppStateActions.setOptionalSongPointsStatus({
        value: value,
        pointsStatus: {
          start: false,
          finish: false,
        },
      })
    );

    if (peaksInstanse?.player?.play()) {
      peaksInstanse.player?.pause();
      dispatch(
        EditSongAppStateActions.setOptionalAudioSongIsPlayingStatus({
          value: value,
          editedSongIsPlaying: false,
        })
      );
    }
    if (peaksInstanse.segments) {
      peaksInstanse.segments?.removeAll();
    }

    if (peaksInstanse.points) {
      peaksInstanse.points?.removeAll();
    }

    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSegmentIsCreatedStatus({
        value: value,
        status: false,
      })
    );
    peaksInstanse.setSource(options, function (error: Error) {
      if (error) [console.log(error.message)];
      dispatch(
        EditSongAppStateActions.setOptionalSongshowNotificationModalStatus({
          value: value,
          status: false,
        })
      );

      // Waveform updated
    });

    const editedSongData = new Blob([data], { type: "audio/mp3" });
    const url = URL.createObjectURL(editedSongData);
    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSongURL({
        value: value,
        editedSongURL: url,
      })
    );
    dispatch(
      EditSongAppStateActions.setOptionalSongEditedSongBlobString({
        value: value,
        blobString: url,
      })
    );
  };

  return (
    <div>
      <div className=" flex items-center justify-center flex-col">
        <div className=" flex justify-around items-stretch gap-6 pt-5">
          {peaksAudioRef?.current?.volume !== undefined && (
            <div className=" flex justify-end items-center flex-row gap-5">
              <div
                style={{
                  background: `linear-gradient(to top right, rgba(132, 204, 22, ${optionalSongVolume < 20 ? 0.2 : optionalSongVolume / 100} ),#E7F9FF )`,
                }}
                className=" py-1 px-1 flex-none cursor-pointer w-fit border-1 border-solid border-stone-200 rounded-xl bg-gradient-to-tr from-secoundaryColor to-cyan-100"
                // onClick={muteSongValueHandler}
              >
                {isSongMuted && <FontAwesomeIcon className="fa-fw fa-2x" icon={faVolumeXmark} />}
                {optionalSongVolume > 80 && !isSongMuted && (
                  <FontAwesomeIcon className="fa-fw fa-2x" icon={faVolumeHigh} />
                )}
                {optionalSongVolume < 20 && !isSongMuted && (
                  <FontAwesomeIcon className="fa-fw fa-2x" icon={faVolumeOff} />
                )}
                {optionalSongVolume >= 20 && optionalSongVolume <= 80 && !isSongMuted && (
                  <FontAwesomeIcon className="fa-fw fa-2x" icon={faVolumeLow} />
                )}
              </div>
              <div className=" grow">
                <input
                  style={{
                    background: `linear-gradient(to right, rgba(132, 204, 22, ${optionalSongVolume < 20 ? 0.2 : optionalSongVolume / 100} ) ${optionalSongVolume}%, #ccc ${optionalSongVolume}%)`,
                  }}
                  className=" volume-slider cursor-pointer h-1 rounded-md w-full border-1 border-solid border-stone-600"
                  type="range"
                  min={0}
                  max={100}
                  value={optionalSongVolume}
                  onChange={changeVolumeHandler}
                />
              </div>{" "}
            </div>
          )}
        </div>

        <div className=" flex justify-around items-stretch gap-6 pt-5">
          <div className=" flex justify-center items-center gap-6 py-5">
            {optionalSongIsPlaying ? (
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
              {!editedSegmentIsCreated && (
                <div>
                  <FontAwesomeIcon
                    onClick={editAudioFileHandler}
                    icon={faEdit}
                    className={` ${pointsStatus.finish && pointsStatus.start && "cursor-pointer text-zinc-900 hover:shadow-exerciseCardHowerShadow"}  text-zinc-200 fa-fw fa-2x `}
                  ></FontAwesomeIcon>
                </div>
              )}
              {editedSegmentIsCreated && (
                <div>
                  <FontAwesomeIcon
                    onClick={deleteEditedSegmentHandler}
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
        </div>
      </div>
    </div>
  );
};

export default AddedSongControlButtons;
