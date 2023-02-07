import React, { FC, useCallback, useEffect, useMemo } from "react";
import { el, NodeRepr_t } from "@elemaudio/core";
import styled from "styled-components";
import useMemoizedState from "./hooks/useMemoizedState";
import {
  KnobParamLabel,
  PlayMonoScopeAndGain,
  Presets,
  audioContext,
} from "./.";
require("events").EventEmitter.defaultMaxListeners = 0;

function realWaveByPhasor(phasor: NodeRepr_t | number) {
  return el.sin(el.mul(2 * Math.PI, phasor));
}
function imaginaryWaveByPhasor(phasor: NodeRepr_t | number) {
  return el.cos(el.mul(2 * Math.PI, phasor));
}

type JuliaSynthPreset = {
  steps: number;
  carrierFreq: number;
};

export const JuliaSynth: FC = () => {
  const [playing, setPlaying] = useMemoizedState<boolean>(false);
  const [steps, setSteps] = useMemoizedState<number>(1);
  const [carrierFreq, setCarrierFreq] = useMemoizedState<number>(400);
  const [presetList, setPresetList] =
    useMemoizedState<JuliaSynthPreset[]>(defaultPresets);
  const [currentSetting, setCurrentSetting] =
    useMemoizedState<JuliaSynthPreset>(presetList[1]);

  let lastSetting: JuliaSynthPreset | {} = {};

  const recursiveModulatedCycle = (
    signal: NodeRepr_t,
    freq: number,
    count: number
  ): NodeRepr_t => {
    return count > 0 && freq < audioContext.sampleRate / 2
      ? recursiveModulatedCycle(
          el.add(
            signal,
            realWaveByPhasor(
              el.phasor(
                el.sm(el.const({ key: `freq-${count}`, value: freq })),
                0
              )
            )
          ) as NodeRepr_t,
          freq / 2,
          count - 1
        )
      : signal;
  };

  const JuliaSynthSynth = useCallback(() => {
    if (JSON.stringify(currentSetting) !== JSON.stringify(lastSetting)) {
      lastSetting = currentSetting;
      const smoothCarrierFreq: NodeRepr_t = el.sm(
        el.const({ key: `carrierFreq`, value: currentSetting?.carrierFreq })
      );

      const carrier = realWaveByPhasor(
        el.phasor(smoothCarrierFreq, 0)
      ) as NodeRepr_t;

      return recursiveModulatedCycle(
        carrier,
        currentSetting?.carrierFreq / 2,
        currentSetting?.steps
      );
    }
  }, [currentSetting]);

  useEffect(() => {
    setCurrentSetting(presetList[0]);
    updateCurrentPreset(0);
  }, []);

  useMemo(() => {
    setCurrentSetting({
      steps,
      carrierFreq,
    });
  }, [steps, carrierFreq]);

  function updatePresetList(presetList: JuliaSynthPreset[]) {
    setPresetList(presetList);
  }

  function updateCurrentPreset(presetNumber: number) {
    const preset = presetList[presetNumber];
    setSteps(preset?.steps);
    setCarrierFreq(preset?.carrierFreq);
  }

  return (
    <>
      <h1>Julia Synth</h1>
      <PlayMonoScopeAndGain
        signal={playing ? (JuliaSynthSynth() as NodeRepr_t) : null}
        isPlaying={setPlaying}
      />
      <br />
      <KnobsFlexBox>
        <KnobParamLabel
          id={"recursions"}
          label={"recursions"}
          knobValue={steps}
          step={1}
          min={0}
          max={10}
          onKnobInput={setSteps}
        />
        <KnobParamLabel
          id={"carrierFreq"}
          label={"carrierFreq"}
          knobValue={carrierFreq}
          step={0.001}
          min={0.01}
          max={1200}
          log={1}
          onKnobInput={setCarrierFreq}
        />
      </KnobsFlexBox>
      <br />
      <Presets
        allowAdd
        allowEdit
        allowLocalStorage
        presetsName="recursive-pm-v3-with-fix"
        currentSetting={currentSetting}
        presetList={presetList}
        onUpdateCurrentPreset={updateCurrentPreset}
        onUpdatePresetList={updatePresetList}
      />
    </>
  );
};

const KnobsFlexBox = styled.div`
  justify-content: space-evenly;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding: 10px;
  border: 2px solid #ff0000;
`;

const defaultPresets: JuliaSynthPreset[] = [
  {
    steps: 3,
    carrierFreq: 22,
  },
  {
    steps: 3,
    carrierFreq: 7.29,
  },
  {
    steps: 4,
    carrierFreq: 1.82,
  },
];
