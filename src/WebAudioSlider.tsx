import React, { FC } from "react";
import "./webaudio-controls/webaudio-controls-module.js";
import { WebAudioSliderProps } from "./WebAudioSlider.types";

export const WebAudioSlider: FC<WebAudioSliderProps> = (props) => {
  return <webaudio-slider {...props}></webaudio-slider>;
};
