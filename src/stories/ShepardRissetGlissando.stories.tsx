import React, { useCallback, useEffect, useMemo, useState } from "react";
import { el, NodeRepr_t } from "@elemaudio/core";
import { Meta, Story } from "@storybook/react";
import styled from "styled-components";
import {
  core,
  Oscilloscope,
  Spectrogram,
  PlayPauseAudio,
  Slider,
  Presets,
} from "../";
require("events").EventEmitter.defaultMaxListeners = 0;

type ShepardRissetGlissandoPreset = [number, number, number, number, boolean];

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
  const [presetList, setPresetList] = useState<ShepardRissetGlissandoPreset[]>([
    [8, 0.05, 100, 2, true],
    [8, 0.05, 200, 1.5, false],
    [2, 5.0, 135, 3.7, true],
    [8, 0.06, 660, 0.12, false],
    [6, 0.75, 212, 4, true],
  ]);
  const [currentSetting, setCurrentSetting] =
    useState<ShepardRissetGlissandoPreset>(presetList[0]);

  useMemo(() => {
    setCurrentSetting([
      numVoices,
      speed,
      startFreq,
      intervalRatio,
      directionUp,
    ]);
  }, [numVoices, speed, startFreq, intervalRatio, directionUp]);

  function updatePresetList(presetList: ShepardRissetGlissandoPreset[]) {
    setPresetList(presetList);
  }

  function handleLeftScopeData(data: Array<Array<number>>) {
    if (data.length) {
      setAudioVizData(data[0]);
    }
  }
  function handleLeftFftData(data: any) {
    setFftVizData(data.real);
  }

  const playSynth = useCallback(() => {
    function phasedPhasor(key: string, speed: number, phaseOffset: number) {
      const smoothSpeed = el.sm(
        el.const({ key: `phased-phasor-speed`, value: speed })
      );
      let t = el.add(
        el.phasor(smoothSpeed, 0),
        el.sm(
          el.const({ key: `${key}:phased-phasor-offset`, value: phaseOffset })
        )
      );
      return el.sub(t, el.floor(t));
    }

    function phasedCycle(key: string, speed: number, phaseOffset: number) {
      let p = phasedPhasor(key, speed, phaseOffset);
      let offset = el.sub(
        el.mul(2 * Math.PI, p),
        el.const({ key: `phased-cycle-offset`, value: 1.5 })
      );
      return el.mul(el.add(el.sin(offset), 1), 0.5);
    }
    const freqRange = el.sm(
      el.const({
        key: `freq-range`,
        value: startFreq * intervalRatio * numVoices,
      })
    );
    const smoothStartFreq = el.sm(
      el.const({ key: `start-freq`, value: startFreq })
    );

    function rampingSine(key: string, phaseOffset: number) {
      const modulatorUp = phasedPhasor(key, speed, phaseOffset);
      const modulatorDown = el.sub(1.0, modulatorUp);
      const modulator = directionUp ? modulatorUp : modulatorDown;
      return el.mul(
        el.cycle(
          el.add(el.mul(el.pow(modulator, 2), freqRange), smoothStartFreq)
        ),
        phasedCycle(key, speed, phaseOffset)
      );
    }

    const allVoices = [...Array(numVoices)].map((_, i) => {
      const key = `voice-${i}`;
      const phaseOffset = (1 / numVoices) * i;
      const voice = rampingSine(key, phaseOffset);
      return el.mul(
        voice,
        el.sm(el.const({ key: `scale-amp-by-numVoices`, value: 1 / numVoices }))
      );
    });

    function addMany(ins: NodeRepr_t[]): NodeRepr_t {
      if (ins.length < 9) {
        return el.add(...ins) as NodeRepr_t;
      }
      return el.add(...ins.slice(0, 7), addMany(ins.slice(8))) as NodeRepr_t;
    }
    const synth = el.mul(
      addMany(allVoices as NodeRepr_t[]),
      el.sm(el.const({ key: `main-amp`, value: mainVolume / 100 }))
    );
    const analyzedSynth = el.scope(
      { name: "left" },
      el.fft({ name: "left-fft" }, synth)
    );
    core.render(analyzedSynth, analyzedSynth);
  }, [
    numVoices,
    mainVolume,
    core,
    speed,
    directionUp,
    startFreq,
    intervalRatio,
  ]);

  useEffect(() => {
    if (playing) {
      playSynth();
    }
  }, [playing, playSynth]);

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
      <Presets
        allowAdd
        allowEdit
        allowLocalStorage
        presetsName="Shepard-Risset-Glissando-Storybook"
        currentSetting={currentSetting}
        presetList={presetList}
        onUpdateCurrentPreset={(i) => setCurrentSetting(presetList[i])}
        onUpdatePresetList={updatePresetList}
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
          checked={currentSetting[4]}
          onChange={(event) => setDirectionUp(event.target.checked)}
        />
      </h2>
      <h2>
        number of voices = <SliderLabel>{currentSetting[0]}</SliderLabel>
      </h2>
      <Slider
        value={currentSetting[0]}
        min={1}
        step={1}
        max={64}
        onChange={(event) => setNumVoices(parseFloat(event.target.value))}
      />
      <h2>
        speed (hz) = <SliderLabel>{currentSetting[1].toFixed(3)}</SliderLabel>
      </h2>
      <Slider
        value={currentSetting[1]}
        min={0.01}
        step={0.01}
        max={10}
        onChange={(event) => setSpeed(parseFloat(event.target.value))}
      />
      <h2>
        starting frequency (hz) =
        <SliderLabel>{currentSetting[2].toFixed(3)}</SliderLabel>
      </h2>
      <Slider
        value={currentSetting[2]}
        min={10}
        step={0.01}
        max={3000}
        onChange={(event) => setStartFreq(parseFloat(event.target.value))}
      />
      <h2>
        interval ratio ={" "}
        <SliderLabel>{currentSetting[3].toFixed(3)}</SliderLabel>
      </h2>
      <Slider
        value={currentSetting[3]}
        min={0.01}
        step={0.01}
        max={8.0}
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
