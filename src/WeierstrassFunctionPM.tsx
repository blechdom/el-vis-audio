import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { el, NodeRepr_t } from "@elemaudio/core";
import styled from "styled-components";
import useMemoizedState from "./hooks/useMemoizedState";
import {
  cycleByPhasor,
  KnobParamLabel,
  PlayMonoScopeAndGain,
  Presets,
} from "./.";
require("events").EventEmitter.defaultMaxListeners = 0;

type WeierstrassFunctionPMPreset = {
  numVoices: number;
  varA: number;
  varB: number;
  fundamental: number;
  lowestFormant: number;
  carrierFreq: number;
  indexOfMod: number;
};

export const WeierstrassFunctionPM: FC = () => {
  const [playing, setPlaying] = useMemoizedState<boolean>(false);
  const [numVoices, setNumVoices] = useMemoizedState<number>(1);
  const [varA, setVarA] = useMemoizedState<number>(0.5);
  const [varB, setVarB] = useMemoizedState<number>(1);
  const [fundamental, setFundamental] = useMemoizedState<number>(1);
  const [lowestFormant, setLowestFormant] = useMemoizedState<number>(0);
  const [carrierFreq, setCarrierFreq] = useMemoizedState<number>(400);
  const [indexOfMod, setIndexOfMod] = useState<number>(1);
  const [presetList, setPresetList] =
    useMemoizedState<WeierstrassFunctionPMPreset[]>(defaultPresets);
  const [currentSetting, setCurrentSetting] =
    useMemoizedState<WeierstrassFunctionPMPreset>(presetList[1]);

  let lastSetting: WeierstrassFunctionPMPreset | {} = {};

  const weierstrassFunctionPMSynth = useCallback(() => {
    if (JSON.stringify(currentSetting) !== JSON.stringify(lastSetting)) {
      lastSetting = currentSetting;

      if (currentSetting.lowestFormant > currentSetting.numVoices - 1) {
        setLowestFormant(currentSetting.numVoices - 1);
      }

      function weierstrasseIteration(i: number) {
        let voiceIter = el.const({
          key: `lowestFormant-${i}`,
          value: currentSetting?.lowestFormant + i,
        });
        return el.mul(
          el.pow(
            el.sm(el.const({ key: `varA-${i}`, value: currentSetting?.varA })),
            voiceIter
          ),
          el.cos(
            el.mul(
              el.mul(
                el.phasor(1 / 240, 0), // 240 seconds reset phasor
                el.sm(
                  el.const({
                    key: `fundamental-${i}`,
                    value: currentSetting?.fundamental * 60,
                  })
                )
              ),
              el.mul(
                Math.PI,
                el.pow(
                  el.sm(
                    el.const({ key: `varB-${i}`, value: currentSetting?.varB })
                  ),
                  voiceIter
                )
              )
            )
          )
        );
      }
      const allVoices = [...Array(currentSetting?.numVoices)].map((_, i) => {
        return weierstrasseIteration(i);
      });

      function addMany(ins: NodeRepr_t[]): NodeRepr_t {
        if (ins.length < 9) {
          return el.add(...ins) as NodeRepr_t;
        }
        return el.add(...ins.slice(0, 7), addMany(ins.slice(8))) as NodeRepr_t;
      }

      const pmSynth = (modulator: NodeRepr_t) => {
        const smoothCarrierFreq: NodeRepr_t = el.sm(
          el.const({ key: `carrierFreq`, value: currentSetting?.carrierFreq })
        );

        const carrier = cycleByPhasor(
          el.phasor(smoothCarrierFreq, 0)
        ) as NodeRepr_t;

        const indexOfModulation: NodeRepr_t = el.sm(
          el.const({ key: `indexOfMod`, value: currentSetting?.indexOfMod })
        );

        return cycleByPhasor(
          el.mod(el.add(modulator, el.mul(carrier, indexOfModulation)), 1)
        );
      };
      if (allVoices && allVoices.length > 0) {
        const weierstrassWave = addMany(allVoices as NodeRepr_t[]);
        return pmSynth(weierstrassWave);
      }
    }
  }, [currentSetting]);

  useEffect(() => {
    setCurrentSetting(presetList[0]);
    updateCurrentPreset(0);
  }, []);

  useMemo(() => {
    setCurrentSetting({
      numVoices,
      varA,
      varB,
      fundamental,
      lowestFormant,
      carrierFreq,
      indexOfMod,
    });
  }, [
    numVoices,
    varA,
    varB,
    fundamental,
    lowestFormant,
    carrierFreq,
    indexOfMod,
  ]);

  function updatePresetList(presetList: WeierstrassFunctionPMPreset[]) {
    setPresetList(presetList);
  }

  function updateCurrentPreset(presetNumber: number) {
    const preset = presetList[presetNumber];
    setNumVoices(preset?.numVoices);
    setVarA(preset?.varA);
    setVarB(preset?.varB);
    setFundamental(preset?.fundamental);
    setLowestFormant(preset?.lowestFormant);
    setCarrierFreq(preset?.carrierFreq);
  }

  return (
    <>
      <h1>WeierstrassFunction Phase Modulation</h1>
      <PlayMonoScopeAndGain
        signal={playing ? (weierstrassFunctionPMSynth() as NodeRepr_t) : null}
        isPlaying={setPlaying}
      />
      <br />
      <KnobsFlexBox>
        <KnobParamLabel
          id={"numVoices"}
          label={"numVoices"}
          knobValue={numVoices}
          step={1}
          min={1}
          max={48}
          onKnobInput={setNumVoices}
        />
        <KnobParamLabel
          id={"lowestFormant"}
          label={"lowestFormant"}
          knobValue={lowestFormant}
          step={1}
          min={0}
          max={47}
          onKnobInput={setLowestFormant}
        />
        <KnobParamLabel
          id={"fundamental"}
          label={"fundamental"}
          knobValue={fundamental}
          step={0.01}
          min={1}
          max={400}
          onKnobInput={setFundamental}
        />
        <KnobParamLabel
          id={"varA"}
          label={"varA"}
          knobValue={varA}
          step={0.01}
          min={0}
          max={2}
          onKnobInput={setVarA}
        />
        <KnobParamLabel
          id={"varB"}
          label={"varB"}
          knobValue={varB}
          step={0.01}
          min={0}
          max={11}
          onKnobInput={setVarB}
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
          id={"indexOfMod"}
          label={"indexOfMod"}
          knobValue={indexOfMod}
          step={0.01}
          min={0}
          max={20}
          onKnobInput={setIndexOfMod}
        />
      </KnobsFlexBox>
      <br />
      <Presets
        allowAdd
        allowEdit
        allowLocalStorage
        presetsName="weierstrass-function-pm"
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

const defaultPresets: WeierstrassFunctionPMPreset[] = [
  {
    carrierFreq: 22,
    fundamental: 100,
    lowestFormant: 1,
    numVoices: 4,
    varA: 0.5,
    varB: 0.5,
    indexOfMod: 1,
  },
];
/*
  {
    carrierFreq: 7.29,
    startModFreq: 372.64,
    freqDiv: 4.98,
    indexOfMod: 5.14,
    indexDiv: 6.25,
  },
  {
    steps: 4,
    carrierFreq: 1.82,
    startModFreq: 10.94,
    freqDiv: 7.16,
    indexOfMod: 4.29,
    indexDiv: 2.44,
  },
  {
    steps: 4,
    carrierFreq: 182,
    startModFreq: 12,
    freqDiv: 3.14,
    indexOfMod: 1.5,
    indexDiv: 2.67,
  },
  {
    steps: 4,
    carrierFreq: 3,
    startModFreq: 0.488,
    freqDiv: 0.34,
    indexOfMod: 7.18,
    indexDiv: 5.26,
  },*/
