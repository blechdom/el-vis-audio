import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import Slider from "../Slider";

export default {
  title: "UI/Slider",
  component: Slider,
} as ComponentMeta<typeof Slider>;

const Template: ComponentStory<typeof Slider> = (args) => <Slider {...args} />;

export const Default = Template.bind({});

Default.args = {
  diameter: "1.5em",
  fillColor: "#FF0000",
  trackHeight: "0.4em",
  trackColor: "#FF7000",
  min: 0,
  max: 100,
  step: 0.1,
};
