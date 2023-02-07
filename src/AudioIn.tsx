import React, { FC, useState } from "react";
import { Oscillators, Noise } from "./";
import { AudioInProps } from "./AudioIn.types";
import styled from "styled-components";
import Select from "react-select";
require("events").EventEmitter.defaultMaxListeners = 0;

type OptionType = {
  value: string;
  label: string;
};

const options: OptionType[] = [
  { value: "liveInput", label: "live input" },
  { value: "oscillators", label: "oscillators" },
  { value: "noise", label: "noise" },
  { value: "audioFile", label: "audio file" },
];

export const AudioIn: FC<AudioInProps> = ({ playing, onSignal }) => {
  const [input, setInput] = useState<OptionType>({
    value: "oscillators",
    label: "oscillators",
  });

  return (
    <AudioInFlexBox>
      <StyledSelect
        options={options}
        value={input}
        onChange={(option) => {
          setInput(
            option ?? {
              value: "oscillators",
              label: "oscillators",
            }
          );
        }}
      />
      <br />
      {input.value === "oscillators" && (
        <Oscillators playing={playing} onSignal={onSignal} />
      )}
      {input.value === "noise" && (
        <Noise playing={playing} onSignal={onSignal} />
      )}
    </AudioInFlexBox>
  );
};

const AudioInFlexBox = styled.div`
  justify-content: space-evenly;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding: 10px;
  border: 2px solid #ff0000;
`;

const StyledSelect = styled(Select)`
  width: 30%;
  bordercolor: #ff0000;
  color: #ff0000;
`;
