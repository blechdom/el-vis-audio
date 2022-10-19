export * from "./webaudio-controls-module";

import { DOMAttributes } from "react";
import { WebAudioKnob as WebAudioKnobType } from "./webaudio-controls-module.js";
import { WebAudioSlider as WebAudioSliderType } from "./webaudio-controls-module.js";
import { WebAudioSwitch as WebAudioSwitchType } from "./webaudio-controls-module.js";
import { WebAudioParam as WebAudioParamType } from "./webaudio-controls-module.js";
import { WebAudioKeyboard as WebAudioKeyboardType } from "./webaudio-controls-module.js";

type CustomEvents<K extends string> = {
  [key in K]: (event: CustomEvent) => void;
};
type CustomElement<T, K extends string = ""> = Partial<
  T & DOMAttributes<T> & { children: any } & CustomEvents<`on${K}`>
>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["webaudio-knob"]: CustomElement<WebAudioKnobType>;
      ["webaudio-slider"]: CustomElement<WebAudioSliderType>;
      ["webaudio-switch"]: CustomElement<WebAudioSwitchType>;
      ["webaudio-param"]: CustomElement<WebAudioParamType>;
      ["webaudio-keyboard"]: CustomElement<WebAudioKeyboardType>;
    }
  }
}
