import React, { FC, ReactNode, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { useDrag, useGesture, usePinch } from "@use-gesture/react";
import { GesturesProps } from "./Gestures.types";
import { FullGestureState } from "@use-gesture/core/src/types/state";

// import { UserGestureConfig } from "@use-gesture/core/src/types/config";
// const config: UserGestureConfig = {};

type AllGestureStates =
  | FullGestureState<"drag">
  | FullGestureState<"pinch">
  | FullGestureState<"wheel">
  | FullGestureState<"scroll">
  | FullGestureState<"move">
  | FullGestureState<"hover">
  | null;

export const Gestures: FC<GesturesProps> = ({}) => {
  const [gestureState, setGestureState] = useState<AllGestureStates>(null);
  const [dragState, setDragState] =
    useState<FullGestureState<"drag"> | null>(null);
  const [pinchState, setPinchState] =
    useState<FullGestureState<"pinch"> | null>(null);

  const gestureTypes = useMemo(() => {
    let types = [];
    if (gestureState !== null) {
      if (gestureState.moving !== undefined && gestureState.moving) {
        types.push("move");
      }
      if (gestureState.dragging !== undefined && gestureState.dragging) {
        types.push("drag");
      }
      if (gestureState.pinching !== undefined && gestureState.pinching) {
        types.push("pinch");
      }
      if (gestureState.wheeling !== undefined && gestureState.wheeling) {
        types.push("wheel");
      }
      if (gestureState.scrolling !== undefined && gestureState.scrolling) {
        types.push("scroll");
      }
      if (gestureState.hovering !== undefined && gestureState.hovering) {
        types.push("hover");
      }
    }
    if (types.length === 0) {
      types.push("unknown");
    }
    return types;
  }, [gestureState]);

  const gestureKeys = useMemo(() => {
    let keys = [];
    if (gestureState !== null) {
      if (gestureState.shiftKey) {
        keys.push("shift");
      }
      if (gestureState.altKey) {
        keys.push("alt");
      }
      if (gestureState.metaKey) {
        keys.push("meta");
      }
      if (gestureState.ctrlKey) {
        keys.push("ctrl");
      }
    }
    if (keys.length === 0) {
      keys.push("none");
    }
    return keys;
  }, [gestureState]);

  const bind = useGesture({
    onDrag: (state) => {
      setGestureState(state);
      setDragState(state);
    },
    onPinch: (state) => {
      setGestureState(state);
      setPinchState(state);
    },
    onScroll: (state) => setGestureState(state),
    onMove: (state) => setGestureState(state),
    onWheel: (state) => setGestureState(state),
    onHover: (state) => setGestureState(state),
    // config,
  });

  //const bindPinch = usePinch((state) => setPinchState(state));
  // const bindDrag = useDrag((state) => setDragState(state));

  return (
    <>
      <Outline {...bind()} />
      <h3>Gesture State</h3>
      {gestureState && (
        <ul>
          <li>type(s):{gestureTypes.map((type) => ` ${type}`)}</li>
          <li>touches: {gestureState.touches}</li>
          <li>pressed: {gestureState.pressed ? "true" : "false"}</li>
          <li>down: {gestureState.down ? "true" : "false"}</li>
          <li>locked: {gestureState.locked ? "true" : "false"}</li>
          <li>buttons: {gestureState.buttons}</li>
          <li>key(s):{gestureKeys.map((key) => ` ${key}`)}</li>
          <li>intentional: {gestureState.intentional ? "true" : "false"}</li>
          <li>
            values:{" "}
            {`x: ${gestureState.values[0]}   y: ${gestureState.values[1]}`}
          </li>
          <li>
            distance:{" "}
            {`x: ${gestureState.distance[0]}   y: ${gestureState.distance[1]}`}
          </li>
          <li>
            movement:{" "}
            {`x: ${gestureState.movement[0]}   y: ${gestureState.movement[1]}`}
          </li>
          <li>
            delta: {`x: ${gestureState.delta[0]}   y: ${gestureState.delta[1]}`}
          </li>
          <li>
            offset:{" "}
            {`x: ${gestureState.offset[0]}   y: ${gestureState.offset[1]}`}
          </li>
          <li>
            last offset:{" "}
            {`x: ${gestureState.lastOffset[0]}   y: ${gestureState.lastOffset[1]}`}
          </li>
          <li>
            velocity:{" "}
            {`x: ${gestureState.velocity[0].toFixed(
              4
            )}   y: ${gestureState.velocity[1].toFixed(4)}`}
          </li>
          <li>
            initial:{" "}
            {`x: ${gestureState.initial[0]}   y: ${gestureState.initial[1]}`}
          </li>
          <li>
            direction:{" "}
            {`x: ${gestureState.direction[0]}   y: ${gestureState.direction[1]}`}
          </li>
          <li>
            overflow:{" "}
            {`x: ${gestureState.overflow[0]}   y: ${gestureState.overflow[1]}`}
          </li>
          <li>first: {gestureState.first ? "true" : "false"}</li>
          <li>last: {gestureState.last ? "true" : "false"}</li>
          <li>active: {gestureState.active ? "true" : "false"}</li>
          <li>startTime: {gestureState.startTime}</li>
          <li>timeStamp: {gestureState.timeStamp}</li>
          <li>elapsedTime: {gestureState.elapsedTime}</li>
          <li>event type: {gestureState.type}</li>
          <li>(Drag Only) axis: {dragState?.axis}</li>
          <li>
            (Drag Only) swipe:{" "}
            {`x: ${dragState?.swipe[0]}   y: ${dragState?.swipe[1]}`}
          </li>
          <li>(Drag Only) tap: {dragState?.tap}</li>
          <li>(Drag Only) canceled: {dragState?.canceled}</li>
          <li>(Pinch Only) axis: {pinchState?.axis}</li>
          <li>
            (Pinch Only) origin{" "}
            {`x: ${pinchState?.origin[0]}   y: ${pinchState?.origin[1]}`}
          </li>
          <li>(Pinch Only) turns: {pinchState?.turns}</li>
          <li>(Pinch Only) canceled: {pinchState?.canceled}</li>
        </ul>
      )}
    </>
  );
};

const Outline = styled.div<Partial<GesturesProps>>`
  touch-action: none;
  width: 100%;
  height: 200px;
  border: 1px solid #000;
`;
