import React, { useCallback, useEffect, useState } from "react";
import { el } from "@elemaudio/core";
import { Meta, Story } from "@storybook/react";
import styled from "styled-components";
import { core, Oscilloscope, Spectrogram, PlayPauseAudio, Slider } from "../";
require("events").EventEmitter.defaultMaxListeners = 0;

const Demo = () => {
  const [playing, setPlaying] = useState(false);
  const [mainVolume, setMainVolume] = useState<number>(0);
  const [numVoices, setNumVoices] = useState<number>(8);
  const [speed, setSpeed] = useState<number>(0.05);
  const [startFreq, setStartFreq] = useState<number>(100);
  const [intervalRatio, setIntervalRatio] = useState<number>(2);
  const [directionUp, setDirectionUp] = useState<boolean>(true);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);
  const [fftVizData, setFftVizData] = useState<Array<number>>([]);

  function handleLeftScopeData(data: Array<Array<number>>) {
    if (data.length) {
      setAudioVizData(data[0]);
    }
  }

  function handleLeftFftData(data: any) {
    setFftVizData(data.real);
  }

  function phasedPhasor(speed: number, phaseOffset: number) {
    let t = el.add(el.phasor(speed, 0), phaseOffset);
    return el.sub(t, el.floor(t));
  }

  function phasedCycle(speed: number, phaseOffset: number) {
    return el.sin(el.mul(2 * Math.PI, phasedPhasor(speed, phaseOffset)));
  }

  function rampingSine(
    speed: number,
    phaseOffset: number,
    directionUp: boolean,
    startFreq: number,
    intervalRatio: number,
    numVoices: number
  ) {
    const modulatorUp = phasedPhasor(speed, phaseOffset);
    const modulatorDown = el.sub(1.0, modulatorUp);
    const modulator = directionUp ? modulatorUp : modulatorDown;
    let freqRange = startFreq * intervalRatio * numVoices;
    return el.mul(
      el.cycle(el.add(el.mul(el.pow(modulator, 2), freqRange), startFreq)),
      phasedCycle(speed / 2, phaseOffset / 2)
    );
  }

  useEffect(() => {
    if (playing) {
      const allVoices = [...Array(numVoices)].map((_, i) => {
        let phaseOffset = (1 / numVoices) * i;
        const voice = rampingSine(
          speed,
          phaseOffset,
          directionUp,
          startFreq,
          intervalRatio,
          numVoices
        );
        return el.mul(voice, 1 / numVoices);
      });

      const synth = el.add(...allVoices);
      core.render(
        el.scope(
          { name: "left" },
          el.fft(
            { name: "left-fft" },
            el.mul(
              synth,
              el.sm(el.const({ key: `main-amp-left`, value: mainVolume / 100 }))
            )
          )
        ),
        el.scope(
          { name: "right" },
          el.mul(
            synth,
            el.sm(el.const({ key: `main-amp-right`, value: mainVolume / 100 }))
          )
        )
      );
    }
  }, [
    mainVolume,
    core,
    speed,
    startFreq,
    intervalRatio,
    numVoices,
    directionUp,
  ]);

  core.on("scope", function (e) {
    if (e.source === "left") {
      handleLeftScopeData(e.data);
    }
  });

  core.on("fft", function (e) {
    if (e.source === "left-fft") {
      handleLeftFftData(e.data);
    }
  });

  return (
    <>
      <h1>Shepard-Risset Glissando</h1>
      <PlayPauseAudio onPlay={setPlaying} />
      <Oscilloscope
        height={200}
        width={500}
        audioVizData={audioVizData}
        color="#1976d2"
      />
      <Spectrogram
        height={200}
        width={500}
        fftVizData={fftVizData}
        color="#1976d2"
      />

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
        direction up?{"   "}
        <input
          type={"checkbox"}
          checked={directionUp}
          onChange={(event) => setDirectionUp(event.target.checked)}
        />
      </h2>
      <h2>
        number of voices = <SliderLabel>{numVoices}</SliderLabel>
      </h2>
      <Slider
        value={numVoices}
        min={1}
        step={1}
        max={8}
        onChange={(event) => setNumVoices(parseFloat(event.target.value))}
      />
      <h2>
        speed (hz) = <SliderLabel>{speed.toFixed(3)}</SliderLabel>
      </h2>
      <Slider
        value={speed}
        min={0.01}
        step={0.01}
        max={5}
        onChange={(event) => setSpeed(parseFloat(event.target.value))}
      />
      <h2>
        starting frequency (hz) ={" "}
        <SliderLabel>{startFreq.toFixed(3)}</SliderLabel>
      </h2>
      <Slider
        value={startFreq}
        min={20}
        step={0.01}
        max={2000}
        onChange={(event) => setStartFreq(parseFloat(event.target.value))}
      />
      <h2>
        interval ratio (octave is 2) ={" "}
        <SliderLabel>{intervalRatio.toFixed(3)}</SliderLabel>
      </h2>
      <Slider
        value={intervalRatio}
        min={0}
        step={0.01}
        max={4.0}
        onChange={(event) => setIntervalRatio(parseFloat(event.target.value))}
      />
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
  title: "experiments/Shepard-Risset Glissando",
  component: Demo,
};
export default meta;

const Template: Story = () => <Demo />;

export const Default = Template.bind({});
