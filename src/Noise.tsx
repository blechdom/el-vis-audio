import React, { FC, useEffect, useState } from "react";
import Select from "react-select";
import { el } from "@elemaudio/core";
import { NoiseProps } from "./Noise.types";
import styled from "styled-components";
require("events").EventEmitter.defaultMaxListeners = 0;

type OptionType = {
  value: string;
  label: string;
};

const options: OptionType[] = [
  { value: "white", label: "white" },
  { value: "pink", label: "pink" },
];

export const Noise: FC<NoiseProps> = ({ playing, onSignal }) => {
  const [noiseType, setNoiseType] = useState<OptionType>({
    value: "white",
    label: "white",
  });

  useEffect(() => {
    if (playing && onSignal) {
      onSignal(noiseSynth(noiseType.value));
    }
  }, [playing, noiseType.value]);

  const noiseSynth = (nType: string) => {
    switch (nType) {
      case "white":
        return el.noise();
      case "pink":
        return el.pinknoise();
      default:
        return el.noise();
    }
  };

  return (
    <>
      <StyledSelect
        options={options}
        value={noiseType}
        onChange={(option) => {
          setNoiseType(
            option ?? {
              value: "white",
              label: "white",
            }
          );
        }}
      />
    </>
  );
};

const StyledSelect = styled(Select)`
  width: 60%;
  bordercolor: #ff0000;
  color: #ff0000;
`;
