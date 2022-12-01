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

type WeierstrassFunctionPreset = [number, number, number, number, number];
let scaleAmpAmount: number = 0;

const Demo = () => {
  const [playing, setPlaying] = useState(false);
  const [mainVolume, setMainVolume] = useState<number>(0);
  const [numVoices, setNumVoices] = useState<number>(1);
  const [varA, setVarA] = useState<number>(0.5);
  const [varB, setVarB] = useState<number>(1);
  const [fundamental, setFundamental] = useState<number>(1);
  const [lowestFormant, setLowestFormant] = useState<number>(0);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);
  const [fftVizData, setFftVizData] = useState<Array<number>>([]);
  const [presetList, setPresetList] = useState<WeierstrassFunctionPreset[]>([
    [1.81, 9, 0.91, 7.07, 2],
    [137, 13, 0.71, 1.41, 0],
  ]);
  const [currentSetting, setCurrentSetting] =
    useState<WeierstrassFunctionPreset>(presetList[0]);

  useEffect(() => {
    setPlaying(false);
    setCurrentSetting(presetList[0]);
    updateCurrentPreset(0);
  }, []);

  useMemo(() => {
    setCurrentSetting([fundamental, numVoices, varA, varB, lowestFormant]);
  }, [numVoices, varA, varB, fundamental, lowestFormant]);

  function updatePresetList(presetList: WeierstrassFunctionPreset[]) {
    setPresetList(presetList);
  }

  function updateCurrentPreset(presetNumber: number) {
    const preset = presetList[presetNumber];
    setFundamental(preset[0]);
    setNumVoices(preset[1]);
    setVarA(preset[2]);
    setVarB(preset[3]);
    setLowestFormant(preset[4]);
  }

  function handleScopeData(data: Array<Array<number>>) {
    if (data.length) {
      setAudioVizData(data[0]);
    }
  }
  function handleFftData(data: any) {
    setFftVizData(data.real);
  }

  const weierstrasseIteration = useCallback(
    (i: number) => {
      scaleAmpAmount += Math.pow(varA, lowestFormant + i);
      let voiceIter = el.const({
        key: `lowestFormant-${lowestFormant + i}`,
        value: lowestFormant + i,
      });
      return el.mul(
        el.pow(
          el.sm(el.const({ key: `varA-${lowestFormant + i}`, value: varA })),
          voiceIter
        ),
        el.cos(
          el.mul(
            el.mul(
              el.phasor(1 / 60, 0), // 60 seconds reset phasor
              el.sm(
                el.const({
                  key: `fundamental-${lowestFormant + i}`,
                  value: fundamental * 60,
                })
              )
            ),
            el.mul(
              Math.PI,
              el.pow(
                el.sm(
                  el.const({ key: `varB-${lowestFormant + i}`, value: varB })
                ),
                voiceIter
              )
            )
          )
        )
      );
    },
    [lowestFormant, varA, varB, fundamental]
  );
  // TODO: add to audio utilities
  function addMany(ins: NodeRepr_t[]): NodeRepr_t {
    if (ins.length < 9) {
      return el.add(...ins) as NodeRepr_t;
    }
    return el.add(...ins.slice(0, 7), addMany(ins.slice(8))) as NodeRepr_t;
  }

  const playSynth = useCallback(() => {
    const allVoices = [...Array(numVoices)]
      .map((_, i) => {
        scaleAmpAmount = i === 0 ? 0 : scaleAmpAmount;
        return weierstrasseIteration(i) as NodeRepr_t;
      })
      .filter((_, i) => {
        return (
          Math.PI * Math.pow(varB, i + lowestFormant) * fundamental <
          audioContext.sampleRate / 2
        );
      });
    if (allVoices && allVoices.length > 0) {
      const synth = el.mul(
        addMany(allVoices as NodeRepr_t[]),
        el.sm(
          el.const({
            key: `main-amp`,
            value: mainVolume / 100 / scaleAmpAmount,
          })
        )
      );

      const analyzedSynth = el.scope(
        { name: "scope" },
        el.fft({ name: "fft" }, synth)
      );
      core.render(analyzedSynth, analyzedSynth);
    }
  }, [numVoices, mainVolume, core, varA, varB, fundamental, lowestFormant]);

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
      <h1>Weierstrass Function</h1>
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
        presetsName="weierstrass-function"
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
        max={1000}
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
  title: "experiments/Weierstrass Function",
  component: Demo,
};

export default meta;

const Template: Story = () => <Demo />;

export const Default = Template.bind({});
