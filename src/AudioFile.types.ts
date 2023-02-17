import { NodeRepr_t } from "@elemaudio/core";

export interface AudioFileProps {
  playing: boolean;
  onSignal: (signal: NodeRepr_t) => void;
}
