import React, { FC, useEffect, useState } from "react";
import Select from "react-select";
import { el } from "@elemaudio/core";
import { KnobParamLabel } from "./";
import { OscillatorsProps } from "./Oscillators.types";
import styled from "styled-components";
require("events").EventEmitter.defaultMaxListeners = 0;

type OptionType = {
  value: string;
  label: string;
};

const options: OptionType[] = [
  { value: "blepsaw", label: "blepsaw" },
  { value: "blepsquare", label: "blepsquare" },
  { value: "bleptriangle", label: "bleptriangle" },
  { value: "cycle", label: "cycle" },
  { value: "phasor", label: "phasor" },
  { value: "saw", label: "saw" },
  { value: "square", label: "square" },
  { value: "triangle", label: "triangle" },
];

export const Oscillators: FC<OscillatorsProps> = ({ playing, onSignal }) => {
  const [waveform, setWaveform] = useState<OptionType>(options[3]);
  const [frequency, setFrequency] = useState<number>(200);

  useEffect(() => {
    if (playing && onSignal) {
      onSignal(waveformSynth(waveform.value, frequency));
    }
  }, [playing, frequency, waveform.value]);

  const waveformSynth = (wave: string, freq: number) => {
    const freqSignal = el.sm(el.const({ key: `freqSignal`, value: freq }));
    switch (wave) {
      case "blepsaw":
        return el.blepsaw(freqSignal);
      case "blepsquare":
        return el.blepsquare(freqSignal);
      case "bleptriangle":
        return el.bleptriangle(freqSignal);
      case "cycle":
        return el.cycle(freqSignal);
      case "phasor":
        return el.phasor(freqSignal, 0);
      case "saw":
        return el.saw(freqSignal);
      case "square":
        return el.square(freqSignal);
      case "triangle":
        return el.triangle(freqSignal);
      default:
        return el.cycle(freqSignal);
    }
  };

  return (
    <>
      <StyledSelect
        options={options}
        value={waveform}
        onChange={(option) => {
          setWaveform((option ?? options[3]) as OptionType);
        }}
      />
      <KnobParamLabel
        id={"frequency"}
        label={"frequency"}
        knobValue={frequency}
        step={0.001}
        min={20}
        max={2000}
        log={1}
        onKnobInput={setFrequency}
      />
    </>
  );
};

const StyledSelect = styled(Select)`
  width: 30%;
  bordercolor: #ff0000;
  color: #ff0000;
`;
