import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WACKeyboard } from "../WACKeyboard";

export default {
  title: "WebAudio-Controls/WACKeyboard",
  component: WACKeyboard,
} as ComponentMeta<typeof WACKeyboard>;

export const Gallery = () => {
  return (
    <>
      <WACKeyboard />
    </>
  );
};
