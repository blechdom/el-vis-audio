import { NodeRepr_t } from "@elemaudio/core";

export interface LiveInputProps {
  playing: boolean;
  onSignal: (signal: NodeRepr_t) => void;
}
