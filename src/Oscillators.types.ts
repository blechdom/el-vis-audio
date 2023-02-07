import { NodeRepr_t } from "@elemaudio/core";

export interface OscillatorsProps {
  playing: boolean;
  onSignal: (signal: NodeRepr_t) => void;
}
