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
      <WACSwitch src="./images/switch_toggle.png" />
      <WACSwitch src="./images/redbutton128.png" />
      <WACSwitch src="./images/green_button.png" />
      <WACSwitch src="./images/power_switch.png" />
      <WACSwitch src="./images/prophet5_button.png" />
      <WACSwitch src="./images/solo.png" />
      <WACSwitch src="./images/stainless_switch.png" />
      <WACSwitch src="./images/switch_mode.png" />
      <WACSwitch src="./images/switch_slide.png" />
      <WACSwitch src="./images/golfBallButton.png" />
      <WACSwitch src="./images/switch_press.png" />
      <WACSwitch src="./images/golfBallSwitchBW.png" />
    </>
  );
};

const Template: ComponentStory<typeof WACSwitch> = (args) => (
  <WACSwitch {...args} />
);

export const Default = Template.bind({});

Default.args = {};
