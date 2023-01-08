import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { KnobParamLabel } from "../";

export default {
  title: "UI/KnobParamLabel",
  component: KnobParamLabel,
} as ComponentMeta<typeof KnobParamLabel>;

const Template: ComponentStory<typeof KnobParamLabel> = (args) => (
  <KnobParamLabel {...args} />
);

export const Default = Template.bind({});

Default.args = {
  id: "knob-param-label",
  label: "KNOB",
};
