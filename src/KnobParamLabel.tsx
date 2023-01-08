import React, { FC } from "react";
import styled from "styled-components";
import {
  WebAudioKnob,
  WebAudioParam,
} from "webaudio-controls-react-typescript";
import { KnobParamLabelProps } from "./KnobParamLabel.types";

export const KnobParamLabel: FC<KnobParamLabelProps> = ({
  id = "knob",
  key = "key",
  label,
  knobValue = 0,
  min = 0,
  max = 1,
  step = 0.001,
  onKnobInput,
}) => {
  return (
    <WebAudioKnobBlock key={key}>
      <WebAudioKnob
        id={id}
        diameter={50}
        bodyColor={"#FFF"}
        highlightColor={"#FFF"}
        indicatorColor={"#FF0000"}
        min={min}
        step={step}
        max={max}
        value={knobValue}
        onKnobInput={onKnobInput && onKnobInput}
      />
      {label && (
        <>
          <br />
          <WebAudioParam
            width={50}
            height={20}
            fontsize={15}
            colors="#FFF;#FF0000;"
            value={knobValue}
          />
          <br />
          <KnobLabel>{label}</KnobLabel>
        </>
      )}
    </WebAudioKnobBlock>
  );
};

const KnobLabel = styled.span`
  color: #ff0000;
  text-align: center;
  padding: 0px;
  margin: 0px;
  width: 150px;
`;

const WebAudioKnobBlock = styled.div`
  display: inline-block;
  text-align: center;
`;
