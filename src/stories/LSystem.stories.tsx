import React, { useCallback, useEffect, useRef, useState } from "react";
import { LTimeSystem, TLTimePoint } from "../utils/fractals";
import styled from "styled-components";
import { Slider } from "../";
import { lSystemPresets, LSystemParams } from "../utils/lSystemPresets";
import { Meta, Story } from "@storybook/react";
require("events").EventEmitter.defaultMaxListeners = 0;

const Demo = () => {
  const [currentLSystem, setCurrentLSystem] = useState<LSystemParams>(
    lSystemPresets[0]
  );

  const [fractalPoints, setFractalPoints] = useState<TLTimePoint[]>([]);
  const [dimensions, setDimensions] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [offsets, setOffsets] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [scaleX, setScaleX] = useState<number>(1);
  const [scaleY, setScaleY] = useState<number>(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fractal = new LTimeSystem(currentLSystem);
    fractal.run();
    setFractalPoints(fractal.points);

    setOffsets({ x: -fractal.bounds[2], y: -fractal.bounds[3] });
    setDimensions({
      x: fractal.bounds[0] + Math.abs(fractal.bounds[2]),
      y: fractal.bounds[1] + Math.abs(fractal.bounds[3]),
    });
  }, [currentLSystem]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = dimensions.y * scaleX;
      canvas.height = dimensions.x * scaleY;
      const context = canvas.getContext("2d");
      if (context) {
        context.save();

        for (let i = 1; i < fractalPoints.length; i++) {
          const [x, y, depth, { paintable }] = fractalPoints[i];
          const color = ((depth + 1) * 75) % 255;
          if (!paintable) {
            continue;
          }
          context.beginPath();
          const [startX, startY] = fractalPoints[i - 1];
          context.strokeStyle = `hsl(${color}, 100%, 50%)`;
          context.moveTo(startY * scaleX * -1, (startX + offsets.x) * scaleY);
          context.lineTo(y * scaleX * -1, (x + offsets.x) * scaleY);
          context.stroke();
          context.closePath();
        }
        context.restore();
      }
    }
  }, [offsets, dimensions, fractalPoints, scaleX, scaleY]);

  let handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentLSystem(lSystemPresets[parseInt(event.target.value)]);
  };

  return (
    <>
      <h1>L-System</h1>
      <select onChange={handlePresetChange}>
        {lSystemPresets.map((system, index) => (
          <option key={`lSystemPreset-${index}`} value={index}>
            {system.name}
          </option>
        ))}
      </select>
      <h2>
        scale time = <SliderLabel>{scaleY}</SliderLabel>
      </h2>
      <Slider
        value={scaleY}
        min={0.1}
        step={0.1}
        max={100}
        onChange={(event) => setScaleY(parseFloat(event.target.value))}
      />
      <h2>
        scale frequency = <SliderLabel>{scaleX}</SliderLabel>
      </h2>
      <Slider
        value={scaleX}
        min={0.1}
        step={0.1}
        max={100}
        onChange={(event) => setScaleX(parseFloat(event.target.value))}
      />
      <br />
      <br />
      <canvas ref={canvasRef} />
    </>
  );
};

const PlayButton = styled.button`
  background-color: #09ab45;
  color: #ffffff;
  border: none;
  width: 160px;
  margin: 0 2em 2em 0;
  :hover {
    background-color: #ff55ff;
    color: #000000;
  }
`;

const SliderLabel = styled.span`
  display: inline-block;
  width: 150px;
  text-align: left;
`;

const meta: Meta = {
  title: "generative/L-Systems",
  component: Demo,
};

export default meta;

const Template: Story = () => <Demo />;

export const Default = Template.bind({});
