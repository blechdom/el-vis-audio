import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WebAudioSwitch } from "../WebAudioSwitch";

export default {
  title: "WebAudio-Controls/WebAudioSwitch",
  component: WebAudioSwitch,
} as ComponentMeta<typeof WebAudioSwitch>;

export const Gallery = () => {
  return (
    <>
      <WebAudioSwitch />
      <WebAudioSwitch src="./knobs/switch_toggle.png" />
      <WebAudioSwitch src="./knobs/redbutton128.png" />
    </>
  );
};

const Template: ComponentStory<typeof WebAudioSwitch> = (args) => (
  <WebAudioSwitch {...args} />
);

export const Default = Template.bind({});

Default.args = {};
