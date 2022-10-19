import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WebAudioSlider } from "../WebAudioSlider";

export default {
  title: "WebAudio-Controls/WebAudioSlider",
  component: WebAudioSlider,
} as ComponentMeta<typeof WebAudioSlider>;

export const Gallery = () => {
  return (
    <>
      <WebAudioSlider />
      <WebAudioSlider
        src={"./img/hsliderbody.png"}
        knobsrc={"./img/hsliderknob.png"}
        tracking={"rel"}
      />
      <br />
      <WebAudioSlider
        src={"./img/vsliderbody.png"}
        knobsrc={"./img/vsliderknob.png"}
        tracking={"rel"}
      />
    </>
  );
};

const Template: ComponentStory<typeof WebAudioSlider> = (args) => (
  <WebAudioSlider {...args} />
);

export const Default = Template.bind({});

Default.args = {};
