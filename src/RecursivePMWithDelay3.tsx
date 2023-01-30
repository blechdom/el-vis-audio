import React, { FC, useCallback, useEffect, useMemo } from "react";
import { el, NodeRepr_t } from "@elemaudio/core";
import styled from "styled-components";
import useMemoizedState from "./hooks/useMemoizedState";
import {
  cycleByPhasor,
  KnobParamLabel,
  PlayMonoScopeAndGain,
  Presets,
  audioContext,
} from "./.";
require("events").EventEmitter.defaultMaxListeners = 0;

type RecursivePMWithDelay3Preset = {
  steps: number;
  indexOfMod: number;
  carrierFreq: number;
  startModFreq: number;
  freqDiv: number;
  indexDiv: number;
  delayTime: number;
  delayFeedback: number;
  delayDiv: number;
  feedbackDiv: number;
};

export const RecursivePMWithDelay3: FC = () => {
  const [playing, setPlaying] = useMemoizedState<boolean>(false);
  const [steps, setSteps] = useMemoizedState<number>(1);
  const [indexOfMod, setIndexOfMod] = useMemoizedState<number>(1);
  const [carrierFreq, setCarrierFreq] = useMemoizedState<number>(400);
  const [startModFreq, setStartModFreq] = useMemoizedState<number>(1);
  const [freqDiv, setFreqDiv] = useMemoizedState<number>(1);
  const [indexDiv, setIndexDiv] = useMemoizedState<number>(1);
  const [delayTime, setDelayTime] = useMemoizedState<number>(1);
  const [delayFeedback, setDelayFeedback] = useMemoizedState<number>(0);
  const [delayDiv, setDelayDiv] = useMemoizedState<number>(1);
  const [feedbackDiv, setFeedbackDiv] = useMemoizedState<number>(1);
  const [presetList, setPresetList] =
    useMemoizedState<RecursivePMWithDelay3Preset[]>(defaultPresets);
  const [currentSetting, setCurrentSetting] =
    useMemoizedState<RecursivePMWithDelay3Preset>(presetList[1]);

  let lastSetting: RecursivePMWithDelay3Preset | {} = {};

  const recursiveModulatedCycle = (
    signal: NodeRepr_t,
    modFreq: number,
    indexOfModulation: number,
    count: number,
    delay: number,
    feedback: number,
    delayDiv: number,
    feedbackDiv: number,
    freqDiv: number,
    indexDiv: number,
    steps: number
  ): NodeRepr_t => {
    console.log("in recurse cycle ", count);
    //const delayGrowing: boolean = delayDiv <= 1;
    //const delayShouldBeZero: boolean = delayGrowing && count === steps;
    //const delayCalc: number = delayShouldBeZero ? 0.1 : delay;
    //console.log("count ", count);
    //const recursionDataArray: JSX.Element[] | [] = recursionData;
    //const newElement: JSX.Element = (
    //  <div key={`data-${count}`}>
    //    {count} - modFreq({modFreq.toFixed(2)}) index(
    //    {indexOfModulation.toFixed(2)}) delay(
    //    {delayCalc.toFixed(2)}) feedback({feedback.toFixed(2)})
    //    <br />
    //  </div>
    //);
    // @ts-ignore
    //recursionDataArray.push(newElement);
    //setRecursionData(recursionDataArray);
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
      ? (recursiveModulatedCycle(
          el.delay(
            { size: audioContext.sampleRate * 4 * 12 * 8 },
            el.ms2samps(smoothDelay),
            smoothFeedback,
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
            )
          ) as NodeRepr_t,
          modFreq / freqDiv,
          indexOfModulation / indexDiv,
          count - 1,
          delay / delayDiv,
          feedback / feedbackDiv,
          delayDiv,
          feedbackDiv,
          freqDiv,
          indexDiv,
          steps
        ) as NodeRepr_t)
      : signal;
  };

  const recursivePMSynth = useCallback(() => {
    console.log("recursive before guard");
    if (JSON.stringify(currentSetting) !== JSON.stringify(lastSetting)) {
      console.log("recursive after guard");
      lastSetting = currentSetting;
      const smoothCarrierFreq: NodeRepr_t = el.sm(
        el.const({ key: `carrierFreq`, value: currentSetting?.carrierFreq })
      );
      const carrier = cycleByPhasor(
        el.phasor(smoothCarrierFreq, 0)
      ) as NodeRepr_t;
      return recursiveModulatedCycle(
        carrier,
        currentSetting?.startModFreq,
        currentSetting?.indexOfMod,
        currentSetting?.steps,
        currentSetting?.delayTime,
        currentSetting?.delayFeedback,
        currentSetting?.delayDiv,
        currentSetting?.feedbackDiv,
        currentSetting?.freqDiv,
        currentSetting?.indexDiv,
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
      startModFreq,
      freqDiv,
      indexOfMod,
      indexDiv,
      delayTime,
      delayFeedback,
      delayDiv,
      feedbackDiv,
    });
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

  function updatePresetList(presetList: RecursivePMWithDelay3Preset[]) {
    setPresetList(presetList);
  }

  function updateCurrentPreset(presetNumber: number) {
    const preset = presetList[presetNumber];
    setSteps(preset?.steps);
    setCarrierFreq(preset?.carrierFreq);
    setStartModFreq(preset?.startModFreq);
    setFreqDiv(preset?.freqDiv);
    setIndexOfMod(preset?.indexOfMod);
    setIndexDiv(preset?.indexDiv);
    setDelayTime(preset?.delayTime);
    setDelayFeedback(preset?.delayFeedback);
    setDelayDiv(preset?.delayDiv);
    setFeedbackDiv(preset?.feedbackDiv);
  }

  return (
    <>
      <h1>Recursive Phase Modulation 3</h1>
      <h4>trying to remove silent chunks caused by delay inside recursion</h4>
      <PlayMonoScopeAndGain
        signal={playing ? (recursivePMSynth() as NodeRepr_t) : null}
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
          max={7}
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
        <KnobParamLabel
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
          id={"modDiv"}
          label={"modDiv"}
          knobValue={freqDiv}
          min={0.01}
          step={0.01}
          max={8}
          onKnobInput={setFreqDiv}
        />
        <KnobParamLabel
          id={"modIndex"}
          label={"index"}
          knobValue={indexOfMod}
          step={0.01}
          min={0}
          max={20}
          onKnobInput={setIndexOfMod}
        />
        <KnobParamLabel
          id={"indexDiv"}
          label={"indexDiv"}
          knobValue={indexDiv}
          min={0.01}
          step={0.01}
          max={8}
          onKnobInput={setIndexDiv}
        />
        <KnobParamLabel
          id={"delayTime"}
          label={"delay"}
          knobValue={delayTime}
          min={1}
          step={0.1}
          max={3000}
          onKnobInput={setDelayTime}
        />
        <KnobParamLabel
          id={"delayFeedback"}
          label={"feedback"}
          knobValue={delayFeedback}
          min={-1}
          step={0.001}
          max={1}
          onKnobInput={setDelayFeedback}
        />
        <KnobParamLabel
          id={"delayDiv"}
          label={"delayDiv"}
          knobValue={delayDiv}
          min={0.01}
          step={0.01}
          max={8}
          onKnobInput={setDelayDiv}
        />
        <KnobParamLabel
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
        presetsName="recursive-pm-with-delay3-objects"
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

const defaultPresets: RecursivePMWithDelay3Preset[] = [
  {
    steps: 3,
    indexOfMod: 3,
    carrierFreq: 22,
    startModFreq: 0.16,
    freqDiv: 1.4,
    indexDiv: 1.46,
    delayTime: 100,
    delayFeedback: 0.1,
    delayDiv: 1,
    feedbackDiv: 1,
  },

  {
    steps: 3,
    carrierFreq: 7.29,
    startModFreq: 372.64,
    freqDiv: 4.98,
    indexOfMod: 5.14,
    indexDiv: 6.25,
    delayTime: 1000,
    delayFeedback: 0.3,
    delayDiv: 1,
    feedbackDiv: 1.2,
  },
  {
    steps: 4,
    carrierFreq: 1.82,
    startModFreq: 10.94,
    freqDiv: 7.16,
    indexOfMod: 4.29,
    indexDiv: 2.44,
    delayTime: 1,
    delayFeedback: 0,
    delayDiv: 1,
    feedbackDiv: 1,
  },
  {
    steps: 4,
    carrierFreq: 182,
    startModFreq: 12,
    freqDiv: 3.14,
    indexOfMod: 1.5,
    indexDiv: 2.67,
    delayTime: 1,
    delayFeedback: 0,
    delayDiv: 1,
    feedbackDiv: 1,
  },
  {
    steps: 4,
    carrierFreq: 3,
    startModFreq: 5.38,
    freqDiv: 0.16,
    indexOfMod: 1.4,
    indexDiv: 4.14,
    delayTime: 287.3,
    delayFeedback: 0.3009,
    delayDiv: 5.54,
    feedbackDiv: 0.87,
  },
  {
    steps: 4,
    carrierFreq: 0.147,
    startModFreq: 69,
    freqDiv: 0.62,
    indexOfMod: 1.4,
    indexDiv: 4.14,
    delayTime: 53,
    delayFeedback: 0.379,
    delayDiv: 0.41,
    feedbackDiv: 1.3,
  },
  {
    steps: 5,
    carrierFreq: 0.147,
    startModFreq: 69,
    freqDiv: 0.62,
    indexOfMod: 1.4,
    indexDiv: 4.14,
    delayTime: 53,
    delayFeedback: 0.379,
    delayDiv: 0.41,
    feedbackDiv: 1.3,
  },
];
