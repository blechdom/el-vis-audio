export interface KnobParamLabelProps {
  id?: string;
  key?: string;
  color?: string;
  backgroundColor?: string;
  hoverColor?: string;
  width?: number;
  height?: number;
  diameter?: number;
  textHeight?: number;
  knobValue?: number;
  label?: string;
  log?: 0 | 1;
  min?: number;
  max?: number;
  step?: number;
  onKnobInput?: (value: number) => void;
  onChange?: (value: number) => void;
  onKnobEvent?: (event: any) => void;
  src?: string | null;
}
