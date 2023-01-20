import React, { FC, useState, useCallback, useEffect, useMemo } from "react";
import { el, NodeRepr_t } from "@elemaudio/core";
import styled from "styled-components";
import {
  KnobParamLabel,
  PlayMonoScopeAndGain,
  Presets,
  audioContext,
} from "./.";
require("events").EventEmitter.defaultMaxListeners = 0;

type DelayPreset = [number, number];

export const Delay: FC = () => {
  const [freq, setFreq] = useState<number>(400);
  const [delayTime, setDelayTime] = useState<number>(1);

  const delaySynth = useCallback(() => {
    const smoothFreq: NodeRepr_t = el.sm(
      el.const({
        key: `freq`,
        value: freq,
      })
    );
    return delayIt(el.cycle(smoothFreq));
  }, [freq]);

  const delayIt = useCallback(
    (sine: NodeRepr_t) => {
      const smoothDelay: NodeRepr_t = el.sm(
        el.const({
          key: `delay`,
          value: delayTime,
        })
      );
      return el.delay(
        { size: audioContext.sampleRate * 4 },
        el.ms2samps(smoothDelay),
        0,
        sine
      );
    },
    [delayTime]
  );

  const [presetList, setPresetList] = useState<DelayPreset[]>([[440, 1]]);
  const [currentSetting, setCurrentSetting] = useState<DelayPreset>(
    presetList[0]
  );

  useEffect(() => {
    setCurrentSetting(presetList[0]);
    updateCurrentPreset(0);
  }, []);

  useMemo(() => {
    setCurrentSetting([freq, delayTime]);
  }, [freq, delayTime]);

  function updatePresetList(presetList: DelayPreset[]) {
    setPresetList(presetList);
  }

  function updateCurrentPreset(presetNumber: number) {
    const preset = presetList[presetNumber];
    setFreq(preset[0]);
    setDelayTime(preset[1]);
  }

  return (
    <>
      <h1>Delay Synth</h1>
      <PlayMonoScopeAndGain signal={delaySynth() as NodeRepr_t} />
      <br />
      <KnobsFlexBox>
        <KnobParamLabel
          key={"freq"}
          id={"freq"}
          label={"freq"}
          knobValue={freq}
          step={0.001}
          min={200}
          max={1000}
          log={1}
          onKnobInput={setFreq}
        />
        <KnobParamLabel
          key={"delayTime"}
          id={"delayTime"}
          label={"delay"}
          knobValue={delayTime}
          min={0}
          step={1}
          max={3000}
          onKnobInput={setDelayTime}
        />
      </KnobsFlexBox>
      <br />
      <Presets
        allowAdd
        allowEdit
        allowLocalStorage
        presetsName="delay"
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
