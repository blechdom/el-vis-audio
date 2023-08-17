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
  diameter = 50,
  labelWidth = 50,
  fontSize = 15,
  tooltip = "",
  min = 0,
  max = 1,
  step = 0.001,
  onKnobInput,
  log = 0,
}) => {
  return (
    <WebAudioKnobBlock key={key}>
      <WebAudioKnob
        id={id}
        diameter={diameter}
        bodyColor={"#FFF"}
        highlightColor={"#FFF"}
        indicatorColor={"#FF0000"}
        tooltip={tooltip}
        min={min}
        step={step}
        max={max}
        log={log}
        value={knobValue}
        onKnobInput={onKnobInput && onKnobInput}
      />
      {label && (
        <>
          <br />
          <WebAudioParam
            width={labelWidth}
            link={id}
            height={fontSize + 4}
            fontsize={fontSize}
            colors="#FFF;#FF0000;"
            value={knobValue}
            onParamInput={onKnobInput && onKnobInput}
          />
          <br />
          <KnobLabel labelWidth={labelWidth} fontSize={fontSize}>
            {label}
          </KnobLabel>
        </>
      )}
    </WebAudioKnobBlock>
  );
};

const KnobLabel = styled.div<{
  fontSize?: number;
  labelWidth?: number;
}>`
  color: #ff0000;
  text-align: center;
  font-family: "Roboto", sans-serif;
  font-size: ${(props) => (props.fontSize ? props.fontSize : 15)}px;
  padding: 0px;
  margin: 0px;
  width: ${(props) => (props.labelWidth ? props.labelWidth + 4 : 55)}px;
  height: ${(props) => (props.fontSize ? props.fontSize : 19)}px;
`;

const WebAudioKnobBlock = styled.div`
  display: inline-block;
  text-align: center;
`;
