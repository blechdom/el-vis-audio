import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { el, NodeRepr_t } from "@elemaudio/core";
import styled from "styled-components";
import { KnobParamLabel, PlayMonoScopeAndGain, Presets } from "./.";
import { WebAudioSwitch } from "webaudio-controls-react-typescript";
require("events").EventEmitter.defaultMaxListeners = 0;

type ShepardRissetGlissandoPreset = [number, number, number, number, boolean];

export const ShepardRissetGlissando: FC = () => {
  const [numVoices, setNumVoices] = useState<number>(8);
  const [speed, setSpeed] = useState<number>(0.05);
  const [startFreq, setStartFreq] = useState<number>(100);
  const [intervalRatio, setIntervalRatio] = useState<number>(2);
  const [directionUp, setDirectionUp] = useState<boolean>(true);

  const shepardRissetSynth = useCallback(() => {
    function phasedPhasor(key: string, speed: number, phaseOffset: number) {
      const smoothSpeed = el.sm(
        el.const({ key: `phased-phasor-speed`, value: speed })
      );
      let t = el.add(
        el.phasor(smoothSpeed, 0),
        el.sm(
          el.const({ key: `${key}:phased-phasor-offset`, value: phaseOffset })
        )
      );
      return el.sub(t, el.floor(t));
    }

    function phasedCycle(key: string, speed: number, phaseOffset: number) {
      let p = phasedPhasor(key, speed, phaseOffset);
      let offset = el.sub(
        el.mul(2 * Math.PI, p),
        el.const({ key: `phased-cycle-offset`, value: 1.5 })
      );
      return el.mul(el.add(el.sin(offset), 1), 0.5);
    }
    const freqRange = el.sm(
      el.const({
        key: `freq-range`,
        value: startFreq * intervalRatio * numVoices,
      })
    );
    const smoothStartFreq = el.sm(
      el.const({ key: `start-freq`, value: startFreq })
    );

    function rampingSine(key: string, phaseOffset: number) {
      const modulatorUp = phasedPhasor(key, speed, phaseOffset);
      const modulatorDown = el.sub(1.0, modulatorUp);
      const modulator = directionUp ? modulatorUp : modulatorDown;
      return el.mul(
        el.cycle(
          el.add(el.mul(el.pow(modulator, 2), freqRange), smoothStartFreq)
        ),
        phasedCycle(key, speed, phaseOffset)
      );
    }

    const allVoices = [...Array(numVoices)].map((_, i) => {
      const key = `voice-${i}`;
      const phaseOffset = (1 / numVoices) * i;
      const voice = rampingSine(key, phaseOffset);
      return el.mul(
        voice,
        el.sm(el.const({ key: `scale-amp-by-numVoices`, value: 1 / numVoices }))
      );
    });

    function addMany(ins: NodeRepr_t[]): NodeRepr_t {
      if (ins.length < 9) {
        return el.add(...ins) as NodeRepr_t;
      }
      return el.add(...ins.slice(0, 7), addMany(ins.slice(8))) as NodeRepr_t;
    }
    return addMany(allVoices as NodeRepr_t[]);
  }, [numVoices, speed, directionUp, startFreq, intervalRatio]);

  const [presetList, setPresetList] = useState<ShepardRissetGlissandoPreset[]>([
    [8, 0.05, 100, 2, true],
    [8, 0.05, 200, 1.5, false],
    [2, 5.0, 135, 3.7, true],
    [8, 0.06, 660, 0.12, false],
    [6, 0.75, 212, 4, true],
  ]);
  const [currentSetting, setCurrentSetting] =
    useState<ShepardRissetGlissandoPreset>(presetList[0]);

  useEffect(() => {
    setCurrentSetting(presetList[0]);
    updateCurrentPreset(0);
  }, []);

  useMemo(() => {
    setCurrentSetting([
      numVoices,
      speed,
      startFreq,
      intervalRatio,
      directionUp,
    ]);
  }, [numVoices, speed, startFreq, intervalRatio, directionUp]);

  function updatePresetList(presetList: ShepardRissetGlissandoPreset[]) {
    setPresetList(presetList);
  }

  function updateCurrentPreset(presetNumber: number) {
    const preset = presetList[presetNumber];
    setNumVoices(preset[0]);
    setSpeed(preset[1]);
    setStartFreq(preset[2]);
    setIntervalRatio(preset[3]);
    setDirectionUp(preset[4]);
  }

  return (
    <>
      <h1>Shepard-Risset Glissando</h1>
      <PlayMonoScopeAndGain signal={shepardRissetSynth() as NodeRepr_t} />
      <br />
      <KnobsFlexBox>
        <SwitchBlock>
          <br />
          <WebAudioSwitch
            colors={"#ff0000;#fff;#fff"}
            value={directionUp ? 1 : 0}
            onSwitchClick={(event) =>
              setDirectionUp(event === 1 ? true : false)
            }
          />
          <br />
          <SwitchLabel>direction</SwitchLabel>
        </SwitchBlock>
        <KnobParamLabel
          key={"numVoices"}
          id={"numVoices"}
          label={"voices"}
          knobValue={numVoices}
          step={1}
          min={1}
          max={64}
          onKnobInput={setNumVoices}
        />
        <KnobParamLabel
          key={"speed"}
          id={"speed"}
          label={"speed"}
          knobValue={speed}
          min={0.01}
          step={0.01}
          max={10}
          onKnobInput={setSpeed}
        />
        <KnobParamLabel
          key={"startFreq"}
          id={"startFreq"}
          label={"startFreq"}
          knobValue={startFreq}
          min={10}
          step={0.01}
          max={3000}
          onKnobInput={setStartFreq}
        />
        <KnobParamLabel
          key={"intervalRatio"}
          id={"intervalRatio"}
          label={"intervalRatio"}
          knobValue={intervalRatio}
          min={0.01}
          step={0.01}
          max={8.0}
          onKnobInput={setIntervalRatio}
        />
      </KnobsFlexBox>
      <Presets
        allowAdd
        allowEdit
        allowLocalStorage
        presetsName="Shepard-Risset-Glissando-v2"
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
const SwitchLabel = styled.span`
  color: #ff0000;
  text-align: center;
  padding: 0px;
  margin: 0px;
  width: 150px;
`;
const SwitchBlock = styled.div`
  display: inline-block;
  text-align: center;
`;
