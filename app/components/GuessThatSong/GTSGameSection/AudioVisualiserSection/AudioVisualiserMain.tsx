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
      context.fillStyle = "#c7ecee"; // устанавливаем цвет заполнения фигуры
      context.fillRect(10, 10, 100, 50);
      context.strokeStyle = "#22a6b3"; // устанавливаем цвет контура фигуры
      context.lineWidth = 4.5; // устанавливаем толщину линии
      context.strokeRect(10, 10, 100, 50);
    }
  });

  return (
    // <div className=" flex justify-center items-center w-full">
    //   <h1>Canvas</h1>
    //   <div className=" flex justify-center items-center w-full" id="container">
    //     <canvas ref={canvasRef} id="canvas" className=" w-60 h-60 z-50"></canvas>
    //     <audio id="audio"></audio>
    //   </div>
    // </div>
    <body className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 max-w-md w-full rounded-xl shadow-2xl p-6 space-y-6">
        {/* <!-- Обложка --> */}
        <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
          <img
            src="https://picsum.photos/200"
            alt="Обложка"
            className="w-full h-full object-cover"
          />
        </div>

        {/* <!-- Информация о треке --> */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-white">Название трека</h1>
          <p className="text-gray-400">Исполнитель</p>
        </div>

        {/* <!-- Прогресс-бар --> */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>0:00</span>
            <span>3:45</span>
          </div>
          <div className="h-1 bg-gray-600 rounded-full cursor-pointer">
            <div className="h-full bg-green-500 rounded-full w-1/3 relative">
              <div className="w-3 h-3 bg-white rounded-full absolute right-0 -translate-y-1/2 top-1/2"></div>
            </div>
          </div>
        </div>

        {/* <!-- Управление воспроизведением --> */}
        <div className="flex justify-center items-center gap-6">
          <button className="text-white text-xl hover:text-green-500 transition-colors">
            <i className="fas fa-backward"></i>
          </button>
          <button className="text-white text-3xl hover:text-green-500 transition-colors">
            <i className="fas fa-play"></i>
          </button>
          <button className="text-white text-xl hover:text-green-500 transition-colors">
            <i className="fas fa-forward"></i>
          </button>
        </div>

        {/* <!-- Регулятор громкости --> */}
        <div className="flex items-center gap-3">
          <i className="fas fa-volume-up text-gray-400"></i>
          <input
            type="range"
            min="0"
            max="100"
            value="80"
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
        </div>
      </div>
    </body>
  );
};

export default AudioVisualiserMain;
