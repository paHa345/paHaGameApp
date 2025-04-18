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
      audioElement.src =
        "https://s3.timeweb.cloud/f1525e96-2c5a759f-3888-4bd2-a52f-dbb62685b4bb/GTSGameSong/Europe_-_The_Final_Countdown_47852087 (mp3cut (mp3cut.net).mp3";

      audioElement.load();
      audioElement.play();
      const audioContext = new AudioContext();

      if (!source.current && canvasRef.current !== null) {
        source.current = audioContext.createMediaElementSource(audioElement);
        const analyser = audioContext.createAnalyser();
        analyserRef.current = analyser;
        source.current.connect(analyser);
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

        var barWidth = (WIDTH / bufferLength) * 0.9;
        var barHeight;
        var x = 0;

        function renderFrame() {
          requestAnimationFrame(renderFrame);

          x = 0;

          analyser.getByteFrequencyData(dataArray);

          ctx.fillStyle = "rgb(242, 242, 242)";
          ctx.fillRect(0, 0, WIDTH, HEIGHT);

          for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            // console.log(barHeight);

            var r = barHeight + 2 * (i / bufferLength);
            var g = 5 * (i / bufferLength) + 80;
            var b = 30;

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 1;
          }
        }

        renderFrame();
      }
    }
  };

  return (
    <div id="content">
      <input onChange={changeFileHandler} type="file" id="thefile" accept="audio/*" />
      <canvas id="canvas" ref={canvasRef} width={400} height={250}></canvas>
      <audio crossOrigin="anonymous" ref={audioRef} id="audio" controls></audio>
    </div>
  );
};

export default AudioVisualiserMain;
