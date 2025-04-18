import React, { memo, useEffect, useRef } from "react";

interface IGTSGameAudioVisualiserProps {
  audioRef?: React.RefObject<HTMLAudioElement>;
}
const GTSGameAudioVisualiser = ({ audioRef }: IGTSGameAudioVisualiserProps) => {
  const canvasRef = useRef(null) as any;
  const audioRef2 = useRef<HTMLMediaElement>(null);
  const source = useRef(null) as any;
  const analyserRef = useRef(null) as any;

  let audioElement: any;
  let analyser: any;

  const showVisualiserHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("first");
    const audioContext = new AudioContext();
    if (!source.current && canvasRef.current !== null) {
      source.current = audioContext.createMediaElementSource(audioElement);
      analyser = audioContext.createAnalyser();
      source.current.connect(analyser);
      source.current.connect(audioContext.destination);
      console.log(source);
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

        ctx.fillStyle = "rgb(230, 230, 250)";
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
  };

  useEffect(() => {
    if (!audioRef) return;
    audioElement = audioRef2.current;

    console.log(audioRef2.current?.src);
    console.log(audioElement);
    if (audioElement && audioRef.current) {
      audioElement.src = audioRef.current?.src;
      //   audioElement.load();
      audioElement.play();

      //   if (!audioRef.current.played) {
      //     audioElement.pause();
      //   }
    }

    return () => {
      if (audioElement) {
        audioElement.src = "";
        audioElement = undefined;
      }
    };
  });

  return (
    <div id="content">
      <canvas id="canvas" ref={canvasRef} width={400} height={100}></canvas>
      <audio ref={audioRef2} id="audio" controls></audio>
      <div>
        <button onClick={showVisualiserHandler}>Show visualiser</button>
      </div>
    </div>
  );
};

export default memo(GTSGameAudioVisualiser);
