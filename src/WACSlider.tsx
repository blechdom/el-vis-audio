import React, { FC } from "react";
import "./webaudio-controls/webaudio-controls-module";
import { WACSliderProps } from "./WACSlider.types";

export const WACSlider: FC<WACSliderProps> = (props) => {
  return <webaudio-slider {...props}></webaudio-slider>;
};
