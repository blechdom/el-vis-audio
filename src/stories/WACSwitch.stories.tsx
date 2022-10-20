import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WACSwitch } from "../WACSwitch";

export default {
  title: "WebAudio-Controls/WACSwitch",
  component: WACSwitch,
} as ComponentMeta<typeof WACSwitch>;

export const Gallery = () => {
  return (
    <>
      <WACSwitch />
      <WACSwitch src="./knobs/switch_toggle.png" />
      <WACSwitch src="./knobs/redbutton128.png" />
    </>
  );
};

const Template: ComponentStory<typeof WACSwitch> = (args) => (
  <WACSwitch {...args} />
);

export const Default = Template.bind({});

Default.args = {};
