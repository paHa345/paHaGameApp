import React, { useEffect, useRef } from "react";

const AudioVisualiserMain = () => {
  const canvasRef = useRef(null);

  // let audio1 = new Audio();
  // audio1.src =
  //   "https://s3.timeweb.cloud/f1525e96-2c5a759f-3888-4bd2-a52f-dbb62685b4bb/GTSGameSong/Warrant_-_Chery_Pie_76036339 (mp3cut.net).mp3";

  // const container = document.getElementById("container");
  // const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  // let ctx: any;
  // if (canvas !== null) {
  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;
  //   ctx = canvas.getContext("2d");

  //   const audioCtx = new window.AudioContext();
  //   let audioSource = null;
  //   let analyser: any = null;

  //   audio1.play();
  //   audioSource = audioCtx.createMediaElementSource(audio1);
  //   analyser = audioCtx.createAnalyser();
  //   audioSource.connect(analyser);
  //   analyser.connect(audioCtx.destination);

  //   ctx.fillStyle = "#ee5253";
  //   ctx.fillRect(10, 10, 100, 100);
  //   console.log(ctx);
  //   console.log(canvas);

  //   analyser.fftSize = 128;
  //   const bufferLength = analyser.frequencyBinCount;
  //   const dataArray = new Uint8Array(bufferLength);
  //   const barWidth = canvas.width / bufferLength;

  //   let x = 0;
  //   function animate() {
  //     x = 0;
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     analyser.getByteFrequencyData(dataArray);
  //     let barHeight;
  //     for (let i = 0; i < bufferLength; i++) {
  //       barHeight = dataArray[i];
  //       ctx.fillStyle = "blue";
  //       ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
  //       x += barWidth;
  //     }

  //     requestAnimationFrame(animate);
  //   }

  //   animate();
  // }

  useEffect(() => {
    const canvas: any = canvasRef.current;
    if (canvas !== null) {
      const context = canvas.getContext("2d");
      context.fillStyle = "#ee5253";
      context.fillRect(10, 10, 100, 100);
    }
  });

  return (
    <div className=" flex justify-center items-center w-full">
      <h1>Canvas</h1>
      <div className=" flex justify-center items-center w-full" id="container">
        <canvas ref={canvasRef} id="canvas" className=" w-60 h-60 z-50"></canvas>
        <audio id="audio"></audio>
      </div>
    </div>
  );
};

export default AudioVisualiserMain;
