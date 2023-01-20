import { NodeRepr_t } from "@elemaudio/core";

export interface OscilloscopeSpectrogramProps {
  audioVizData: Array<number>;
  fftVizData: Array<number>;
  width?: number;
  height?: number;
  backgroundColor?: string;
  oscilloscopeColor?: string;
  spectrogramColor?: string;
}
