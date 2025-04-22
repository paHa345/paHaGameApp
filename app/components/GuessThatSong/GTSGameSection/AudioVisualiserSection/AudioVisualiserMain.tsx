import React, { useEffect, useRef, useState } from "react";

const AudioVisualiserMain = () => {
  const canvasRef = useRef(null) as any;
  const audioRef = useRef<HTMLMediaElement>(null);
  const source = useRef(null) as any;
  const analyserRef = useRef(null) as any;

  const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.crossOrigin = "anonymous";

      // var files = e.target.files;
      // audioElement.src = URL.createObjectURL(files[0]);
      audioElement.src =
        "https://s3.timeweb.cloud/f1525e96-2c5a759f-3888-4bd2-a52f-dbb62685b4bb/uploads/1742878015640-Iron_Maiden_-_The_Trooper_47955104 (mp3cut.net).mp3";

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

  // var audio = audioRef.current;
  // var canvas = canvasRef.current;
  // const addFileHandler = () => {
  //   if(audio === null){
  //     return

  //   }
  //   audio.crossOrigin = "anonymous";

  //   audio.src =
  //     "https://s3.timeweb.cloud/f1525e96-2c5a759f-3888-4bd2-a52f-dbb62685b4bb/uploads/1743068319352-Ariya.mp3";

  //   audio.load();
  //   audio.play();
  //   var context = new AudioContext();
  //   var src = context.createMediaElementSource(audio);
  //   var analyser = context.createAnalyser();

  //   var ctx = canvas.getContext("2d");

  //   src.connect(analyser);
  //   analyser.connect(context.destination);

  //   analyser.fftSize = 1024;

  //   var bufferLength = analyser.frequencyBinCount;
  //   console.log(bufferLength);

  //   var dataArray = new Uint8Array(bufferLength);

  //   var WIDTH = canvas.width;
  //   var HEIGHT = canvas.height;

  //   var barWidth = (WIDTH / bufferLength) * 0.9;
  //   var barHeight;
  //   var x = 0;

  //   function renderFrame() {
  //     requestAnimationFrame(renderFrame);

  //     x = 0;

  //     analyser.getByteFrequencyData(dataArray);

  //     ctx.fillStyle = "rgb(242, 242, 242)";
  //     ctx.fillRect(0, 0, WIDTH, HEIGHT);

  //     for (var i = 0; i < bufferLength; i++) {
  //       barHeight = dataArray[i];

  //       var r = barHeight + 2 * (i / bufferLength);
  //       var g = 5 * (i / bufferLength) + 80;
  //       var b = 30;

  //       ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
  //       ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

  //       x += barWidth + 1;
  //     }
  //   }

  //   audio.play();
  //   renderFrame();
  // };

  useEffect(() => {}, []);

  return (
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
  );
};

export default AudioVisualiserMain;
