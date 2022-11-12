import React from "react";

export interface SliderProps {
  diameter?: string;
  fillColor?: string;
  trackHeight?: string;
  trackColor?: string;
  tickList?: string[];
  tickColor?: string;
  tickPadding?: string;
  min?: number;
  step?: number;
  max?: number;
  value?: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
