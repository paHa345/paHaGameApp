import React, { memo, useEffect, useRef } from "react";

interface IGTSGameAudioVisualiserProps {
  audioRef?: React.RefObject<HTMLAudioElement>;
}
const GTSGameAudioVisualiser = ({ audioRef }: IGTSGameAudioVisualiserProps) => {
  const canvasRef = useRef(null) as any;
  const source = useRef(null) as any;
  //   const analyserRef = useRef(null) as any;

  let analyser: any;

  //   const showVisualiserHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
  //     e.preventDefault();
  //     const audioContext = new AudioContext();
  //     if (!source.current && canvasRef.current !== null) {

  //         audioRef.current.crossOrigin = "anonymous";

  //       source.current = audioContext.createMediaElementSource(audioElement);
  //       analyser = audioContext.createAnalyser();
  //       source.current.connect(analyser);
  //       source.current.connect(audioContext.destination);
  //     //   console.log(source);
  //       var ctx = canvasRef.current.getContext("2d");

  //       analyser.fftSize = 1024;

  //       var bufferLength = analyser.frequencyBinCount;
  //       console.log(bufferLength);

  //       var dataArray = new Uint8Array(bufferLength);

  //       var WIDTH = canvasRef.current.width;
  //       var HEIGHT = canvasRef.current.height;

  //       var barWidth = (WIDTH / bufferLength) * 0.9;
  //       var barHeight;
  //       var x = 0;

  //       function renderFrame() {
  //         requestAnimationFrame(renderFrame);

  //         x = 0;

  //         analyser.getByteFrequencyData(dataArray);

  //         ctx.fillStyle = "rgb(230, 230, 250)";
  //         ctx.fillRect(0, 0, WIDTH, HEIGHT);

  //         for (var i = 0; i < bufferLength; i++) {
  //           barHeight = dataArray[i];

  //           // console.log(barHeight);

  //           var r = barHeight + 2 * (i / bufferLength);
  //           var g = 5 * (i / bufferLength) + 80;
  //           var b = 30;

  //           ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
  //           ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

  //           x += barWidth + 1;
  //         }
  //       }

  //       renderFrame();
  //     }
  //   };

  useEffect(() => {
    if (audioRef) {
      const audioContext = new AudioContext();
      if (!source.current && canvasRef.current !== null && audioRef.current !== null) {
        audioRef.current.crossOrigin = "anonymous";

        source.current = audioContext.createMediaElementSource(audioRef.current);
        analyser = audioContext.createAnalyser();
        source.current.connect(analyser);
        source.current.connect(audioContext.destination);
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
    }
  }, [audioRef]);

  return (
    <div id="content">
      <canvas
        id="canvas"
        ref={canvasRef}
        height={170}
        className=" w-full absolute top-0 left-0 z-10"
      ></canvas>
    </div>
  );
};

export default memo(GTSGameAudioVisualiser);
