import { NodeRepr_t } from "@elemaudio/core";

export interface NoiseProps {
  playing: boolean;
  onSignal: (signal: NodeRepr_t) => void;
}
