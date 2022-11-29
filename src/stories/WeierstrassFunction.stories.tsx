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

type WeierstrassFunctionPreset = [number, number, number, number];

const Demo = () => {
  const [playing, setPlaying] = useState(false);
  const [mainVolume, setMainVolume] = useState<number>(0);
  const [numVoices, setNumVoices] = useState<number>(1);
  const [varA, setVarA] = useState<number>(0.5);
  const [varB, setVarB] = useState<number>(1);
  const [fundamental, setFundamental] = useState<number>(1);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);
  const [fftVizData, setFftVizData] = useState<Array<number>>([]);
  const [presetList, setPresetList] = useState<WeierstrassFunctionPreset[]>([
    [440, 1, 0.5, 1.34],
    [100, 1, 0.05, 2],
    [200, 2, 0.333, 1],
    [0.01, 8, 0.06, 7.23],
    [5, 4, 0.5, 5],
  ]);
  const [currentSetting, setCurrentSetting] =
    useState<WeierstrassFunctionPreset>(presetList[0]);

  useMemo(() => {
    setCurrentSetting([fundamental, numVoices, varA, varB]);
  }, [numVoices, varA, varB, fundamental]);

  function updatePresetList(presetList: WeierstrassFunctionPreset[]) {
    setPresetList(presetList);
  }

  function handleScopeData(data: Array<Array<number>>) {
    if (data.length) {
      setAudioVizData(data[0]);
    }
  }
  function handleFftData(data: any) {
    setFftVizData(data.real);
  }

  const playSynth = useCallback(() => {
    function weierstrasseIteration(i: number) {
      /*console.log(
        "weierstrass voice: ",
        i,
        " fundamental ",
        fundamental,
        " varA ",
        varA,
        " varB ",
        varB
      );*/

      // return el.cos(el.mul(2 * Math.PI, el.phasor(fundamental, 0)));
      return el.mul(
        el.pow(
          el.const({ key: `varA`, value: varA }),
          el.const({ key: `exponent-is-${i}`, value: i })
        ),
        el.cos(
          el.mul(
            el.phasor(el.const({ key: `fundamental`, value: fundamental }), 0),
            el.mul(
              2 * Math.PI,
              el.pow(
                el.const({ key: `varB`, value: varB }),
                el.const({ key: `exponent-is-${i}`, value: i })
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
    const synth = el.mul(
      addMany(allVoices as NodeRepr_t[]),
      el.sm(el.const({ key: `main-amp`, value: mainVolume / 100 }))
    );
    const analyzedSynth = el.scope(
      { name: "scope" },
      el.fft({ name: "fft" }, synth)
    );
    core.render(analyzedSynth, analyzedSynth);
  }, [numVoices, mainVolume, core, varA, varB, fundamental]);

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
        fundamental = <SliderLabel>{currentSetting[0]}</SliderLabel>
      </h2>
      <Slider
        value={currentSetting[0]}
        min={0.01}
        max={200}
        onChange={(event) => setFundamental(parseFloat(event.target.value))}
      />
      <h2>
        number of voices = <SliderLabel>{currentSetting[1]}</SliderLabel>
      </h2>
      <Slider
        value={currentSetting[1]}
        min={1}
        step={1}
        max={64}
        onChange={(event) => setNumVoices(parseFloat(event.target.value))}
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
