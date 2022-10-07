import { ComponentStory, ComponentMeta } from "@storybook/react";

import Slider from "../Slider";

export default {
  title: "UI/Slider",
  component: Slider,
} as ComponentMeta<typeof Slider>;

const Template: ComponentStory<typeof Slider> = (args) => <Slider {...args} />;

export const Default = Template.bind({});

Default.args = {
  type: "range",
  min: 0,
  step: 0.1,
  max: 100,
};
