import React, { FC } from "react";
import styled from "styled-components";
import { OscilloscopeSpectrogramProps } from "./OscilloscopeSpectrogram.types";
import { core, Oscilloscope, Spectrogram } from "./";

export const OscilloscopeSpectrogram: FC<OscilloscopeSpectrogramProps> = ({
  audioVizData,
  fftVizData,
  width = 400,
  height = 100,
  backgroundColor = "#FFFFFF",
  oscilloscopeColor = "#666666",
  spectrogramColor = "#FF0000",
}) => {
  return (
    <StyledOscilloscopeSpectrogram
      width={width}
      height={height}
      backgroundColor={backgroundColor}
    >
      <StyledAnalysis>
        <Oscilloscope
          audioVizData={audioVizData}
          color={oscilloscopeColor}
          width={width}
          height={height}
        />
      </StyledAnalysis>
      <StyledAnalysis>
        <Spectrogram
          height={height}
          width={width}
          fftVizData={fftVizData}
          color={spectrogramColor}
        />
      </StyledAnalysis>
    </StyledOscilloscopeSpectrogram>
  );
};

const StyledOscilloscopeSpectrogram = styled.div<
  Partial<OscilloscopeSpectrogramProps>
>`
  position: relative;
  background-color: ${(props) => props.backgroundColor};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const StyledAnalysis = styled.div<Partial<OscilloscopeSpectrogramProps>>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  position: absolute;
  top: 0;
  left: 0;
`;
