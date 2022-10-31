import React, { FC } from "react";
//import "./webaudio-controls/webaudio-controls-module.js";
import { WACSwitchProps } from "./WACSwitch.types";

export const WACSwitch: FC<WACSwitchProps> = (props: WACSwitchProps) => {
  // @ts-ignore
  return <webaudio-switch {...props} />;
};
