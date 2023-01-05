import {NodeRepr_t} from "@elemaudio/core";

export interface PlayPauseAudioProps {
  signal: NodeRepr_t | null;
  backgroundColor?: string;
  hoverColor?: string;
  playing?: boolean;
  onPlay?: (playing: boolean) => void;
}
