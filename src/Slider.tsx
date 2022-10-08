import styled, { css } from "styled-components";

interface SliderProps {
  diameter?: string;
  fillColor?: string;
  trackHeight?: string;
  trackColor?: string;
  min?: number;
  step?: number;
  max?: number;
}

const Slider = ({
  diameter = "1.5em",
  fillColor = "#FF0000",
  trackHeight = "0.4em",
  trackColor = "#FF7000",
  min = 0,
  max = 100,
  step = 0.1,
}: SliderProps) => {
  return (
    <CSSVariables
      fillColor={fillColor}
      trackColor={trackColor}
      trackHeight={trackHeight}
      diameter={diameter}
    >
      <StyledSlider type="range" min={min} max={max} step={step} />
    </CSSVariables>
  );
};

const CSSVariables = styled.div<Partial<SliderProps>>`
  --fillColor: ${(props) => props.fillColor};
  --trackColor: ${(props) => props.trackColor};
  --trackHeight: ${(props) => props.trackHeight};
  --diameter: ${(props) => props.diameter};
`;

const track = css`
  box-sizing: border-box;
  border: none;
  height: 4px;
  background: var(--trackColor);
  border-radius: 8px;
`;

const trackFill = css`
  ${track};
  height: 6px;
  background-color: transparent;
  background-image: linear-gradient(var(--fillColor), var(--fillColor)),
    linear-gradient(var(--trackColor), var(--trackColor));
  background-size: var(--sx) 6px, calc(100% - var(--sx)) 4px;
  background-position: left center, right center;
  background-repeat: no-repeat;
`;

const fill = css`
  height: var(--trackHeight);
  background: var(--fillColor);
  border-radius: 4px;
`;

const thumb = css`
  box-sizing: border-box;
  border: none;
  width: var(--diameter);
  height: var(--diameter);
  border-radius: 50%;
  background: white;
  box-shadow: 0px 0px 5px rgba(66, 97, 255, 0.5);
`;

const StyledSlider = styled.input<SliderProps>`
  &,
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  &:focus {
    outline: none;
  }

  &:focus::-webkit-slider-thumb {
    outline: -webkit-focus-ring-color auto 5px;
  }

  &:focus::-moz-range-thumb {
    outline: -webkit-focus-ring-color auto 5px;
  }

  &:focus::-ms-thumb {
    outline: -webkit-focus-ring-color auto 5px;
  }

  --range: calc(var(--max) - var(--min));
  --ratio: calc((var(--val) - var(--min)) / var(--range));
  --sx: calc(0.5 * var(--diameter) + var(--ratio) * (100% - var(--diameter)));

  margin: 0;
  padding: 0;
  height: var(--diameter);
  background: transparent;
  font: 1em/1 arial, sans-serif;

  width: 80%;

  &::-webkit-slider-runnable-track {
    ${trackFill};
  }

  &::-moz-range-track {
    ${track};
  }

  &::-ms-track {
    ${track};
  }

  &::-moz-range-progress {
    ${fill};
  }

  &::-ms-fill-lower {
    ${fill};
  }

  &::-webkit-slider-thumb {
    margin-top: calc(0.5 * (var(--trackHeight) - var(--diameter)));
    ${thumb};
  }

  &::-moz-range-thumb {
    ${thumb};
  }

  &::-ms-thumb {
    margin-top: 0;
    ${thumb};
  }

  &::-ms-tooltip {
    display: none;
  }

  &::-moz-focus-outer {
    border: 0;
  }
`;

export default Slider;
