import React, { FC } from "react";
import "./webaudio-controls/webaudio-controls-module";
import { WACParamProps } from "./WACParam.types";

export const WACParam: FC<WACParamProps> = (props) => {
  return <webaudio-param {...props}></webaudio-param>;
};
