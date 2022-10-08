import styled from "styled-components";

interface PlayPauseButtonProps {
  backgroundColor?: string;
  hoverColor?: string;
  playing?: boolean;
  onClick?: () => void;
}

export const PlayPauseButton = (props: PlayPauseButtonProps) => {
  return <StyledPlayPauseButton {...props} />;
};

const StyledPlayPauseButton = styled.button<PlayPauseButtonProps>`
  border: 0;
  background: transparent;
  box-sizing: border-box;
  width: 0;
  height: 74px;

  border-color: transparent transparent transparent
    ${(props) => props.backgroundColor ?? "#FF0000"};
  transition: 100ms all ease;
  cursor: pointer;

  border-style: ${(props) => (props.playing ? "double" : "solid")};
  border-width: ${(props) =>
    props.playing ? "0px 0 0px 60px" : "37px 0 37px 60px"};

  &:hover {
    border-color: transparent transparent transparent
      ${(props) => props.hoverColor ?? "#FF7000"};
  }
`;
