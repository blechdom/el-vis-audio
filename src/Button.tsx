import React, { FC } from "react";
import styled from "styled-components";
import { ButtonProps } from "./Button.types";

export const Button: FC<ButtonProps> = ({ label, ...props }) => {
  return <StyledButton {...props}>{label}</StyledButton>;
};

const StyledButton = styled.button<ButtonProps>`
  font-weight: 700;
  border: 0;
  border-radius: 0.5em;
  cursor: pointer;
  display: inline-block;
  line-height: 1;
  color: white;
  background-color: ${(props) => props.backgroundColor ?? "#FF0000"};
  font-size: 14px;
  padding: 11px 20px;
  &:hover {
    background: ${(props) => props.hoverColor ?? "#FF7000"};
  }
`;
