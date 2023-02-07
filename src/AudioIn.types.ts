import { NodeRepr_t } from "@elemaudio/core";

export interface AudioInProps {
  playing: boolean;
  onSignal: (signal: NodeRepr_t) => void;
}
