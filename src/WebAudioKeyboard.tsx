import React, { FC } from "react";
import "./webaudio-controls/webaudio-controls-module.js";
import { WebAudioKeyboardProps } from "./WebAudioKeyboard.types";

export const WebAudioKeyboard: FC<WebAudioKeyboardProps> = (props) => {
  return <webaudio-keyboard {...props}></webaudio-keyboard>;
};
