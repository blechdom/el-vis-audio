import { FC } from "react";
import styled from "styled-components";
import { SwitchProps } from "./Switch.types";

const Switch: FC<SwitchProps> = (props) => {
  return (
    <SwitchWrapper>
      <SwitchBox id="checkbox" type="checkbox" />
      <SwitchLabel htmlFor="checkbox" />
    </SwitchWrapper>
  );
};

const SwitchWrapper = styled.div`
  position: relative;
  caret-color: rgba(0, 0, 0, 0);
`;
const SwitchLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;
const SwitchBox = styled.input<SwitchProps>`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${SwitchLabel} {
    background: ${(props) => props.backgroundColor ?? "#FF0000"};
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;

export default Switch;
