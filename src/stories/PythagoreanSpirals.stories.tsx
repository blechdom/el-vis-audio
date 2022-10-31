import React, { useState, useEffect } from "react";
import { el } from "@elemaudio/core";
import { Meta, Story } from "@storybook/react";
import styled from "styled-components";
import {
  core,
  Button,
  Oscilloscope,
  PlayPauseAudio,
  Slider,
  exponentialScale,
} from "../";
require("events").EventEmitter.defaultMaxListeners = 0;

const Demo = () => {
  const [playing, setPlaying] = useState(false);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);
  const [mainVolume, setMainVolume] = useState<number>(0);
  const [startingFrequency, setStartingFrequency] = useState<number>(15);
  const [scaledStartingFrequency, setScaledStartingFrequency] =
    useState<number>(0);
  const [frequency, setFrequency] = useState<number>(0);
  const [speedInMs, setSpeedInMs] = useState<number>(12);
  const [scaledSpeedInMs, setScaledSpeedInMs] = useState<number>(100);
  const [upperLimit, setUpperLimit] = useState<number>(20);
  const [scaledUpperLimit, setScaledUpperLimit] = useState<number>(0);
  const [lowerLimit, setLowerLimit] = useState<number>(20);
  const [scaledLowerLimit, setScaledLowerLimit] = useState<number>(0);
  const [intervalDivisor, setIntervalDivisor] = useState<number>(0.25);
  const [scaledIntervalDivisor, setScaledIntervalDivisor] = useState<number>(0);

  const [presets, setPresets] = useState([
    [16.49, 10, 20, 20, 1.76],
    [14.63, 6.98, 21.11, 18.46, 0.74],
    [15, 11.56, 17.35, 9.08, 5.09],
    [12.75, 8.96, 21.11, 9.08, 5.99],
    [10.8, 3.68, 23.29, 11.63, 1.41],
    [10.72, 11.01, 22.85, 10.45, 3.01],
    [7.76, 10.95, 12.21, 4.09, 6.96],
  ]);

  useEffect(() => {
    const scaledFreq = exponentialScale(startingFrequency);
    setScaledStartingFrequency(scaledFreq);
    setFrequency(scaledFreq);
  }, [startingFrequency, scaledStartingFrequency]);

  useEffect(() => {
    const scaledFreq = exponentialScale(upperLimit);
    setScaledUpperLimit(scaledFreq);
  }, [upperLimit, scaledUpperLimit]);

  useEffect(() => {
    const scaledFreq = exponentialScale(lowerLimit);
    setScaledLowerLimit(scaledFreq);
  }, [lowerLimit, scaledLowerLimit]);

  useEffect(() => {
    const scaledFreq = exponentialScale(speedInMs);
    setScaledSpeedInMs(scaledFreq);
  }, [speedInMs, scaledSpeedInMs]);

  useEffect(() => {
    const scaledFreq = exponentialScale(intervalDivisor);
    setScaledIntervalDivisor(scaledFreq / 10);
  }, [intervalDivisor, scaledIntervalDivisor]);

  useEffect(() => {
    if (scaledLowerLimit > scaledUpperLimit) {
      setLowerLimit(upperLimit);
    }
  }, [upperLimit, scaledLowerLimit, scaledUpperLimit]);

  core.on("metro", function () {
    let nextFreq = frequency * scaledIntervalDivisor;
    if (nextFreq > scaledUpperLimit) {
      do {
        nextFreq = nextFreq / 2;
      } while (nextFreq > scaledLowerLimit);
    }
    setFrequency(nextFreq);
  });

  useEffect(() => {
    if (playing) {
      let metro = el.metro({ key: `metro`, interval: scaledSpeedInMs });
      let env = el.adsr(0.1, 0.4, 0, 0.2, metro);
      core.render(el.mul(0, metro));
      const synth = el.mul(
        el.cycle(el.const({ key: `main-freq`, value: frequency })),
        env
      );
      core.render(
        el.scope(
          { name: "scope" },
          el.mul(
            synth,
            el.sm(el.const({ key: `main-amp-left`, value: mainVolume / 100 }))
          )
        ),
        el.mul(
          synth,
          el.sm(el.const({ key: `main-amp-right`, value: mainVolume / 100 }))
        )
      );
    }
  }, [mainVolume, core, frequency, scaledSpeedInMs, playing]);

  function loadPreset(i: number): void {
    setStartingFrequency(presets[i][0]);
    setSpeedInMs(presets[i][1]);
    setUpperLimit(presets[i][2]);
    setLowerLimit(presets[i][3]);
    setIntervalDivisor(presets[i][4]);
  }

  function addNewPreset() {
    setPresets((presets) => [
      ...presets,
      [startingFrequency, speedInMs, upperLimit, lowerLimit, intervalDivisor],
    ]);
  }

  function handleScopeData(data: Array<Array<number>>) {
    if (data.length) {
      setAudioVizData(data[0]);
    }
  }

  core?.on("scope", function (e) {
    if (e.source === "scope") {
      handleScopeData(e.data);
    }
  });

  return (
    <>
      <h1>Pythagorean Spirals</h1>
      <PlayPauseAudio onPlay={setPlaying} />
      <Oscilloscope
        audioVizData={audioVizData}
        color={"#FF0000"}
        width={400}
        height={100}
      />
      <Presets>
        {presets.map((preset, i) => (
          <StyledButton
            key={`preset-${i}`}
            onClick={() => loadPreset(i)}
            label={`Preset ${i + 1}`}
          />
        ))}
      </Presets>
      <div>
        <StyledButton
          key={`plus`}
          onClick={addNewPreset}
          label={`+ Add Preset`}
        />
      </div>
      <h3>Frequency: {frequency.toFixed(3)}</h3>
      <h2>
        main volume = <SliderLabel>{mainVolume}</SliderLabel>
      </h2>
      <Slider
        value={mainVolume}
        min={0}
        step={0.1}
        max={100}
        onChange={(event) => setMainVolume(parseFloat(event.target.value))}
      />
      <h2>
        starting frequency (hz) ={" "}
        <SliderLabel>{scaledStartingFrequency.toFixed(3)}</SliderLabel>
      </h2>
      <Slider
        value={startingFrequency}
        min={5}
        step={0.01}
        max={30}
        onChange={(event) =>
          setStartingFrequency(parseFloat(event.target.value))
        }
      />
      <h2>
        speed (ms) = <SliderLabel>{scaledSpeedInMs.toFixed(3)}</SliderLabel>
      </h2>
      <Slider
        value={speedInMs}
        min={0}
        step={0.01}
        max={20}
        onChange={(event) => setSpeedInMs(parseFloat(event.target.value))}
      />
      <h2>
        upper limit (hz) ={" "}
        <SliderLabel>{scaledUpperLimit.toFixed(3)}</SliderLabel>
      </h2>
      <Slider
        value={upperLimit}
        min={5}
        step={0.01}
        max={30}
        onChange={(event) => setUpperLimit(parseFloat(event.target.value))}
      />
      <h2>
        lower limit (hz) ={" "}
        <SliderLabel>{(scaledLowerLimit / 2).toFixed(3)}</SliderLabel>
      </h2>
      <Slider
        value={lowerLimit}
        min={3}
        step={0.01}
        max={upperLimit}
        onChange={(event) => setLowerLimit(parseFloat(event.target.value))}
      />
      <h2>
        interval divisor (2.0 = octave) ={" "}
        <SliderLabel>{scaledIntervalDivisor.toFixed(3)}</SliderLabel>
      </h2>
      <Slider
        value={intervalDivisor}
        min={0}
        step={0.01}
        max={17}
        onChange={(event) => setIntervalDivisor(parseFloat(event.target.value))}
      />
    </>
  );
};

const StyledButton = styled(Button)`
  background-color: #0f9ff5;
  color: #ffffff;
  border: none;
  margin: 0.5em 0.5em 0.5em 0;
  padding: 0.5em;
  :hover {
    background-color: #ffab00;
    color: #000000;
  }
`;

const SliderLabel = styled.span`
  display: inline-block;
  width: 150px;
  text-align: left;
`;

const Presets = styled.div`
  margin-right: 25px;
`;

const meta: Meta = {
  title: "experiments/Pythagorean Spirals",
  component: Demo,
};

export default meta;

const Template: Story = () => <Demo />;

export const Default = Template.bind({});
