import React, { FC } from "react";
import "./webaudio-controls/webaudio-controls-module.js";
import { WebAudioKnobProps } from "./WebAudioKnob.types";

export const WebAudioKnob: FC<WebAudioKnobProps> = (props) => {
  return <webaudio-knob {...props}></webaudio-knob>;
};
