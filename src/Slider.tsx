import React, { FC } from "react";
import styled, { css } from "styled-components";
import { SliderProps } from "./Slider.types";

export const Slider: FC<SliderProps> = ({
  diameter = "1.5em",
  fillColor = "#FF0000",
  trackHeight = "0.4em",
  trackColor = "#FF7000",
  tickList,
  tickColor,
  tickPadding = "0.75em",
  min = 0,
  max = 100,
  step = 0.1,
  onChange,
}: SliderProps) => {
  return (
    <CSSVariables
      fillColor={fillColor}
      trackColor={trackColor}
      trackHeight={trackHeight}
      diameter={diameter}
    >
      {!tickList ? (
        <StyledSlider
          type="range"
          min={min}
          max={max}
          step={step}
          onChange={onChange}
        />
      ) : (
        <>
          <StyledSlider
            type="range"
            min={0}
            max={tickList.length - 1}
            step={1}
            onChange={onChange}
          />
          <Ticks padding={tickPadding}>
            {tickList.map((tick) => (
              <Tick color={tickColor} key={tick}>
                <TickText color={tickColor}>{tick}</TickText>
              </Tick>
            ))}
          </Ticks>
        </>
      )}
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
  box-shadow: 0 0 5px rgba(66, 97, 255, 0.5);
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

  width: 100%;

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

const Ticks = styled.div<{ padding: string }>`
  margin: 0;
  padding-top: 0.5em;
  padding-left: ${({ padding }) => padding};
  padding-right: ${({ padding }) => padding};
  display: flex;
  justify-content: space-between;
`;

const Tick = styled.span`
  position: relative;
  display: flex;
  justify-content: center;
  width: 2px;
  background: ${({ color }) => color};
  height: 7px;
  line-height: 32px;
  margin-bottom: 20px;
`;

const TickText = styled.div`
  color: ${({ color }) => color};
  font-size: 0.75rem;
  text-transform: none;
`;
