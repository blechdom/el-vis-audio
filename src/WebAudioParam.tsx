import React, { FC } from "react";
import "./webaudio-controls/webaudio-controls-module.js";
import { WebAudioParamProps } from "./WebAudioParam.types";

export const WebAudioParam: FC<WebAudioParamProps> = (props) => {
  return <webaudio-param {...props}></webaudio-param>;
};
