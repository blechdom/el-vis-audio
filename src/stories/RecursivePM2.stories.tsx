import React, { useState, useCallback, useEffect, useMemo } from "react";
import { el, NodeRepr_t } from "@elemaudio/core";
import { Meta, Story } from "@storybook/react";
import styled from "styled-components";
import {
  core,
  Button,
  Oscilloscope,
  PlayPauseAudio,
  Slider,
  Presets,
  Spectrogram,
} from "../.";
require("events").EventEmitter.defaultMaxListeners = 0;

type RecursivePM2Preset = [number, number, number, number, number, number];
const Demo = () => {
  const [playing, setPlaying] = useState(false);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);
  const [fftVizData, setFftVizData] = useState<Array<number>>([]);
  const [steps, setSteps] = useState<number>(1);
  const [indexOfMod, setIndexOfMod] = useState<number>(1);
  const [carrierFreq, setCarrierFreq] = useState<number>(400);
  const [startModFreq, setStartModFreq] = useState<number>(1);
  const [freqDiv, setFreqDiv] = useState<number>(1);
  const [indexDiv, setIndexDiv] = useState<number>(1);
  const [mainVolume, setMainVolume] = useState<number>(0);

  function cycleByPhasor(phasor: NodeRepr_t | number) {
    return el.sin(el.mul(2 * Math.PI, phasor));
  }

  const recursiveModulatedCycle = useCallback(
    (
      signal: NodeRepr_t,
      modFreq: number,
      indexOfModulation: number,
      count: number
    ): NodeRepr_t => {
      const smoothFreqDiv: NodeRepr_t = el.sm(
        el.const({ key: `freqDiv-${count}`, value: 1 / freqDiv })
      );
      const smoothIndexDiv: NodeRepr_t = el.sm(
        el.const({ key: `indexDiv-${count}`, value: 1 / indexDiv })
      );

      return count > 0
        ? recursiveModulatedCycle(
            cycleByPhasor(
              el.mod(
                el.add(
                  el.phasor(
                    el.sm(
                      el.const({ key: `modFreq-${count}`, value: modFreq })
                    ),
                    0
                  ),
                  el.mul(
                    signal,
                    el.sm(
                      el.const({
                        key: `index-${count}`,
                        value: indexOfModulation,
                      })
                    )
                  )
                ),
                1
              )
            ) as NodeRepr_t,
            modFreq / freqDiv,
            indexOfModulation / indexDiv,
            count - 1
          )
        : signal;
    },
    [freqDiv, indexDiv]
  );

  useEffect(() => {
    if (playing) {
      const smoothCarrierFreq: NodeRepr_t = el.sm(
        el.const({ key: `carrierFreq`, value: carrierFreq })
      );

      const carrier = cycleByPhasor(
        el.phasor(smoothCarrierFreq, 0)
      ) as NodeRepr_t;

      const synth = recursiveModulatedCycle(
        carrier,
        startModFreq,
        indexOfMod,
        steps
      );

      const scaledSynth = el.mul(
        synth,
        el.sm(el.const({ key: `main-amp`, value: mainVolume / 100 }))
      );
      const analyzedSynth = el.scope(
        { name: "scope" },
        el.fft({ name: "fft" }, scaledSynth)
      );
      core.render(analyzedSynth, analyzedSynth);
    }
  }, [
    indexOfMod,
    steps,
    carrierFreq,
    startModFreq,
    mainVolume,
    core,
    playing,
    freqDiv,
    indexDiv,
  ]);

  const [presetList, setPresetList] = useState<RecursivePM2Preset[]>([
    [3, 3, 22, 0.16, 1.4, 1.46],
    [3, 7.29, 372.64, 4.98, 5.14, 6.25],
    [4, 1.82, 10.94, 7.16, 4.29, 2.44],
    [4, 182, 12, 3.14, 1.5, 2.67],
    [10, 1173, 42, 2.34, 0.12, 0.86],
  ]);
  const [currentSetting, setCurrentSetting] = useState<RecursivePM2Preset>(
    presetList[0]
  );

  useEffect(() => {
    setPlaying(false);
    setCurrentSetting(presetList[0]);
    updateCurrentPreset(0);
  }, []);

  useMemo(() => {
    setCurrentSetting([
      steps,
      carrierFreq,
      startModFreq,
      freqDiv,
      indexOfMod,
      indexDiv,
    ]);
  }, [steps, carrierFreq, startModFreq, freqDiv, indexOfMod, indexDiv]);

  function updatePresetList(presetList: RecursivePM2Preset[]) {
    setPresetList(presetList);
  }

  function updateCurrentPreset(presetNumber: number) {
    const preset = presetList[presetNumber];
    setSteps(preset[0]);
    setCarrierFreq(preset[1]);
    setStartModFreq(preset[2]);
    setFreqDiv(preset[3]);
    setIndexOfMod(preset[4]);
    setIndexDiv(preset[5]);
  }

  function handleScopeData(data: Array<Array<number>>) {
    if (data.length) {
      setAudioVizData(data[0]);
    }
  }

  function handleFftData(data: any) {
    setFftVizData(data.real);
  }

  core?.on("scope", function (e) {
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
      <h1>Recursive PM v2</h1>
      <PlayPauseAudio onPlay={setPlaying} />
      <Oscilloscope
        audioVizData={audioVizData}
        color={"#FF0000"}
        width={400}
        height={100}
      />
      <br />
      <Spectrogram
        height={200}
        width={500}
        fftVizData={fftVizData}
        color="#1976d2"
      />
      <br />
      <Presets
        allowAdd
        allowEdit
        allowLocalStorage
        presetsName="recursive-pm-v2"
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
        number of recursions = <SliderLabel>{steps}</SliderLabel>
      </h2>
      <Slider
        value={steps}
        step={1}
        min={0}
        max={10}
        onChange={(event) => setSteps(parseFloat(event.target.value))}
      />
      <h2>
        carrier frequency = <SliderLabel>{carrierFreq}</SliderLabel>
      </h2>
      <Slider
        value={carrierFreq}
        step={0.01}
        min={0}
        max={1200}
        onChange={(event) => setCarrierFreq(parseFloat(event.target.value))}
      />
      <h2>
        modulator frequency = <SliderLabel>{startModFreq}</SliderLabel>
      </h2>
      <Slider
        value={startModFreq}
        step={0.01}
        min={0}
        max={400}
        onChange={(event) => setStartModFreq(parseFloat(event.target.value))}
      />
      <h2>
        modulation freq divisor = <SliderLabel>{freqDiv}</SliderLabel>
      </h2>
      <Slider
        value={freqDiv}
        min={0.01}
        step={0.01}
        max={8}
        onChange={(event) => setFreqDiv(parseFloat(event.target.value))}
      />
      <h2>
        index of modulation = <SliderLabel>{indexOfMod}</SliderLabel>
      </h2>
      <Slider
        value={indexOfMod}
        step={0.01}
        min={0}
        max={20}
        onChange={(event) => setIndexOfMod(parseFloat(event.target.value))}
      />
      <h2>
        index of modulation divisor = <SliderLabel>{indexDiv}</SliderLabel>
      </h2>
      <Slider
        value={indexDiv}
        min={0.01}
        step={0.01}
        max={8}
        onChange={(event) => setIndexDiv(parseFloat(event.target.value))}
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

const meta: Meta = {
  title: "experiments/Recursive PM v2",
  component: Demo,
};
export default meta;

const Template: Story = () => <Demo />;

export const Default = Template.bind({});
