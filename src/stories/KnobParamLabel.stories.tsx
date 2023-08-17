import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { KnobParamLabel } from "../";

export default {
  title: "UI/KnobParamLabel",
  component: KnobParamLabel,
} as ComponentMeta<typeof KnobParamLabel>;

const Template: ComponentStory<typeof KnobParamLabel> = (args) => (
  <>
    <KnobParamLabel {...args} />
    <br />
    <KnobParamLabel
      id={"knob-param-label-big"}
      label={"big knob"}
      diameter={200}
      labelWidth={200}
      fontSize={25}
      tooltip={"big knob tooltip"}
    />
  </>
);

export const Default = Template.bind({});

Default.args = {
  id: "knob-param-label",
  label: "KNOB",
  diameter: 25,
  labelWidth: 35,
  fontSize: 11,
  tooltip: "test tooltip",
};
