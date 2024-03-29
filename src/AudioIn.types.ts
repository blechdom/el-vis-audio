import { NodeRepr_t } from "@elemaudio/core";

export interface AudioInProps {
  startingSignal?: "audioFile" | "oscillators" | "noise" | "liveInput";
  playing: boolean;
  onSignal: (signal: NodeRepr_t) => void;
}
