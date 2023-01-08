import { NodeRepr_t } from "@elemaudio/core";

export interface PlayPauseCoreAudioProps {
  signalLeft: NodeRepr_t | null;
  signalRight: NodeRepr_t | null;
  backgroundColor?: string;
  hoverColor?: string;
  playing?: boolean;
  onPlay?: (playing: boolean) => void;
}
