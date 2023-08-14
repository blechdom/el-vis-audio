import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { WeierstrassFunctionPM } from "../";

export default {
  title: "Experiments/WeierstrassFunctionPM",
  component: WeierstrassFunctionPM,
} as ComponentMeta<typeof WeierstrassFunctionPM>;

const Template: ComponentStory<typeof WeierstrassFunctionPM> = () => (
  <WeierstrassFunctionPM />
);

export const Default = Template.bind({});
