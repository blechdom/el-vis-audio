import React, { FC, useCallback, useEffect, useRef } from "react";
import { toLog } from "./utils";
import { SpectrogramProps } from "./Spectrogram.types";

const Spectrogram: FC<SpectrogramProps> = ({
  fftVizData,
  color,
  height,
  width,
}: SpectrogramProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);

  const drawWaveform = useCallback((): void => {
    const context = canvas?.current?.getContext("2d");

    if (context !== null && context !== undefined) {
      context.lineWidth = 1;
      context.strokeStyle = color;
      context.clearRect(0, 0, width, height);

      fftVizData.forEach((val, index) => {
        const logindex = toLog(
          fftVizData.length - index,
          1,
          fftVizData.length + 1
        );
        let x = Math.floor(fftVizData.length - logindex);
        context.beginPath();
        context.moveTo(x, height);
        context.lineTo(x, height - Math.abs(val) * 2.5);
        context.stroke();
      });
    }
  }, [fftVizData, color, height, width]);

  useEffect(() => {
    if (fftVizData?.length > 0) {
      drawWaveform();
    }
  }, [fftVizData, drawWaveform]);

  return <canvas width={width} height={height} ref={canvas} />;
};

export default Spectrogram;
