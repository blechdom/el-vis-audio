import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WebAudioParam } from "../WebAudioParam";

export default {
  title: "WebAudio-Controls/WebAudioParam",
  component: WebAudioParam,
} as ComponentMeta<typeof WebAudioParam>;

export const Gallery = () => {
  return (
    <>
      <WebAudioParam />
    </>
  );
};
