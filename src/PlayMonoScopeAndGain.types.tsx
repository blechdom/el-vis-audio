import { NodeRepr_t } from "@elemaudio/core";

export interface PlayMonoScopeAndGainProps {
  signal: NodeRepr_t | null;
  backgroundColor?: string;
  hoverColor?: string;
  width?: number;
  height?: number;
  playAudio?: boolean;
  oscilloscope?: boolean;
  spectrogram?: boolean;
  gain?: boolean;
  gainLabel?: boolean;
}
