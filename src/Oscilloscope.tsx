import react from "react";
import { useCallback, useEffect, useRef } from "react";

interface OscilloscopeProps {
  audioVizData: Array<number>;
  color: string;
  height: number;
  width: number;
}

const Oscilloscope = ({
  audioVizData,
  color,
  height,
  width,
}: OscilloscopeProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);

  const drawWaveform = useCallback((): void => {
    const context = canvas?.current?.getContext("2d");

    if (context !== null && context !== undefined) {
      let x = 0;
      const sliceWidth = width / audioVizData.length;
      context.lineWidth = 2;
      context.strokeStyle = color;
      context.clearRect(0, 0, width, height);

      context.beginPath();
      context.moveTo(0, height / 2);

      for (const val of audioVizData) {
        const y = height / 2 + val * height;
        context.lineTo(x, y);
        x += sliceWidth;
      }

      context.lineTo(x, height / 2);
      context.stroke();
    }
  }, [audioVizData, color, height, width]);

  useEffect(() => {
    if (audioVizData?.length > 0) {
      drawWaveform();
    }
  }, [audioVizData, drawWaveform]);

  return <canvas width={width} height={height} ref={canvas} />;
};

export default Oscilloscope;
