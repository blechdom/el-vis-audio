import React, { FC, DOMAttributes } from "react";
import { WebAudioKnob } from "./webaudio-controls/webaudio-knob";
console.log("WebAudioKnob", WebAudioKnob);
import "./webaudio-controls/webaudio-knob.js";
import { KnobProps } from "./Knob.types";

export type CustomEvents<K extends string> = {
  [key in K]: (event: CustomEvent) => void;
};
export type CustomElement<T, K extends string = ""> = Partial<
  T & DOMAttributes<T> & { children: any } & CustomEvents<`on${K}`>
>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["webaudio-knob"]: CustomElement<WebAudioKnob>;
    }
  }
}

export const Knob: FC<KnobProps> = (props) => {
  return <webaudio-knob {...props}></webaudio-knob>;
};
