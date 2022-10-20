import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WACParam } from "../WACParam";

export default {
  title: "WebAudio-Controls/WACParam",
  component: WACParam,
} as ComponentMeta<typeof WACParam>;

export const Gallery = () => {
  return (
    <>
      <WACParam />
    </>
  );
};
