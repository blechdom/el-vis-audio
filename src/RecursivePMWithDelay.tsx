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

type RecursivePMWithDelayPreset = [
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

export const RecursivePMWithDelay: FC = () => {
  const [steps, setSteps] = useState<number>(1);
  const [indexOfMod, setIndexOfMod] = useState<number>(1);
  const [carrierFreq, setCarrierFreq] = useState<number>(400);
  const [startModFreq, setStartModFreq] = useState<number>(1);
  const [freqDiv, setFreqDiv] = useState<number>(1);
  const [indexDiv, setIndexDiv] = useState<number>(1);
  const [delayTime, setDelayTime] = useState<number>(0);

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
      const delay = audioContext.sampleRate * delayTime;
      return count > 0 && modFreq < audioContext.sampleRate / 2
        ? (el.delay(
            { size: audioContext.sampleRate },
            delay,
            0,
            recursiveModulatedCycle(
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
          ) as NodeRepr_t)
        : signal;
    },
    [freqDiv, indexDiv, delayTime]
  );

  const recursivePMSynth = useCallback(() => {
    const smoothCarrierFreq: NodeRepr_t = el.sm(
      el.const({ key: `carrierFreq`, value: carrierFreq })
    );

    const carrier = cycleByPhasor(
      el.phasor(smoothCarrierFreq, 0)
    ) as NodeRepr_t;

    return recursiveModulatedCycle(carrier, startModFreq, indexOfMod, steps);
  }, [indexOfMod, steps, carrierFreq, startModFreq, freqDiv, indexDiv]);

  const [presetList, setPresetList] = useState<RecursivePMWithDelayPreset[]>([
    [3, 3, 22, 0.16, 1.4, 1.46, 0],
    [3, 7.29, 372.64, 4.98, 5.14, 6.25, 0],
    [4, 1.82, 10.94, 7.16, 4.29, 2.44, 0],
    [4, 182, 12, 3.14, 1.5, 2.67, 0],
    [10, 1173, 42, 2.34, 0.12, 0.86, 0],
  ]);
  const [currentSetting, setCurrentSetting] =
    useState<RecursivePMWithDelayPreset>(presetList[0]);

  useEffect(() => {
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
      delayTime,
    ]);
  }, [
    steps,
    carrierFreq,
    startModFreq,
    freqDiv,
    indexOfMod,
    indexDiv,
    delayTime,
  ]);

  function updatePresetList(presetList: RecursivePMWithDelayPreset[]) {
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
    setDelayTime(preset[6]);
  }

  return (
    <>
      <h1>Recursive Phase Modulation</h1>
      <PlayMonoScopeAndGain signal={recursivePMSynth() as NodeRepr_t} />
      <br />
      <KnobsFlexBox>
        <KnobParamLabel
          key={"recursions"}
          id={"recursions"}
          label={"recursions"}
          knobValue={steps}
          step={1}
          min={0}
          max={10}
          onKnobInput={setSteps}
        />
        <KnobParamLabel
          key={"carrierFreq"}
          id={"carrierFreq"}
          label={"carrierFreq"}
          knobValue={carrierFreq}
          step={0.001}
          min={0.01}
          max={1200}
          log={1}
          onKnobInput={setCarrierFreq}
        />
        <KnobParamLabel
          key={"startModFreq"}
          id={"modFreq"}
          label={"modFreq"}
          knobValue={startModFreq}
          step={0.001}
          min={0.01}
          log={1}
          max={400}
          onKnobInput={setStartModFreq}
        />
        <KnobParamLabel
          key={"freqDiv"}
          id={"modDiv"}
          label={"modDiv"}
          knobValue={freqDiv}
          min={0.01}
          step={0.01}
          max={8}
          onKnobInput={setFreqDiv}
        />
        <KnobParamLabel
          key={"indexOfMod"}
          id={"modIndex"}
          label={"index"}
          knobValue={indexOfMod}
          step={0.01}
          min={0}
          max={20}
          onKnobInput={setIndexOfMod}
        />
        <KnobParamLabel
          key={"indexDiv"}
          id={"indexDiv"}
          label={"indexDiv"}
          knobValue={indexDiv}
          min={0.01}
          step={0.01}
          max={8}
          onKnobInput={setIndexDiv}
        />
        <KnobParamLabel
          key={"delayTime"}
          id={"delayTime"}
          label={"delay"}
          knobValue={delayTime}
          min={0}
          step={0.01}
          max={2}
          onKnobInput={setDelayTime}
        />
      </KnobsFlexBox>
      <br />
      <Presets
        allowAdd
        allowEdit
        allowLocalStorage
        presetsName="recursive-pm-v3"
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
