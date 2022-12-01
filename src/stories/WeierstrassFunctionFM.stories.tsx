import React, { useCallback, useEffect, useMemo, useState } from "react";
import { el, NodeRepr_t } from "@elemaudio/core";
import { Meta, Story } from "@storybook/react";
import styled from "styled-components";
import {
  audioContext,
  core,
  Oscilloscope,
  Spectrogram,
  PlayPauseAudio,
  Slider,
  Presets,
} from "../";
require("events").EventEmitter.defaultMaxListeners = 0;

type WeierstrassFunctionFMPreset = [
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

const Demo = () => {
  const [playing, setPlaying] = useState(false);
  const [mainVolume, setMainVolume] = useState<number>(0);
  const [numVoices, setNumVoices] = useState<number>(1);
  const [varA, setVarA] = useState<number>(0.5);
  const [varB, setVarB] = useState<number>(1);
  const [fundamental, setFundamental] = useState<number>(1);
  const [lowestFormant, setLowestFormant] = useState<number>(0);
  const [modAmp, setModAmp] = useState<number>(600);
  const [startOffset, setStartOffset] = useState<number>(100);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);
  const [fftVizData, setFftVizData] = useState<Array<number>>([]);
  const [presetList, setPresetList] = useState<WeierstrassFunctionFMPreset[]>([
    [13.21, 28, 0.32, 5.01, 0, 700, 15.5],
    [85.21, 18, 0.87, 7.56, 10, 1800, 10],
    [0.01, 23, 0.8, 5, 0, 500, 100],
    [2.91, 2, 0.07, 6.55, 0, 640, 140],
    [5, 33, 0.49, 2.96, 0, 3000, 100],
  ]);
  const [currentSetting, setCurrentSetting] =
    useState<WeierstrassFunctionFMPreset>(presetList[0]);

  useEffect(() => {
    setPlaying(false);
    setCurrentSetting(presetList[0]);
    updateCurrentPreset(0);
  }, []);

  useMemo(() => {
    setCurrentSetting([
      fundamental,
      numVoices,
      varA,
      varB,
      lowestFormant,
      modAmp,
      startOffset,
    ]);
  }, [numVoices, varA, varB, fundamental, lowestFormant, modAmp, startOffset]);

  function updatePresetList(presetList: WeierstrassFunctionFMPreset[]) {
    setPresetList(presetList);
  }

  function updateCurrentPreset(presetNumber: number) {
    const preset = presetList[presetNumber];
    setFundamental(preset[0]);
    setNumVoices(preset[1]);
    setVarA(preset[2]);
    setVarB(preset[3]);
    setLowestFormant(preset[4]);
    setModAmp(preset[5]);
    setStartOffset(preset[6]);
  }

  function handleScopeData(data: Array<Array<number>>) {
    if (data.length) {
      setAudioVizData(data[0]);
    }
  }
  function handleFftData(data: any) {
    setFftVizData(data.real);
  }

  useEffect(() => {
    if (lowestFormant > numVoices - 1) {
      setLowestFormant(numVoices - 1);
    }
  }, [lowestFormant, numVoices]);
  const playSynth = useCallback(() => {
    function weierstrasseIteration(i: number) {
      let voiceIter = el.const({
        key: `lowestFormant-${i}`,
        value: lowestFormant + i,
      });
      return el.mul(
        el.pow(el.sm(el.const({ key: `varA-${i}`, value: varA })), voiceIter),
        el.cos(
          el.mul(
            el.mul(
              el.phasor(1 / 60, 0), // 60 seconds reset phasor
              el.sm(
                el.const({ key: `fundamental-${i}`, value: fundamental * 60 })
              )
            ),
            el.mul(
              Math.PI,
              el.pow(
                el.sm(el.const({ key: `varB-${i}`, value: varB })),
                voiceIter
              )
            )
          )
        )
      );
    }

    const allVoices = [...Array(numVoices)].map((_, i) => {
      return weierstrasseIteration(i);
    });

    function addMany(ins: NodeRepr_t[]): NodeRepr_t {
      if (ins.length < 9) {
        return el.add(...ins) as NodeRepr_t;
      }
      return el.add(...ins.slice(0, 7), addMany(ins.slice(8))) as NodeRepr_t;
    }
    if (allVoices && allVoices.length > 0) {
      const weierstrassWave = addMany(allVoices as NodeRepr_t[]);

      const fmSynth = el.cycle(
        el.add(
          el.mul(
            weierstrassWave,
            el.sm(el.const({ key: `start-amp`, value: modAmp }))
          ),
          el.sm(el.const({ key: `start-amp-offset`, value: startOffset }))
        )
      );

      const synth = el.mul(
        fmSynth,
        el.sm(el.const({ key: `main-amp`, value: mainVolume / 100 }))
      );

      const analyzedSynth = el.scope(
        { name: "scope" },
        el.fft({ name: "fft" }, synth)
      );
      core.render(analyzedSynth, analyzedSynth);
    }
  }, [
    numVoices,
    mainVolume,
    core,
    varA,
    varB,
    fundamental,
    lowestFormant,
    modAmp,
    startOffset,
  ]);

  useEffect(() => {
    if (playing) {
      playSynth();
    }
  }, [playing, playSynth]);

  core.on("scope", function (e) {
    if (e.source === "scope") {
      handleScopeData(e.data);
    }
  });

  core.on("fft", function (e) {
    if (e.source === "fft") {
      handleFftData(e.data);
    }
  });

  return (
    <>
      <h1>Weierstrass Function FM</h1>
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
        presetsName="weierstrass-function-fm"
        currentSetting={currentSetting}
        presetList={presetList}
        onUpdateCurrentPreset={updateCurrentPreset}
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
        fundamental = <SliderLabel>{currentSetting[0]}</SliderLabel>
      </h2>
      <Slider
        value={currentSetting[0]}
        min={0.01}
        max={400}
        onChange={(event) => setFundamental(parseFloat(event.target.value))}
      />
      <h2>
        number of voices = <SliderLabel>{currentSetting[1]}</SliderLabel>
      </h2>
      <Slider
        value={currentSetting[1]}
        min={1}
        step={1}
        max={48}
        onChange={(event) => setNumVoices(parseFloat(event.target.value))}
      />
      <h2>
        lowest formant =<SliderLabel>{currentSetting[4]}</SliderLabel>
      </h2>
      <Slider
        value={currentSetting[4]}
        min={0}
        step={1}
        max={numVoices - 1}
        onChange={(event) => setLowestFormant(parseFloat(event.target.value))}
      />
      <h2>
        varA = <SliderLabel>{currentSetting[2].toFixed(2)}</SliderLabel>
      </h2>
      <Slider
        value={currentSetting[2]}
        min={0}
        step={0.01}
        max={2}
        onChange={(event) => setVarA(parseFloat(event.target.value))}
      />
      <h2>
        varB =<SliderLabel>{currentSetting[3].toFixed(2)}</SliderLabel>
      </h2>
      <Slider
        value={currentSetting[3]}
        min={0}
        step={0.01}
        max={11}
        onChange={(event) => setVarB(parseFloat(event.target.value))}
      />
      <h2>
        modulation amplitude = <SliderLabel>{currentSetting[5]}</SliderLabel>
      </h2>
      <Slider
        value={currentSetting[5]}
        min={0}
        max={20000}
        onChange={(event) => setModAmp(parseFloat(event.target.value))}
      />
      <h2>
        starting offset (mod bias) ={" "}
        <SliderLabel>{currentSetting[6]}</SliderLabel>
      </h2>
      <Slider
        value={currentSetting[6]}
        min={0}
        max={modAmp * 2}
        onChange={(event) => setStartOffset(parseFloat(event.target.value))}
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
  title: "experiments/Weierstrass Function FM",
  component: Demo,
};

export default meta;

const Template: Story = () => <Demo />;

export const Default = Template.bind({});
