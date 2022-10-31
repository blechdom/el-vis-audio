import React, { FC } from "react";
import "./webaudio-controls/webaudio-controls-module";
import { WACKeyboardProps } from "./WACKeyboard.types";

export const WACKeyboard: FC<WACKeyboardProps> = (props: WACKeyboardProps) => {
  return <webaudio-keyboard {...props} />;
};
