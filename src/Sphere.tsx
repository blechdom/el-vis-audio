import React, { FC } from "react";
import styled, { css } from "styled-components";
import { SphereProps } from "./Sphere.types";

export const Sphere: FC<SphereProps> = ({
  diameter = "300px",
  perspective = "100px",
  backgroundColor = "#000",
  fillColor = "#ff0000",
}: SphereProps) => {
  return (
    <Ball
      fillColor={fillColor}
      backgroundColor={backgroundColor}
      diameter={diameter}
      perspective={perspective}
    />
  );
};

const Ball = styled.figure<Partial<SphereProps>>`
  caret-color: transparent;
  display: block;
  background: ${(props) => props.fillColor};
  margin: 0;
  border-radius: 50%;
  height: ${(props) => props.diameter};
  width: ${(props) => props.diameter};
  background: radial-gradient(
    circle at ${(props) => props.perspective} ${(props) => props.perspective},
    ${(props) => props.fillColor},
    ${(props) => props.backgroundColor}
  );
`;
