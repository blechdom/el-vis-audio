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

type RecursivePMWithDelay2Preset = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

export const RecursivePMWithDelay2: FC = () => {
  const [steps, setSteps] = useState<number>(1);
  const [indexOfMod, setIndexOfMod] = useState<number>(1);
  const [carrierFreq, setCarrierFreq] = useState<number>(400);
  const [startModFreq, setStartModFreq] = useState<number>(1);
  const [freqDiv, setFreqDiv] = useState<number>(1);
  const [indexDiv, setIndexDiv] = useState<number>(1);
  const [delayTime, setDelayTime] = useState<number>(1);
  const [delayFeedback, setDelayFeedback] = useState<number>(0);
  const [delayDiv, setDelayDiv] = useState<number>(1);
  const [feedbackDiv, setFeedbackDiv] = useState<number>(1);

  function cycleByPhasor(phasor: NodeRepr_t | number) {
    return el.sin(el.mul(2 * Math.PI, phasor));
  }

  const recursiveModulatedCycle = useCallback(
    (
      signal: NodeRepr_t,
      modFreq: number,
      indexOfModulation: number,
      count: number,
      delay: number,
      feedback: number
    ): NodeRepr_t => {
      const smoothDelay: NodeRepr_t = el.smooth(
        el.tau2pole(0.75),
        el.const({
          key: `delay-${count}`,
          value: delay,
        })
      );
      const smoothFeedback: NodeRepr_t = el.sm(
        el.const({
          key: `feedback-${count}`,
          value: feedback,
        })
      );
      return count > 0 && modFreq < audioContext.sampleRate / 2
        ? (el.delay(
            { size: audioContext.sampleRate * 4 * steps * 8 },
            el.ms2samps(smoothDelay),
            smoothFeedback,
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
              count - 1,
              delay / delayDiv,
              feedback / feedbackDiv
            )
          ) as NodeRepr_t)
        : signal;
    },
    [freqDiv, indexDiv, delayDiv, feedbackDiv]
  );

  const recursivePMSynth = useCallback(() => {
    const smoothCarrierFreq: NodeRepr_t = el.sm(
      el.const({ key: `carrierFreq`, value: carrierFreq })
    );

    const carrier = cycleByPhasor(
      el.phasor(smoothCarrierFreq, 0)
    ) as NodeRepr_t;

    return recursiveModulatedCycle(
      carrier,
      startModFreq,
      indexOfMod,
      steps,
      delayTime,
      delayFeedback
    );
  }, [
    indexOfMod,
    steps,
    carrierFreq,
    startModFreq,
    freqDiv,
    indexDiv,
    delayTime,
    delayFeedback,
  ]);

  const [presetList, setPresetList] = useState<RecursivePMWithDelay2Preset[]>([
    [3, 3, 22, 0.16, 1.4, 1.46, 100, 0.1, 1, 1],
    [3, 7.29, 372.64, 4.98, 5.14, 6.25, 1000, 0.3, 1, 1.2],
    [4, 1.82, 10.94, 7.16, 4.29, 2.44, 1, 0, 1, 1],
    [4, 182, 12, 3.14, 1.5, 2.67, 1, 0, 1, 1],
    [6, 1173, 42, 2.34, 0.12, 0.86, 11, -0.4, 0.25, 0.1],
    [6, 357, 42, 2.09, 18.5, 4.9, 1800, 0.98, 5.61, 8],
    [4, 3, 5.38, 0.16, 1.4, 4.14, 287.3, 0.3009, 5.54, 0.87],
    [4, 0.147, 69, 0.62, 1.4, 4.14, 53, 0.379, 0.41, 1.3],
    [5, 0.147, 69, 0.62, 1.4, 4.14, 53, 0.379, 0.41, 1.3],
  ]);
  const [currentSetting, setCurrentSetting] =
    useState<RecursivePMWithDelay2Preset>(presetList[0]);

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
      delayFeedback,
      delayDiv,
      feedbackDiv,
    ]);
  }, [
    steps,
    carrierFreq,
    startModFreq,
    freqDiv,
    indexOfMod,
    indexDiv,
    delayTime,
    delayFeedback,
    delayDiv,
    feedbackDiv,
  ]);

  function updatePresetList(presetList: RecursivePMWithDelay2Preset[]) {
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
    setDelayFeedback(preset[7]);
    setDelayDiv(preset[8]);
    setFeedbackDiv(preset[9]);
  }

  return (
    <>
      <h1>Recursive Phase Modulation 2</h1>
      <h4>delay update starts recursion</h4>
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
          min={1}
          step={0.1}
          max={3000}
          onKnobInput={setDelayTime}
        />
        <KnobParamLabel
          key={"delayFeedback"}
          id={"delayFeedback"}
          label={"feedback"}
          knobValue={delayFeedback}
          min={-1}
          step={0.001}
          max={1}
          onKnobInput={setDelayFeedback}
        />
        <KnobParamLabel
          key={"delayDiv"}
          id={"delayDiv"}
          label={"delayDiv"}
          knobValue={delayDiv}
          min={0.01}
          step={0.01}
          max={8}
          onKnobInput={setDelayDiv}
        />
        <KnobParamLabel
          key={"feedbackDiv"}
          id={"feedbackDiv"}
          label={"feedbackDiv"}
          knobValue={feedbackDiv}
          min={0.01}
          step={0.01}
          max={8}
          onKnobInput={setFeedbackDiv}
        />
      </KnobsFlexBox>
      <br />
      <Presets
        allowAdd
        allowEdit
        allowLocalStorage
        presetsName="recursive-pm-with-delay2"
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
