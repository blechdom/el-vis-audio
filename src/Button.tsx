import React from "react";
import styled from "styled-components";

interface ButtonProps {
  backgroundColor?: string;
  hoverColor?: string;
  label?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, ...props }) => {
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

export default Button;
