import { el, NodeRepr_t } from "@elemaudio/core";

export function cycleByPhasor(phasor: NodeRepr_t | number) {
  return el.sin(el.mul(2 * Math.PI, phasor));
}

export const exponentialScale = function (value: number): number {
  const a = 10;
  const b = Math.pow(a, 1 / a);
  return a * Math.pow(b, value);
};

export const toLog = function (
  value: number,
  min: number,
  max: number
): number {
  const exp = (value - min) / (max - min);
  return min * Math.pow(max / min, exp);
};
