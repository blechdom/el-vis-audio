import React, { FC, useMemo, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import styled, { css } from "styled-components";
import { useDrag } from "@use-gesture/react";
import { XYSpringProps } from "./XYSpringBox.types";

export const XYSpringBox: FC<XYSpringProps> = ({
  children,
  width = 500,
  height = 300,
  offset = 100,
}) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);

  const adjustedX = useMemo(() => {
    const minX = Math.floor(offset / 2);
    const maxX = width - Math.floor(offset / 2);
    return Math.min(Math.max(mouseX, minX), maxX) - minX;
  }, [mouseX, offset, width]);

  const adjustedY = useMemo(() => {
    const minY = Math.floor(offset / 2);
    const maxY = height - Math.floor(offset / 2);
    return Math.min(Math.max(mouseY, minY), maxY) - minY;
  }, [mouseY, offset, height]);

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(
    ({ down, offset: [ox, oy], xy: [x, y] }) => {
      setMouseX(x);
      setMouseY(y);
      api.start({ x: ox, y: oy, immediate: down });
    },
    {
      bounds: {
        left: 0,
        right: width - offset,
        top: 0,
        bottom: height - offset,
      },
    }
  );

  return (
    <>
      <Outline width={width} height={height}>
        <animated.div {...bind()} style={{ x, y }}>
          {children}
        </animated.div>
      </Outline>
      [ x: {adjustedX}, y: {adjustedY} ]
    </>
  );
};

const Outline = styled.div<Partial<XYSpringProps>>`
  touch-action: none;
  width: ${(props) => props.width + "px"};
  height: ${(props) => props.height + "px"};
  border: 1px solid #000;
`;
