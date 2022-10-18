export interface SliderProps {
  diameter?: string;
  fillColor?: string;
  trackHeight?: string;
  trackColor?: string;
  min?: number;
  step?: number;
  max?: number;
  value?: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
