import { NodeRepr_t } from "@elemaudio/core";

export interface PlayPauseAudioProps {
  backgroundColor?: string;
  hoverColor?: string;
  playing?: boolean;
  onPlay?: (playing: boolean) => void;
}
